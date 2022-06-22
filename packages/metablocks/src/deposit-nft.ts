import { getMetaBlocksProgram, getMetaNftProgram } from './factory';
import { Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { GroupedDepositNftApiArgs, SequenceType } from './types';

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

export { depositNftV1 };
