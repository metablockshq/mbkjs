import * as anchor from '@project-serum/anchor';
import { getAllAccountInfo, getPubkeyFromUnit8Array } from '.';
import { MetaBlocks } from '../types/meta_blocks';
import {
  UserNft,
  UserNftAccount,
  UserNftFilterArgs,
  UserNftLayout,
  USER_NFT_ACCOUNT_DATA_LAYOUT_V1,
  USER_NFT_ACCOUNT_DATA_LAYOUT_V2,
} from '../types/types';
import { camelToSnakeCaseArrayObject, setBlockMetadata } from './utils';
import * as BufferLayout from '@solana/buffer-layout';

const getRawUserNfts = async (
  program: anchor.Program<MetaBlocks>,
  layout: BufferLayout.Structure
): Promise<Array<any>> => {
  return await getAllAccountInfo<UserNftLayout>('UserNft', program, layout);
};

/**
 *  Usage : 
 *  example 1: const filterArgs = {
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

  try {
    userNftAccounts = await getRawUserNfts(
      program,
      USER_NFT_ACCOUNT_DATA_LAYOUT_V2
    );
  } catch (err) {
    console.log('Could not parse user nft v2 version, now parsing with v1 ');
    userNftAccounts = await getRawUserNfts(
      program,
      USER_NFT_ACCOUNT_DATA_LAYOUT_V1
    );
  }

  if (userNftAccounts.length > 0) {
    userNftAccounts = userNftAccounts.filter((element: UserNftAccount) => {
      return (
        filters.universes.indexOf(
          getPubkeyFromUnit8Array(element.account.universe)
        ) >= 0 ||
        filters.vaultAuthorities.indexOf(
          getPubkeyFromUnit8Array(element.account.vaultAuthority)
        ) >= 0 ||
        filters.authorities.indexOf(
          getPubkeyFromUnit8Array(element.account.nftAuthority)
        ) >= 0
      );
    });

    const userNfts = await Promise.all(
      userNftAccounts.map(async (userNftAccount: UserNftAccount) => {
        const metadata = await setBlockMetadata(
          userNftAccount.publicKey,
          program
        );
        return {
          publicKey: userNftAccount.publicKey.toString(),
          userNftBump: userNftAccount.account.userNftBump,
          vaultBump: userNftAccount.account.vaultBump,
          associatedVaultBump: userNftAccount.account.vaultBump,
          nftAuthority: getPubkeyFromUnit8Array(
            userNftAccount.account.nftAuthority
          ),
          universe: getPubkeyFromUnit8Array(userNftAccount.account.universe),
          vaultAuthority: getPubkeyFromUnit8Array(
            userNftAccount.account.vaultAuthority
          ),
          receiptMintBump: userNftAccount.account.receiptMintBump,
          userReceiptAtaBump: userNftAccount.account.userReceiptAtaBump,
          receiptMint: userNftAccount.account.receiptMint
            ? getPubkeyFromUnit8Array(userNftAccount.account.receiptMint)
            : null,
          userReceiptAta: userNftAccount.account.userReceiptAta
            ? getPubkeyFromUnit8Array(userNftAccount.account.userReceiptAta)
            : null,
          vaultReceiptAta: userNftAccount.account.vaultReceiptAta
            ? getPubkeyFromUnit8Array(userNftAccount.account.vaultReceiptAta)
            : null,
          tokenMint: userNftAccount.account.tokenMint
            ? getPubkeyFromUnit8Array(userNftAccount.account.tokenMint)
            : null,
          receiptMasterEdition: userNftAccount.account.receiptMasterEdition
            ? getPubkeyFromUnit8Array(
                userNftAccount.account.receiptMasterEdition
              )
            : null,
          isReceiptMasterEdition: userNftAccount.account
            .isReceiptMasterEdition as boolean,
          isUserNftVerified: userNftAccount.account
            .isUserNftVerified as boolean,
          isUserNftMetaplex: userNftAccount.account
            .isUserNftMetaplex as boolean,
          slot: metadata.slot,
          signature: metadata.signature,
          blockTime: metadata.blockTime,
        };
      })
    );

    return camelToSnakeCaseArrayObject(userNfts);
  }

  return [];
};

export { getUserNfts };
