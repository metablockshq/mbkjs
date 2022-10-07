import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { findWrappedUserNftAddress } from '../pda';
import { MetaBlocks } from '../types/meta_blocks';
import {
  BlockMetadata,
  UserNftFilterArgs,
  WrappedUserNft,
} from '../types/types';
import { camelToSnakeCaseArrayObject, setBlockMetadata } from './utils';

const getWrappedUserNftForReceiptMint = async (
  program: anchor.Program<MetaBlocks>,
  receiptMintAddress: PublicKey,
  authority: PublicKey
) => {
  const [wrappedUserNftKey, _] = await findWrappedUserNftAddress(
    authority,
    receiptMintAddress
  );

  return await program.account.wrappedUserNft.fetch(wrappedUserNftKey);
};

const getAllWrappedUserNfts = async (
  program: anchor.Program<MetaBlocks>,
  isBlockMetadata: boolean = false
): Promise<Array<WrappedUserNft>> => {
  const wrappedUserNfts = await program.account.wrappedUserNft.all();
  if (wrappedUserNfts.length > 0) {
    return await Promise.all(
      wrappedUserNfts.map(async (wrappedUserNft) => {
        let metadata: BlockMetadata = {
          slot: null,
          signature: null,
          blockTime: null,
        };

        if (isBlockMetadata) {
          metadata = await setBlockMetadata(wrappedUserNft.publicKey, program);
        }

        const wrappedUserNftAccount: WrappedUserNft = {
          publicKey: wrappedUserNft.publicKey.toString(),
          userNftBump: wrappedUserNft.account.userNftBump,
          nftAuthority: wrappedUserNft.account.nftAuthority,
          universe: wrappedUserNft.account.universe,
          vaultAuthority: wrappedUserNft.account.vaultAuthority,
          userReceiptAtaBump: wrappedUserNft.account.userReceiptAtaBump,
          receiptMint: wrappedUserNft.account.receiptMint,
          userReceiptAta: wrappedUserNft.account.userReceiptAta,
          vaultReceiptAta: wrappedUserNft.account.vaultReceiptAta,
          tokenMint: wrappedUserNft.account.tokenMint,
          receiptMasterEdition: wrappedUserNft.account.receiptMasterEdition,
          isReceiptMasterEdition: wrappedUserNft.account.isReceiptMasterEdition,
          isUserNftVerified: wrappedUserNft.account.isUserNftVerified,
          isUserNftMetaplex: wrappedUserNft.account.isUserNftMetaplex,
          slot: metadata.slot,
          signature: metadata.signature,
          blockTime: metadata.blockTime,
        };

        return wrappedUserNftAccount;
      })
    );
  }
  return [];
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
const getFilteredWrappedUserNfts = async (
  program: anchor.Program<MetaBlocks>,
  filters: UserNftFilterArgs
): Promise<Array<WrappedUserNft>> => {
  let wrappedUserNfts = await getAllWrappedUserNfts(program);

  if (wrappedUserNfts.length > 0 && wrappedUserNfts != null) {
    if (isFilterNotEmpty(filters)) {
      wrappedUserNfts = applyFilter(wrappedUserNfts, filters);
    }
    return camelToSnakeCaseArrayObject(wrappedUserNfts);
  }

  return [];
};

const getWrappedUserNftsForUniverseAndWallet = async (args: {
  program: anchor.Program<MetaBlocks>;
  universe: string;
  authority: string;
}): Promise<Array<WrappedUserNft>> => {
  let wrappedUserNfts = await getAllWrappedUserNfts(args.program);

  if (wrappedUserNfts.length > 0 && wrappedUserNfts != null) {
    wrappedUserNfts = applyExclusiveFilter(
      wrappedUserNfts,
      args.universe,
      args.authority
    );
    if (wrappedUserNfts.length > 0) {
      return wrappedUserNfts;
    }
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

const applyFilter = (
  wrappedUserNfts: Array<WrappedUserNft>,
  filters: UserNftFilterArgs
) => {
  return wrappedUserNfts.filter((element: any) => {
    return (
      filters.universes.includes(element.universe.toString()) ||
      filters.vaultAuthorities.includes(element.vaultAuthority.toString()) ||
      filters.authorities.includes(element.nftAuthority.toString())
    );
  });
};

const applyExclusiveFilter = (
  wrappedUserNfts: Array<WrappedUserNft>,
  universe: string,
  authority: string
) => {
  return wrappedUserNfts.filter(
    (element: any) =>
      element.universe.toString() === universe &&
      element.nftAuthority.toString() === authority
  );
};

export {
  getAllWrappedUserNfts,
  getFilteredWrappedUserNfts,
  getWrappedUserNftForReceiptMint,
  getWrappedUserNftsForUniverseAndWallet,
};
