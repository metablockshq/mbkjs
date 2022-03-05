import * as anchor from '@project-serum/anchor';
import { MetaBlocks } from '../types/meta_blocks';
import {
  UserNft,
  UserNftAccount,
  UserNftFilterArgs,
  USER_NFT_ACCOUNT_DATA_LAYOUT_V1,
  USER_NFT_ACCOUNT_DATA_LAYOUT_V2,
} from '../types/types';
import {
  camelToSnakeCaseArrayObject,
  setBlockMetadata,
  getAllAccountInfo,
  getDeserializedAccount,
  getNullableAccountInfoBuffer,
} from './utils';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { findWrappedUserNftAddress } from '../pda';
import { Layout } from 'buffer-layout';

const getRawUserNfts = async (
  program: anchor.Program<MetaBlocks>,
  layouts: Layout[]
): Promise<Array<UserNftAccount | null>> => {
  return await getAllAccountInfo('UserNft', program, layouts);
};

/**
 * 
 * This method returns all the user nfts if no filters are passed or returns all the filtered user nfts
 *  Usage : 
 *  example 1:
 *  
  const args = {
    connection: connection,
    wallet: wallet,
  }; 

  const filterArgs = {
    universes: [],
    vaultAuthorities: [],
    authorities: ["GD7GyGPWQeb1oPUkUdPZfwkQXVosCHmmH4HDMZD6KhMy"], // Any authority(wallet) key
    };

    await api.getUserNfts(args, filterArgs);

    example 2: const filterArgs = {
    universes: ["GD7GyGPWQeb1oPUkUdPZfwkQXVosCHmmH4HDMZD6KhMy"], // Any universe address
    vaultAuthorities: [],
    authorities: [],
    };
    await api.getUserNfts(args, filterArgs);

    
    example 3: const filterArgs = {
    universes: [],
    vaultAuthorities: ["GD7GyGPWQeb1oPUkUdPZfwkQXVosCHmmH4HDMZD6KhMy"], // Any vault authority address
    authorities: [],
    };
    await api.getUserNfts(args, filterArgs);
 * 
 */

const getUserNfts = async (
  program: anchor.Program<MetaBlocks>,
  filters: UserNftFilterArgs
): Promise<Array<UserNft>> => {
  let userNftAccounts = null;

  const layouts: Layout[] = [
    USER_NFT_ACCOUNT_DATA_LAYOUT_V1,
    USER_NFT_ACCOUNT_DATA_LAYOUT_V2,
  ];

  userNftAccounts = await getRawUserNfts(program, layouts);

  userNftAccounts = userNftAccounts.filter(
    (userNftAccount) => userNftAccount !== null
  ) as Array<UserNftAccount>;

  if (userNftAccounts.length > 0 && userNftAccounts != null) {
    if (isFilterNotEmpty(filters)) {
      userNftAccounts = applyFilter(userNftAccounts, filters);
    }

    const userNfts = await Promise.all(
      userNftAccounts.map(async (userNftAccount: UserNftAccount) => {
        return getModifiedUserNftAccount(userNftAccount, program);
      })
    );

    return camelToSnakeCaseArrayObject(userNfts);
  }

  return [];
};

const isFilterNotEmpty = (filters: UserNftFilterArgs) => {
  return (
    filters.authorities.length > 0 ||
    filters.vaultAuthorities.length > 0 ||
    filters.authorities.length > 0
  );
};

const getModifiedUserNftAccount = async (
  userNftAccount: UserNftAccount,
  program: anchor.Program<MetaBlocks>
) => {
  const metadata = await setBlockMetadata(userNftAccount.publicKey, program);
  return {
    publicKey: userNftAccount.publicKey.toString(),
    userNftBump: userNftAccount.account.userNftBump,
    index: userNftAccount.account.index.toString(),
    vaultBump: userNftAccount.account.vaultBump,
    associatedVaultBump: userNftAccount.account.vaultBump,
    nftAuthority: userNftAccount.account.nftAuthority.toString(),
    universe: userNftAccount.account.universe.toString(),
    vaultAuthority: userNftAccount.account.vaultAuthority.toString(),
    receiptMintBump: userNftAccount.account.receiptMintBump,
    userReceiptAtaBump: userNftAccount.account.userReceiptAtaBump,
    receiptMint: userNftAccount.account.receiptMint
      ? userNftAccount.account.receiptMint.toString()
      : null,
    userReceiptAta: userNftAccount.account.userReceiptAta
      ? userNftAccount.account.userReceiptAta.toString()
      : null,
    vaultReceiptAta: userNftAccount.account.vaultReceiptAta
      ? userNftAccount.account.vaultReceiptAta.toString()
      : null,
    tokenMint: userNftAccount.account.tokenMint
      ? userNftAccount.account.tokenMint.toString()
      : null,
    receiptMasterEdition: userNftAccount.account.receiptMasterEdition
      ? userNftAccount.account.receiptMasterEdition.toString()
      : null,
    isReceiptMasterEdition: userNftAccount.account
      .isReceiptMasterEdition as boolean,
    isUserNftVerified: userNftAccount.account.isUserNftVerified as boolean,
    isUserNftMetaplex: userNftAccount.account.isUserNftMetaplex as boolean,
    slot: metadata.slot,
    signature: metadata.signature,
    blockTime: metadata.blockTime,
  };
};

const applyFilter = (
  userNftAccounts: Array<UserNftAccount>,
  filters: UserNftFilterArgs
) => {
  return userNftAccounts.filter((element: UserNftAccount) => {
    return (
      filters.universes.includes(element.account.universe) ||
      filters.vaultAuthorities.includes(element.account.vaultAuthority) ||
      filters.authorities.includes(element.account.nftAuthority)
    );
  });
};

const getUserNft = async (
  program: anchor.Program<MetaBlocks>,
  receiptMintAddress: PublicKey,
  authority: PublicKey
): Promise<any | null> => {
  try {
    const [userNftAddress, _] = await findWrappedUserNftAddress(
      authority,
      receiptMintAddress
    );

    const rawAccountBuffer = await getNullableAccountInfoBuffer(
      userNftAddress,
      program.provider.connection
    );

    if (rawAccountBuffer == null) {
      return null;
    }

    try {
      const userNftAccount: UserNftAccount = {
        account: getDeserializedAccount(
          rawAccountBuffer,
          USER_NFT_ACCOUNT_DATA_LAYOUT_V2,
          'UserNft'
        ),
        publicKey: userNftAddress,
      };
      return await getModifiedUserNftAccount(userNftAccount, program);
    } catch (err) {
      const userNftAccount: UserNftAccount = {
        account: getDeserializedAccount(
          rawAccountBuffer,
          USER_NFT_ACCOUNT_DATA_LAYOUT_V1,
          'UserNft'
        ),
        publicKey: userNftAddress,
      };
      return await getModifiedUserNftAccount(userNftAccount, program);
    }
  } catch (err) {
    throw err;
  }
};

export { getUserNfts, getUserNft };
