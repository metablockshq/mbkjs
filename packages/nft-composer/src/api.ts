import { getMetaBlocksProgram, getMetaTreasuryProgram } from './factory';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import {
  getCreateUniverseInstruction,
  getUpdateUniverseInstruction,
} from './instructions/universeInstructions';
import {
  FetchAccountArgs,
  NftComposerCluster,
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
import { depositNft, depositNftV1, depositRawNft } from './deposit-nft';
import * as configApi from './config-api';
import * as pda from './pda';
import { getWrappedUserNftsForUniverseAndWallet } from './accounts';

const DEVNET_RECEIPT_URL =
  'https://ctvymyaq3e.execute-api.ap-south-1.amazonaws.com/Prod/receipt-shortener';

// const DEVNET_RECEIPT_URL =
//   'https://hermes-dev.metablocks.world/Prod/receipt-shortener/Prod/receipt-shortener';

const MAINNET_RECEIPT_URL =
  'https://pyxs4bdpm6.execute-api.ap-south-1.amazonaws.com/Prod/receipt-shortener';

// const MAINNET_RECEIPT_URL =
//   'https://hermes.metablocks.world/Prod/receipt-shortener';

const METABLOCKS_RECEIPT_URI = 'https://metadata-dev.metablocks.world/receipt/';

const METABLOCKS_META_NFT_URI =
  'https://metadata-dev.metablocks.world/metanft/';

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

/**
 *
 * @param args Wallet and connection
 * @returns Fetches Metadata for a metaNFT mint of the wallet if present
 */
const getMetaNftMetadata = async (args: {
  connection: Connection;
  universe: PublicKey;
  userPublicAddress: PublicKey;
}) => {
  try {
    const authority = args.userPublicAddress;

    const [metaNftMintAddress, _] = await pda.findMetaNftAddress(
      authority,
      args.universe
    );
    const metadata = await getMetadata(metaNftMintAddress, args.connection);
    const externalMetadata =
      metadata !== null || metadata !== undefined
        ? await getExternalMetadata(metadata.data.data.uri)
        : null;

    return {
      mint: metaNftMintAddress,
      metadata: metadata,
      externalMetadata: externalMetadata,
    };
  } catch (err) {
    throw new KyraaError(
      undefined,
      LangErrorCode.MetaNftFetchMetadataError,
      LangErrorMessage.get(LangErrorCode.MetaNftFetchMetadataError)
    );
  }
};

/**
 *
 * @param args Wallet and connection
 * @returns Fetches Metadata for a metaNFT mint of the wallet if present
 */
const getReceiptNftsMetadata = async (args: {
  connection: Connection;
  universe: PublicKey;
  userPublicAddress: PublicKey;
  wallet: any;
}) => {
  try {
    const authority = args.userPublicAddress.toString();
    const universe = args.universe.toString();

    const program = getMetaBlocksProgram(args.connection, args.wallet);

    const wrappedUserNfts = await getWrappedUserNftsForUniverseAndWallet({
      program,
      universe,
      authority,
    });

    if (wrappedUserNfts.length > 0) {
      const result = await Promise.all(
        wrappedUserNfts.map(async (wrappedUserNft) => {
          let metadata = null;
          let externalMetadata = null;

          try {
            metadata = await getMetadata(
              wrappedUserNft.receiptMint,
              args.connection
            );
          } catch (err) {}

          if (metadata !== null) {
            try {
              externalMetadata = await getExternalMetadata(
                metadata.data.data.uri
              );
            } catch (err) {}
          }

          return {
            mint: wrappedUserNft.receiptMint.toString(),
            metadata: metadata,
            externalMetadata: externalMetadata,
          };
        })
      );

      //console.log(result.length);

      return result;
    }

    return [];
  } catch (err) {
    throw new KyraaError(
      err,
      LangErrorCode.ReceiptFetchMetadataError,
      LangErrorMessage.get(LangErrorCode.ReceiptFetchMetadataError)
    );
  }
};

const getExternalMetadata = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

const getMetadata = async (mintAddress: PublicKey, connection: Connection) => {
  const metadataPDA = await Metadata.getPDA(mintAddress);
  return await Metadata.load(connection, metadataPDA);
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

const getShortenedReceiptUrl = async (args: {
  arweaveUrl: string;
  universeAddress: string;
  walletAddress: string;
  receiptUrl: string;
}) => {
  try {
    const data = {
      universeAddress: args.universeAddress,
      walletAddress: args.walletAddress,
      arweaveUrl: args.arweaveUrl,
      type: 'receipt',
    };

    const result = await axios.post(args.receiptUrl, data, {
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
  universeAddress: string;
  walletAddress: string;
  receiptUrl: string;
}) => {
  try {
    const data = {
      universeAddress: args.universeAddress,
      walletAddress: args.walletAddress,
      type: 'metanft',
    };

    const result = await axios.post(args.receiptUrl, data, {
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

const getReceiptUrl = async (args: {
  arweaveUrl: string;
  walletAddress: string;
  universeAddress: string;
  cluster: NftComposerCluster;
}) => {
  const shortenedReceiptUri = (shortId: string) =>
    METABLOCKS_RECEIPT_URI + shortId + '.json';

  try {
    let receiptUrl = DEVNET_RECEIPT_URL;

    if (args.cluster == NftComposerCluster.Mainnet) {
      receiptUrl = MAINNET_RECEIPT_URL;
    }

    const receiptShortenedResult = await getShortenedReceiptUrl({
      arweaveUrl: args.arweaveUrl,
      universeAddress: args.universeAddress,
      walletAddress: args.walletAddress,
      receiptUrl: receiptUrl,
    });

    return shortenedReceiptUri(receiptShortenedResult.meta_blocks.short_id);
  } catch (err) {
    throw err;
  }
};

const getMetaNftUrl = async (args: {
  walletAddress: string;
  universeAddress: string;
  cluster: NftComposerCluster;
}) => {
  const shortIdToMetaDataUrl = (shortId: string) =>
    METABLOCKS_META_NFT_URI + shortId + '/composed-nft.json';

  try {
    let receiptUrl = DEVNET_RECEIPT_URL;

    if (args.cluster == NftComposerCluster.Mainnet) {
      receiptUrl = MAINNET_RECEIPT_URL;
    }

    const metaNftShortIdResult = await getMetaNftShortId({
      universeAddress: args.universeAddress,
      walletAddress: args.walletAddress,
      receiptUrl: receiptUrl,
    });

    return shortIdToMetaDataUrl(metaNftShortIdResult.meta_blocks.short_id);
  } catch (e) {
    let err: any = e;
    if (err.response.status === 401) {
      // Meta NFT metadata already exists, reuse
      return shortIdToMetaDataUrl(err.response.data.shortId);
    }
    throw err;
  }
};

/**
 *
 * @param wallet - user's wallet address in string
 * @returns all wrapped user nfts of an user from supabase
 */
const getStoredWrappedUserNftAccounts = async (args: {
  wallet: any;
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
  getStoredWrappedUserNftAccounts,
  getStoredUniverseAccounts,
  getAllStoredWrappedUserNftAccounts,
  getAllStoredUniverseAccounts,
  depositNftV1,
  getShortenedReceiptUrl,
  getMetaNftShortId,
  getMetaNftUrl,
  getReceiptUrl,
  depositRawNft,
  getMetaNftMetadata,
  getReceiptNftsMetadata,
  getExternalMetadata,
  getMetadata,
};
