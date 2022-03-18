import { getMetaBlocksProgram, getMetaNftProgram } from './factory';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  getCreateUniverseInstruction,
  getUpdateUniverseInstruction,
} from './instructions/universeInstructions';
import {
  FetchAccountArgs,
  GroupedDepositNftApiArgs,
  SendTxRequest,
  UniverseApiArgs,
  UniverseArgs,
  UserNftFilterArgs,
  WithdrawNftApiArgs,
  WithdrawNftWithReceiptApiArgs,
  WrappedUserNftArgs,
} from './types/types';

import * as accountApi from './accounts';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { KyraaError } from './error';
import { Program } from '@project-serum/anchor';
import { MetaBlocks } from './types/meta_blocks';
import { LangErrorCode, LangErrorMessage } from './error';
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
import { getWithdrawNftInstruction } from './instructions/withdrawInstructions';
import { getTokenAccount } from '@project-serum/common';

const createUniverse = async (args: UniverseApiArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const argument: UniverseArgs = {
      usersKey: usersKey,
      name: args.name,
      description: args.description,
      websiteUrl: args.websiteUrl,
      program: program,
    };

    const createUniverseInstruction = await getCreateUniverseInstruction(
      argument
    );
    const tx = new Transaction();
    tx.add(createUniverseInstruction);
    await program.provider.send(tx, []);

    return tx;
  } catch (e) {
    throw new KyraaError(e);
  }
};

const updateUniverse = async (args: UniverseApiArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const argument: UniverseArgs = {
      usersKey: usersKey,
      name: args.name,
      description: args.description,
      websiteUrl: args.websiteUrl,
      program: program,
    };

    const updateUniverseInstruction = await getUpdateUniverseInstruction(
      argument
    );
    const tx = new Transaction();
    tx.add(updateUniverseInstruction);
    await program.provider.send(tx, []);

    return tx;
  } catch (e) {
    throw new KyraaError(e);
  }
};

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

    const transferReceiptNftInstruction =
      await getTransferReceiptNftInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
      });

    const updateReceiptMetadataInstruction =
      await getUpdateReceiptMetadataInstruction({
        uri: args.receiptUrl,
        name: args.receiptUrl,
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
        isReceiptMasterEdition: args.isReceiptMasterEdition,
      });

    const depositNftInstruction = getDepositNftInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });

    const initDepositInstruction = getInitDepositInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });

    const initReceiptInstruction = getInitReceiptInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });

    const createCpiMetaNftInstruction = await getCreateCpiMetaNftInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
      name: args.metaNftName,
      uri: args.metaNftUrl,
    });

    const initMetaNftInstruction = getInitCpiMetaNftInstruction({
      pdaKeys: pdaKeys,
      usersKey: usersKey,
      program: program,
    });

    const initMetaBlocksAuthorityInstruction =
      getInitMetaBlocksAuthorityInstruction({
        pdaKeys: pdaKeys,
        usersKey: usersKey,
        program: program,
      });

    // transaction 1
    const transaction1 = new Transaction();

    try {
      await program.account.metaBlocksAuthority.fetch(
        pdaKeys.metaBlocksAuthority
      );
    } catch (err) {
      transaction1.add(initMetaBlocksAuthorityInstruction);
    }

    try {
      await metaNftProgram.account.metaNft.fetch(pdaKeys.metaNft);
    } catch (err) {
      transaction1.add(initMetaNftInstruction);
    }

    if (transaction1.instructions.length > 0) {
      sendTxRequests.push({
        tx: transaction1,
        signers: [],
      });
    }
    // transaction 2
    const transaction2 = new Transaction();
    try {
      await getTokenAccount(program.provider, pdaKeys.userMetaNftAta);
    } catch (err) {
      transaction2.add(createCpiMetaNftInstruction);
      if (transaction2.instructions.length > 0) {
        sendTxRequests.push({
          tx: transaction2,
          signers: [],
        });
      }
    }

    // transaction 3
    const transaction3 = new Transaction();
    transaction3.add(initReceiptInstruction);
    transaction3.add(initDepositInstruction);

    sendTxRequests.push({
      tx: transaction3,
      signers: [],
    });

    // transaction 4
    const transaction4 = new Transaction();
    transaction4.add(depositNftInstruction);

    sendTxRequests.push({
      tx: transaction4,
      signers: [],
    });

    // transaction 5
    const transaction5 = new Transaction();
    transaction5.add(updateReceiptMetadataInstruction);
    sendTxRequests.push({
      tx: transaction5,
      signers: [],
    });

    // transaction 6
    const transaction6 = new Transaction();
    transaction6.add(transferReceiptNftInstruction);
    sendTxRequests.push({
      tx: transaction6,
      signers: [],
    });

    const [tx1, tx2, tx3, tx4, tx5, tx6] = await program.provider.sendAll(
      sendTxRequests
    );

    return { tx1, tx2, tx3, tx4, tx5, tx6 };
  } catch (e) {
    throw new KyraaError(e);
  }
};

const withdrawNft = async (args: WithdrawNftApiArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    return await callWithdrawNft(
      program,
      usersKey,
      args.mintKey,
      args.universeKey
    );
  } catch (e) {
    throw new KyraaError(e);
  }
};

const withdrawNftWithReceipt = async (args: WithdrawNftWithReceiptApiArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const wrappedUserNft = await accountApi.getWrappedUserNftForReceiptMint(
      program,
      args.receiptMint,
      usersKey
    );

    if (
      wrappedUserNft == null ||
      wrappedUserNft.tokenMint === undefined ||
      wrappedUserNft.universe === undefined
    ) {
      throw new KyraaError(
        undefined,
        LangErrorCode.KyraaUserNftAccount,
        LangErrorMessage.get(LangErrorCode.KyraaUserNftAccount)
      );
    }

    const tokenMint = new PublicKey(wrappedUserNft.tokenMint);
    const universeKey = new PublicKey(wrappedUserNft.universe);

    return await callWithdrawNft(program, usersKey, tokenMint, universeKey);
  } catch (e) {
    throw new KyraaError(e);
  }
};

const callWithdrawNft = async (
  program: Program<MetaBlocks>,
  usersKey: PublicKey,
  mintKey: PublicKey,
  universeKey: PublicKey
) => {
  const pdaKeys: PdaKeys = await getPdaKeys(universeKey, usersKey, mintKey);

  const withdrawNftInstruction = getWithdrawNftInstruction({
    program: program,
    usersKey: usersKey,
    pdaKeys: pdaKeys,
  });
  const transaction = new Transaction();
  transaction.add(withdrawNftInstruction);

  return await program.provider.send(transaction, []);
};

// Get all Universes
const getAllUniverseAccounts = async (args: FetchAccountArgs) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  return await accountApi.getAllUniverses(program);
};
// Get All user nfts
const getWrappedUserNftAccounts = async (
  args: FetchAccountArgs,
  filterArgs: UserNftFilterArgs
) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  return await accountApi.getFilteredWrappedUserNfts(program, filterArgs);
};

// Get Metadata for Mint
const getMetadataForMint = async (connection: Connection, mint: PublicKey) => {
  try {
    const metadataPDA = await Metadata.getPDA(mint);
    return await Metadata.load(connection, metadataPDA);
  } catch (err) {
    throw err;
  }
};

const getWrappedUserNftAccount = async (args: WrappedUserNftArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);

    return await accountApi.getWrappedUserNftForReceiptMint(
      program,
      args.receiptMint,
      args.authority
    );
  } catch (err) {
    throw err;
  }
};

export {
  createUniverse,
  updateUniverse,
  depositNft,
  withdrawNft,
  getAllUniverseAccounts,
  getWrappedUserNftAccounts,
  getMetadataForMint,
  getWrappedUserNftAccount,
  withdrawNftWithReceipt,
};
