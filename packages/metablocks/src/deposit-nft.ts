import { getMetaBlocksProgram, getMetaNftProgram } from './factory';
import { Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { GroupedDepositNftApiArgs, SendTxRequest, SequenceType } from './types';

import { KyraaError } from './error';

import { getPdaKeys, PdaKeys } from './pda';

import {
  getCreateCpiMetaNftInstruction,
  getDepositNftInstruction,
  getInitCpiMetaNftInstruction,
  getInitDepositInstruction,
  getInitMetaBlocksAuthorityInstruction,
  getInitReceiptInstruction,
  getTransferReceiptNftInstruction,
  getUpdateReceiptMetadataInstruction,
} from './instructions/depositInstructions';
import { getRawTokenAccount } from './accounts';
import { sendTransactions } from './accounts/transaction';

const depositNft = async (args: GroupedDepositNftApiArgs) => {
  try {
    const sendTxRequests: Array<SendTxRequest> = [];

    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const metaNftProgram = getMetaNftProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(
      args.universeKey,
      usersKey,
      args.mintKey
    );

    // transaction 1
    const transaction1 = new Transaction();

    try {
      await program.account.metaBlocksAuthority.fetch(
        pdaKeys.metaBlocksAuthority
      );
    } catch (err) {
      const initMetaBlocksAuthorityInstruction =
        await getInitMetaBlocksAuthorityInstruction({
          pdaKeys: pdaKeys,
          usersKey: usersKey,
          program: program,
        });
      transaction1.add(initMetaBlocksAuthorityInstruction);
    }

    try {
      await metaNftProgram.account.metaNft.fetch(pdaKeys.metaNft);
    } catch (err) {
      const initMetaNftInstruction = await getInitCpiMetaNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
      });
      transaction1.add(initMetaNftInstruction);
    }

    const accountInfo = await getRawTokenAccount(
      program.provider,
      pdaKeys.userMetaNftAta
    );
    if (accountInfo === null) {
      const createCpiMetaNftInstruction = await getCreateCpiMetaNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        name: args.metaNftName,
        uri: args.metaNftUrl,
      });
      transaction1.add(createCpiMetaNftInstruction);
    }

    if (transaction1.instructions.length > 0) {
      sendTxRequests.push({
        tx: transaction1,
        signers: [],
      });
    }

    // transaction 2
    const transaction2 = new Transaction();
    // initReceiptInstruction
    const initReceiptInstruction = await getInitReceiptInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });
    transaction2.add(initReceiptInstruction);

    //initDepositInstruction
    const initDepositInstruction = await getInitDepositInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });
    transaction2.add(initDepositInstruction);

    //depositNftInstruction
    const depositNftInstruction = await getDepositNftInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });
    transaction2.add(depositNftInstruction);

    //updateReceiptMetadataInstruction
    const updateReceiptMetadataInstruction =
      await getUpdateReceiptMetadataInstruction({
        uri: args.receiptUrl,
        name: args.receiptName,
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        isReceiptMasterEdition: args.isReceiptMasterEdition,
      });
    transaction2.add(updateReceiptMetadataInstruction);

    // transferReceiptNftInstruction
    const transferReceiptNftInstruction =
      await getTransferReceiptNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
      });
    transaction2.add(transferReceiptNftInstruction);

    sendTxRequests.push({
      tx: transaction2,
      signers: [],
    });

    console.log('Sending transactions ::', Date.now());
    const [tx1, tx2] = await program.provider.sendAll!(sendTxRequests);
    console.log('Done sending transactions :: ', Date.now());

    return { tx1, tx2 };
  } catch (e) {
    throw new KyraaError(e);
  }
};

const depositNftV1 = async (args: GroupedDepositNftApiArgs) => {
  console.log('New Deposit api v1');
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const metaNftProgram = getMetaNftProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(
      args.universeKey,
      usersKey,
      args.mintKey
    );

    // init instructions
    const initInstructions = [];
    try {
      await program.account.metaBlocksAuthority.fetch(
        pdaKeys.metaBlocksAuthority
      );
    } catch (err) {
      const initMetaBlocksAuthorityInstruction =
        await getInitMetaBlocksAuthorityInstruction({
          pdaKeys: pdaKeys,
          usersKey: usersKey,
          program: program,
        });
      initInstructions.push(initMetaBlocksAuthorityInstruction);
    }

    try {
      await metaNftProgram.account.metaNft.fetch(pdaKeys.metaNft);
    } catch (err) {
      const initMetaNftInstruction = await getInitCpiMetaNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
      });
      initInstructions.push(initMetaNftInstruction);
    }

    // create cpi instructions
    //const createCpiInstructions = [];
    const accountInfo = await getRawTokenAccount(
      program.provider,
      pdaKeys.userMetaNftAta
    );
    if (accountInfo === null) {
      const createCpiMetaNftInstruction = await getCreateCpiMetaNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        name: args.metaNftName,
        uri: args.metaNftUrl,
      });
      //createCpiInstructions.push(createCpiMetaNftInstruction);
      initInstructions.push(createCpiMetaNftInstruction);
    }

    // pre deposit instructions
    const depositInstructions = [];
    const initReceiptInstruction = await getInitReceiptInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });
    depositInstructions.push(initReceiptInstruction);
    const initDepositInstruction = await getInitDepositInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });
    depositInstructions.push(initDepositInstruction);

    //deposit instructions
    //const depositInstructions = [];
    const depositNftInstruction = await getDepositNftInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });
    depositInstructions.push(depositNftInstruction);

    //update receipt instructions
    //const updateReceiptInstructions = [];
    const updateReceiptMetadataInstruction =
      await getUpdateReceiptMetadataInstruction({
        uri: args.receiptUrl,
        name: args.receiptName,
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        isReceiptMasterEdition: args.isReceiptMasterEdition,
      });
    depositInstructions.push(updateReceiptMetadataInstruction);

    //transferReceiptNftInstructions
    //const transferReceiptNftInstructions = [];
    const transferReceiptNftInstruction =
      await getTransferReceiptNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
      });
    depositInstructions.push(transferReceiptNftInstruction);
    console.log('Continuing New Deposit api v1');
    const instructionsMatrix: anchor.web3.TransactionInstruction[][] = [];
    const signersMatrix: anchor.web3.Keypair[][] = [];
    signersMatrix.push([]);

    if (initInstructions.length > 0) {
      instructionsMatrix.push(initInstructions);
    }

    if (depositInstructions.length > 0) {
      instructionsMatrix.push(depositInstructions);
    }

    const beforeTransactions: Transaction[] = [];
    const afterTransactions: Transaction[] = [];

    console.log('Sending transactions....');

    return (
      await sendTransactions(
        args.connection,
        args.wallet,
        instructionsMatrix,
        //signersMatrix,
        SequenceType.StopOnFailure,
        'singleGossip',
        () => {},
        () => false,
        undefined,
        beforeTransactions,
        afterTransactions
      )
    ).txs.map((t: any) => t.txid);
  } catch (e) {
    console.log('Something went wrong');
    throw new KyraaError(e);
  }
};

export { depositNftV1, depositNft };
