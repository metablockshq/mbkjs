import { getMetaBlocksProgram } from './factory';
import {
  computeCreateUniverseParams,
  computeGroupedDepositNftParams,
  computeUpdateUniverseParams,
} from './paramsBuilder';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getWithdrawNftInstruction } from './instructions';
import {
  FetchAccountArgs,
  GroupedDepositNftApiArgs,
  SendTxRequest,
  UniverseApiArgs,
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

const createUniverse = async (args: UniverseApiArgs) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  const usersKey = args.wallet.publicKey;
  const { createUniverseArgs, accounts } = await computeCreateUniverseParams({
    usersKey: usersKey,
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  });

  try {
    const tx = await program.rpc.createUniverseV1(createUniverseArgs, {
      accounts,
      signers: [],
    });
    return tx;
  } catch (e) {
    throw new KyraaError(e);
  }
};

const updateUniverse = async (args: UniverseApiArgs) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  const usersKey = args.wallet.publicKey;
  const { accounts, updateUniverseArgs } = await computeUpdateUniverseParams({
    usersKey: usersKey,
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  });

  try {
    const tx = await program.rpc.updateUniverseV1(updateUniverseArgs, {
      accounts,
      signers: [],
    });
    return tx;
  } catch (e) {
    throw new KyraaError(e);
  }
};

const depositNft = async (args: GroupedDepositNftApiArgs) => {
  try {
    const sendTxRequests: Array<SendTxRequest> = [];

    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const {
      initReceiptMint: { initReceiptMintArgs, initReceiptMintAccounts },
      initDepositNft: { initDepositNftArgs, initDepositNftAccounts },
      depositNft: { depositNftArgs, depositNftAccounts },
      transferReceiptNft: {
        transferReceiptNftArgs,
        transferReceiptNftAccounts,
      },
    } = await computeGroupedDepositNftParams({
      usersKey: usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
      url: args.url,
      isReceiptMasterEdition: args.isReceiptMasterEdition,
    });

    const initReceiptMintInstruction = program.instruction.initReceiptMintV1(
      initReceiptMintArgs,
      {
        accounts: initReceiptMintAccounts,
      }
    );

    const initDepositNftInstruction = program.instruction.initDepositNftV1(
      initDepositNftArgs,
      {
        accounts: initDepositNftAccounts,
      }
    );

    const transaction1 = new Transaction();
    transaction1.add(initReceiptMintInstruction);
    transaction1.add(initDepositNftInstruction);

    // transaction 1
    sendTxRequests.push({
      tx: transaction1,
      signers: [],
    });

    const depositNftInstruction = program.instruction.depositNftV1(
      depositNftArgs,
      {
        accounts: depositNftAccounts,
      }
    );
    const transferReceiptNftToUserInstruction =
      program.instruction.transferReceiptNftToUserV1(transferReceiptNftArgs, {
        accounts: transferReceiptNftAccounts,
      });

    const transaction2 = new Transaction();
    transaction2.add(depositNftInstruction);
    transaction2.add(transferReceiptNftToUserInstruction);

    sendTxRequests.push({
      tx: transaction2,
      signers: [],
    });

    const [tx1, tx2] = await program.provider.sendAll(sendTxRequests);

    return { tx1, tx2 };
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
  const withdrawNftInstruction = await getWithdrawNftInstruction({
    program: program,
    usersKey: usersKey,
    mintKey: mintKey,
    universeKey: universeKey,
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
