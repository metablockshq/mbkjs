import {
  Commitment,
  Connection,
  Keypair,
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';

import log from 'loglevel';
import { KyraaError, LangErrorCode, LangErrorMessage } from '../error';
import { BlockhashAndFeeCalculator, SequenceType } from '../types';

const DEFAULT_TIMEOUT = 15000;

export const sendTransactions = async (
  connection: Connection,
  wallet: any,
  instructionSet: TransactionInstruction[][],
  //signersSet: Keypair[][],
  sequenceType: SequenceType = SequenceType.Parallel,
  commitment: Commitment = 'singleGossip',
  successCallback: (txid: string, ind: number) => void = (_txid, _ind) => {},
  failCallback: (reason: string, ind: number) => void = (txid, ind) => {
    new KyraaError({
      errorCode: LangErrorCode.TransactionError,
      message: 'Failed with  txid ' + txid + ' Index at ' + ind,
    });
  },
  block?: BlockhashAndFeeCalculator,
  beforeTransactions: Transaction[] = [],
  afterTransactions: Transaction[] = []
): Promise<{ number: number; txs: { txid: string; slot: number }[] }> => {
  //console.log('Sending transactions ::', Date.now());

  if (!wallet.publicKey) throw new Error('Wallet not connected');

  const unsignedTxns: Transaction[] = beforeTransactions;

  if (!block) {
    block = await connection.getRecentBlockhash(commitment);
  }

  for (let i = 0; i < instructionSet.length; i++) {
    const instructions = instructionSet[i];
    //const signers = signersSet[i];

    if (instructions.length === 0) {
      continue;
    }

    let transaction = new Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = block.blockhash;

    const transactionSigners = [];

    // if ((signers !== undefined || signers !== null) && signers.length > 0) {
    //   transactionSigners.push(...signers?.map((s) => s.publicKey));
    // }
    transactionSigners.push(wallet.publicKey);

    transaction.setSigners(
      // fee payed by the wallet owner
      ...transactionSigners
    );

    // if (signers.length > 0) {
    //   transaction.partialSign(...signers);
    // }

    unsignedTxns.push(transaction);
  }
  unsignedTxns.push(...afterTransactions);

  //console.log('UNSIGNED ', unsignedTxns);

  const partiallySignedTransactions = unsignedTxns.filter((t) =>
    t.signatures.find((sig) => sig.publicKey.equals(wallet.publicKey))
  );

  //console.log('PARTIAL', partiallySignedTransactions);
  const fullySignedTransactions = unsignedTxns.filter(
    (t) => !t.signatures.find((sig) => sig.publicKey.equals(wallet.publicKey))
  );

  //console.log('FULLY', fullySignedTransactions);

  let signedTxns = await wallet.signAllTransactions(
    partiallySignedTransactions
  );
  signedTxns = fullySignedTransactions.concat(signedTxns);
  const pendingTxns: Promise<{ txid: string; slot: number }>[] = [];

  log.info(
    'Signed txns length',
    signedTxns.length,
    'vs handed in length',
    instructionSet.length
  );

  // console.info(
  //   'Signed txns length',
  //   signedTxns.length,
  //   'vs handed in length',
  //   instructionSet.length
  // );
  for (let i = 0; i < signedTxns.length; i++) {
    const signedTxnPromise = sendSignedTransaction({
      connection,
      signedTransaction: signedTxns[i],
    });

    if (sequenceType !== SequenceType.Parallel) {
      try {
        await signedTxnPromise.then(({ txid }) => successCallback(txid, i));
        pendingTxns.push(signedTxnPromise);
      } catch (e) {
        log.info('Failed at txn index:', i);
        log.info('Caught failure:', e);

        //throw new KyraaError(e);

        console.info('Failed at txn index:', i);
        console.info('Caught failure:', e);

        failCallback(signedTxns[i], i);
        if (sequenceType === SequenceType.StopOnFailure) {
          return {
            number: i,
            txs: await Promise.all(pendingTxns),
          };
        }
      }
    } else {
      pendingTxns.push(signedTxnPromise);
    }
  }

  if (sequenceType !== SequenceType.Parallel) {
    const result = await Promise.all(pendingTxns);
    //console.log('Done sending transactions :: ', Date.now());
    return { number: signedTxns.length, txs: result };
  }

  //console.log('Done sending transactions :: ', Date.now());
  return { number: signedTxns.length, txs: await Promise.all(pendingTxns) };
};

export async function sendSignedTransaction({
  signedTransaction,
  connection,
  timeout = DEFAULT_TIMEOUT,
}: {
  signedTransaction: Transaction;
  connection: Connection;
  sendingMessage?: string;
  sentMessage?: string;
  successMessage?: string;
  timeout?: number;
}): Promise<{ txid: string; slot: number }> {
  const rawTransaction = signedTransaction.serialize();

  const startTime = getUnixTs();
  let slot = 0;
  const txid: TransactionSignature = await connection.sendRawTransaction(
    rawTransaction,
    {
      skipPreflight: true,
    }
  );

  log.info('Started awaiting confirmation for', txid);

  let done = false;
  (async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      });
      await sleep(500);
    }
  })();
  try {
    const confirmation = await awaitTransactionSignatureConfirmation(
      txid,
      timeout,
      connection,
      'recent',
      true
    );

    if (!confirmation)
      throw new KyraaError({
        errorCode: LangErrorCode.ConfirmationError,
        message: LangErrorMessage.get(LangErrorCode.ConfirmationError),
      });

    if (confirmation.err) {
      log.error(confirmation.err);
      //console.error(confirmation.err);
      //throw new Error('Transaction failed: Custom instruction error');
      throw new KyraaError({
        err: confirmation.err,
        message: LangErrorMessage.get(LangErrorCode.ConfirmationError),
        errorCode: LangErrorCode.ConfirmationError,
      });
    }

    slot = confirmation?.slot || 0;
  } catch (err) {
    log.error('Timeout Error caught', err);
    console.error('Timeout Error caught', err);
    let errs: any = err;
    if (errs.timeout) {
      throw new KyraaError({
        errorCode: LangErrorCode.TimedOutError,
        message: LangErrorMessage.get(LangErrorCode.TimedOutError),
        err: errs,
      });
    }
    let simulateResult: SimulatedTransactionResponse | null = null;
    try {
      simulateResult = (
        await simulateTransaction(connection, signedTransaction, 'single')
      ).value;
    } catch (e) {}
    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i];
          if (line.startsWith('Program log: ')) {
            throw new KyraaError({
              err: simulateResult.err,
              message:
                'Transaction failed: ' + line.slice('Program log: '.length),
              errorCode: LangErrorCode.SimulationError,
            });
            // throw new Error(
            //   'Transaction failed: ' + line.slice('Program log: '.length)
            // );
          }
        }
      }
      //throw new Error(JSON.stringify(simulateResult.err));
      throw new KyraaError({
        err: simulateResult.err,
        message: LangErrorMessage.get(LangErrorCode.SimulationError),
        errorCode: LangErrorCode.SimulationError,
      });
    }
    // throw new Error('Transaction failed');
  } finally {
    done = true;
  }

  log.info('Latency', txid, getUnixTs() - startTime);
  return { txid, slot };
}

export const getUnixTs = () => {
  return new Date().getTime() / 1000;
};

async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching
  );

  //console.log('IN simulateTransaction');
  const signData = transaction.serializeMessage();
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString('base64');
  const config: any = { encoding: 'base64', commitment };
  const args = [encodedTransaction, config];

  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args);
  if (res.error) {
    //throw new Error('failed to simulate transaction: ' + res.error.message);
    throw new KyraaError({
      err: res.error,
      message: res.error.message,
      errorCode: LangErrorCode.SimulationError,
    });
  }
  return res.result;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection,
  commitment: Commitment = 'recent',
  queryStatus = false
): Promise<SignatureStatus | null | void> {
  let done = false;
  let status: SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  let subId = 0;
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return;
      }
      done = true;
      log.info('Rejecting for timeout...');
      //console.info('Rejecting for timeout...');
      reject({ timeout: true });
    }, timeout);
    try {
      subId = connection.onSignature(
        txid,
        //@ts-ignore
        (result, context) => {
          done = true;
          status = {
            err: result.err,
            slot: context.slot,
            confirmations: 0,
          };
          if (result.err) {
            log.info('Rejected via websocket', result.err);
            // console.info('Rejected via websocket', result.err);
            reject(status);
          } else {
            log.info('Resolved via websocket', result);
            //console.info('Resolved via websocket', result);
            resolve(status);
          }
        },
        commitment
      );
    } catch (e) {
      done = true;
      log.error('WS error in setup', txid, e);
      //console.error('WS error in setup', txid, e);
    }
    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
              log.info('REST null result for', txid, status);
              // console.info('REST null result for', txid, status);
            } else if (status.err) {
              log.info('REST error for', txid, status);
              // console.info('REST error for', txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              log.info('REST no confirmations for', txid, status);
              // console.info('REST no confirmations for', txid, status);
            } else {
              log.info('REST confirmation for', txid, status);
              // console.info('REST confirmation for', txid, status);
              done = true;
              resolve(status);
            }
          }
        } catch (e) {
          if (!done) {
            log.info('REST connection error: txid', txid, e);
            // console.info('REST connection error: txid', txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  //@ts-ignore
  if (connection._signatureSubscriptions[subId])
    connection.removeSignatureListener(subId);
  done = true;
  log.info('Returning status', status);
  // console.info('Returning status', status);
  return status;
}
