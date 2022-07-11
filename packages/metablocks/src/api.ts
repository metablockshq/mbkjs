import { getMetaBlocksProgram } from './factory';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  getCreateUniverseInstruction,
  getUpdateUniverseInstruction,
} from './instructions/universeInstructions';
import {
  FetchAccountArgs,
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

import { getWithdrawNftInstruction } from './instructions/withdrawInstructions';
import axios from 'axios';
import { supabaseClient } from './supabase-client';
import { getRawTokenAccount } from './accounts';
import { depositNft, depositNftV1 } from './deposit-nft';

const RECEIPT_URL =
  'https://ctvymyaq3e.execute-api.ap-south-1.amazonaws.com/Prod/receipt-shortener';

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
    await program.provider.sendAndConfirm!(tx, []);

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
    await program.provider.sendAndConfirm!(tx, []);

    return tx;
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

  const withdrawNftInstruction = await getWithdrawNftInstruction({
    program: program,
    usersKey: usersKey,
    pdaKeys: pdaKeys,
  });
  const transaction = new Transaction();
  transaction.add(withdrawNftInstruction);

  return await program.provider.sendAndConfirm!(transaction, []);
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

    const authority = args.wallet.publicKey;

    return await accountApi.getWrappedUserNftForReceiptMint(
      program,
      args.receiptMint,
      authority
    );
  } catch (err) {
    throw err;
  }
};

const getShortenedReceiptUrl = async (args: {
  arweaveUrl: string;
  universeAddress: string;
  walletAddress: string;
}) => {
  try {
    const data = {
      universeAddress: args.universeAddress,
      walletAddress: args.walletAddress,
      arweaveUrl: args.arweaveUrl,
      type: 'receipt',
    };

    const result = await axios.post(RECEIPT_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return result.data;
  } catch (err) {
    throw err;
  }
};

const getMetaNftShortId = async (args: {
  arweaveUrl: string;
  universeAddress: string;
  walletAddress: string;
}) => {
  try {
    const data = {
      universeAddress: args.universeAddress,
      walletAddress: args.walletAddress,
      type: 'metanft',
    };

    const result = await axios.post(RECEIPT_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return result.data;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param wallet - user's wallet address in string
 * @returns all wrapped user nfts of an user from supabase
 */
const getStoredWrappedUserNftAccounts = async (args: {
  wallet: string;
  universe: string;
}) => {
  try {
    return (await supabaseClient.getWrappedUserNfts(
      args.wallet,
      args.universe
    ))!;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param wallet - user's wallet address in string
 * @returns universes created by user(any wallet) from supabase
 */
const getStoredUniverseAccounts = async (args: { wallet: string }) => {
  try {
    return (await supabaseClient.getUniverses(args.wallet))!;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @returns all supabase stored wrapped user nfts
 */
const getAllStoredWrappedUserNftAccounts = async () => {
  try {
    return (await supabaseClient.getAllWrappedUserNfts())!;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @returns all universes stored in supabase
 */
const getAllStoredUniverseAccounts = async () => {
  try {
    return (await supabaseClient.getAllUniverses())!;
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
  getShortenedReceiptUrl,
  getMetaNftShortId,
  getStoredWrappedUserNftAccounts,
  getStoredUniverseAccounts,
  getAllStoredWrappedUserNftAccounts,
  getAllStoredUniverseAccounts,
  depositNftV1,
};
