import { getMetaBlocksProgram, getMetaTreasuryProgram } from './factory';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import {
  getCreateUniverseInstruction,
  getUpdateUniverseInstruction,
} from './instructions/universeInstructions';
import {
  UniverseApiArgs,
  UniverseArgs,
  WithdrawNftApiArgs,
  WithdrawNftWithReceiptApiArgs,
} from './types/types';

import * as accountApi from './accounts';
import { KyraaError } from './error';
import { Program } from '@project-serum/anchor';
import { MetaBlocks } from './types/meta_blocks';
import { LangErrorCode, LangErrorMessage } from './error';
import { getPdaKeys, PdaKeys } from './pda';

import { getWithdrawNftInstruction } from './instructions/withdrawInstructions';
import { depositNft, depositNftV1, depositRawNft } from './depositNft';
import * as configApi from './configApi';
import {
  getExternalMetadata,
  getMetadata,
  getAllUniverseAccounts,
  getWrappedUserNftAccounts,
  getMetadataForMint,
  getWrappedUserNftAccount,
  getStoredWrappedUserNftAccounts,
  getStoredUniverseAccounts,
  getAllStoredWrappedUserNftAccounts,
  getAllStoredUniverseAccounts,
  getShortenedReceiptUrl,
  getMetaNftShortId,
  getMetaNftUrl,
  getReceiptUrl,
  getReceiptNftsMetadata,
  getMetaNftMetadata,
} from './getApi';

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
    const metaTreasuryProgram = getMetaTreasuryProgram(
      args.connection,
      args.wallet
    );
    const treasuryData = await configApi.fetchTreasuryData(metaTreasuryProgram);
    const treasuryAuthority = treasuryData.authority;

    const usersKey = args.wallet.publicKey;

    return await callWithdrawNft(
      program,
      usersKey,
      args.mintKey,
      args.universeKey,
      treasuryAuthority
    );
  } catch (e) {
    throw new KyraaError(e);
  }
};

const withdrawNftWithReceipt = async (args: WithdrawNftWithReceiptApiArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const metaTreasuryProgram = getMetaTreasuryProgram(
      args.connection,
      args.wallet
    );
    const treasuryData = await configApi.fetchTreasuryData(metaTreasuryProgram);
    const treasuryAuthority = treasuryData.authority;

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

    return await callWithdrawNft(
      program,
      usersKey,
      tokenMint,
      universeKey,
      treasuryAuthority
    );
  } catch (e) {
    throw new KyraaError(e);
  }
};

const callWithdrawNft = async (
  program: Program<MetaBlocks>,
  usersKey: PublicKey,
  mintKey: PublicKey,
  universeKey: PublicKey,
  treasuryAuthority: PublicKey
) => {
  const pdaKeys: PdaKeys = await getPdaKeys(universeKey, usersKey, mintKey);

  const withdrawNftInstruction = await getWithdrawNftInstruction({
    program: program,
    usersKey: usersKey,
    pdaKeys: pdaKeys,
    treasuryAuthority: treasuryAuthority,
  });
  const transaction = new Transaction();
  transaction.add(withdrawNftInstruction);

  return await program.provider.sendAndConfirm!(transaction, []);
};

export {
  createUniverse,
  updateUniverse,
  depositNft,
  withdrawNft,
  withdrawNftWithReceipt,
  depositNftV1,
  depositRawNft,
  getAllUniverseAccounts,
  getWrappedUserNftAccounts,
  getMetadataForMint,
  getWrappedUserNftAccount,
  getStoredWrappedUserNftAccounts,
  getStoredUniverseAccounts,
  getAllStoredWrappedUserNftAccounts,
  getAllStoredUniverseAccounts,
  getShortenedReceiptUrl,
  getMetaNftShortId,
  getMetaNftUrl,
  getReceiptUrl,
  getReceiptNftsMetadata,
  getExternalMetadata,
  getMetadata,
  getMetaNftMetadata,
};
