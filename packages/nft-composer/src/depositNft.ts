import {
  getMetaBlocksProgram,
  getMetaNftProgram,
  getMetaTreasuryProgram,
} from './factory';
import { Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  GroupedDepositNftApiArgs,
  GroupedDepositRawNftApiArgs,
  SendTxRequest,
  SequenceType,
} from './types';

import { KyraaError, LangErrorMessage } from './error';

import { getPdaKeys, PdaKeys } from './pda';

import {
  getCreateCpiMetaNftInstruction,
  getInitCpiMetaNftInstruction,
  getDepositNftInstruction,
  getInitMetaBlocksAuthorityInstruction,
  getInitReceiptInstruction,
} from './instructions/depositInstructions';
import { getRawTokenAccount } from './accounts';
import * as configApi from './configApi';
import { sendTransactions } from './utils/transaction';
import { getMetaNftUrl, getReceiptUrl } from './getApi';

const depositNft = async (args: GroupedDepositNftApiArgs) => {
  try {
    const metaNftUrl = await getMetaNftUrl({
      walletAddress: args.wallet.publicKey.toString(),
      universeAddress: args.universeKey.toString(),
      cluster: args.cluster,
    });

    const receiptUrl = await getReceiptUrl({
      arweaveUrl: args.arweaveUrl,
      walletAddress: args.wallet.publicKey.toString(),
      universeAddress: args.universeKey.toString(),
      cluster: args.cluster,
    });

    const sendTxRequests: Array<SendTxRequest> = [];

    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const metaNftProgram = getMetaNftProgram(args.connection, args.wallet);

    const metaTreasuryProgram = getMetaTreasuryProgram(
      args.connection,
      args.wallet
    );
    const treasuryData = await configApi.fetchTreasuryData(metaTreasuryProgram);
    const treasuryAuthority = treasuryData.authority;

    // console.log('The treasury authority is ', treasuryAuthority.toString());

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
      const initMetaBlocksAuthorityInstruction = await getInitMetaBlocksAuthorityInstruction(
        {
          pdaKeys: pdaKeys,
          usersKey: usersKey,
          program: program,
        }
      );
      transaction1.add(initMetaBlocksAuthorityInstruction);
    }

    try {
      await metaNftProgram.account.metaNft.fetch(pdaKeys.metaNft);
    } catch (err) {
      const initMetaNftInstruction = await getInitCpiMetaNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        treasuryAuthority: treasuryAuthority,
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
        uri: metaNftUrl,
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
      treasuryAuthority: treasuryAuthority,
    });
    transaction2.add(initReceiptInstruction);

    //depositInstruction
    const depositInstruction = await getDepositNftInstruction({
      uri: receiptUrl,
      name: args.receiptName,
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
      isReceiptMasterEdition: args.isReceiptMasterEdition,
      treasuryAuthority: treasuryAuthority,
    });
    transaction2.add(depositInstruction);

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
    const metaNftUrl = await getMetaNftUrl({
      walletAddress: args.wallet.publicKey.toString(),
      universeAddress: args.universeKey.toString(),
      cluster: args.cluster,
    });

    const receiptUrl = await getReceiptUrl({
      arweaveUrl: args.arweaveUrl,
      walletAddress: args.wallet.publicKey.toString(),
      universeAddress: args.universeKey.toString(),
      cluster: args.cluster,
    });

    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const metaNftProgram = getMetaNftProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const metaTreasuryProgram = getMetaTreasuryProgram(
      args.connection,
      args.wallet
    );
    const treasuryData = await configApi.fetchTreasuryData(metaTreasuryProgram);
    const treasuryAuthority = treasuryData.authority;

    //console.log('The treasury authority is ', treasuryAuthority.toString());

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
      const initMetaBlocksAuthorityInstruction = await getInitMetaBlocksAuthorityInstruction(
        {
          pdaKeys: pdaKeys,
          usersKey: usersKey,
          program: program,
        }
      );
      initInstructions.push(initMetaBlocksAuthorityInstruction);
    }

    try {
      await metaNftProgram.account.metaNft.fetch(pdaKeys.metaNft);
    } catch (err) {
      const initMetaNftInstruction = await getInitCpiMetaNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        treasuryAuthority: treasuryAuthority,
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
        uri: metaNftUrl,
      });
      //createCpiInstructions.push(createCpiMetaNftInstruction);
      initInstructions.push(createCpiMetaNftInstruction);
    }

    //  deposit instructions
    const depositInstructions = [];

    const initReceiptInstruction = await getInitReceiptInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
      treasuryAuthority: treasuryAuthority,
    });
    depositInstructions.push(initReceiptInstruction);

    const depositInstruction = await getDepositNftInstruction({
      uri: receiptUrl,
      name: args.receiptName,
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
      isReceiptMasterEdition: args.isReceiptMasterEdition,
      treasuryAuthority: treasuryAuthority,
    });
    depositInstructions.push(depositInstruction);

    //console.log('Continuing New Deposit api v1');
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

    //console.log('Sending transactions....');

    const result = (
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
    return result;
  } catch (err) {
    let errs: any = err;
    console.log('Something went wrong');
    throw new KyraaError({
      err: errs,
      message: LangErrorMessage.get(errs.errorCode),
      errorCode: errs.errorCode,
    });
  }
};

const depositRawNft = async (args: GroupedDepositRawNftApiArgs) => {
  try {
    const sendTxRequests: Array<SendTxRequest> = [];

    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const metaNftProgram = getMetaNftProgram(args.connection, args.wallet);

    const metaTreasuryProgram = getMetaTreasuryProgram(
      args.connection,
      args.wallet
    );
    const treasuryData = await configApi.fetchTreasuryData(metaTreasuryProgram);
    const treasuryAuthority = treasuryData.authority;

    // console.log('The treasury authority is ', treasuryAuthority.toString());

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
      const initMetaBlocksAuthorityInstruction = await getInitMetaBlocksAuthorityInstruction(
        {
          pdaKeys: pdaKeys,
          usersKey: usersKey,
          program: program,
        }
      );
      transaction1.add(initMetaBlocksAuthorityInstruction);
    }

    try {
      await metaNftProgram.account.metaNft.fetch(pdaKeys.metaNft);
    } catch (err) {
      const initMetaNftInstruction = await getInitCpiMetaNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        treasuryAuthority: treasuryAuthority,
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
      treasuryAuthority: treasuryAuthority,
    });
    transaction2.add(initReceiptInstruction);

    //depositInstruction
    const depositInstruction = await getDepositNftInstruction({
      uri: args.receiptUrl,
      name: args.receiptName,
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
      isReceiptMasterEdition: args.isReceiptMasterEdition,
      treasuryAuthority: treasuryAuthority,
    });
    transaction2.add(depositInstruction);

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

export { depositNftV1, depositNft, depositRawNft };
