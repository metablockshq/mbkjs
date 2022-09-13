import { Program } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { PdaKeys } from '../pda';
import { NftMinter } from './nft_minter';

export interface ClaimArgs {
  signature: Uint8Array;
  message: Uint8Array;
}

export interface MintRegularNftArgs {
  signature: Uint8Array;
  message: Uint8Array;
  pdaKeys: PdaKeys;
  program: Program<NftMinter>;
  claimantAddress: PublicKey;
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  mintUri: string;
}

export interface MintCollectionNftArgs {
  signature: Uint8Array;
  message: Uint8Array;
  pdaKeys: PdaKeys;
  program: Program<NftMinter>;
  claimantAddress: PublicKey;
  nftCollectionMintAddress: PublicKey;
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  mintUri: string;
}

export interface MintNftArgs {
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  program: Program<NftMinter>;
  claimantAddress: PublicKey;
  pdaKeys: PdaKeys;
}

export interface MintNftWithCollectionArgs {
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  nftCollectionMintAddress: PublicKey;
  program: Program<NftMinter>;
  claimantAddress: PublicKey;
  pdaKeys: PdaKeys;
}

export interface IntializeNftMinterArgs {
  program: Program<NftMinter>;
  authorityAddress: PublicKey;
}

export interface CreateMintArgs {
  program: Program<NftMinter>;
  claimantAddress: PublicKey;
  pdaKeys: PdaKeys;
  uri: String;
}

interface ApiInputArgs {
  connection: Connection;
  wallet: any;
}

export interface InitializeNftMinterApiArgs extends ApiInputArgs {
  uri: string;
}

export interface MintSignedNftApiArgs extends ApiInputArgs {
  signature: Uint8Array;
  message: Uint8Array;
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  mintUri: string;
}

export interface MintSignedCollectionNftApiArgs extends ApiInputArgs {
  signature: Uint8Array;
  message: Uint8Array;
  collectionMintAddress: PublicKey;
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  mintUri: string;
}

export interface MintUnsignedNftApiArgs extends ApiInputArgs {
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  mintUri: string;
}

export interface MintUnsignedCollectionNftApiArgs extends ApiInputArgs {
  mintName: string;
  mintSymbol: string;
  isMasterEdition: boolean;
  isParentForNfts: boolean;
  collectionMintAddress: PublicKey;
  mintUri: string;
}
