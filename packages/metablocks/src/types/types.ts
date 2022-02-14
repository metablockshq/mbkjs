import { Program } from '@project-serum/anchor';
import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js';
import { MetaBlocks } from './meta_blocks';
import * as BufferLayout from '@solana/buffer-layout';

export interface UniverseApiArgs {
  connection: Connection;
  wallet: any;
  name: string;
  description: string;
  websiteUrl: string;
}

interface ApiInputArgs {
  connection: Connection;
  wallet: any;
  mintKey: PublicKey;
  universeKey: PublicKey;
}
export interface InitReceiptMintApiArgs extends ApiInputArgs {}

export interface InitDepositNftApiArgs extends ApiInputArgs {}

export interface DepositNftApiArgs extends ApiInputArgs {}

export interface TransferReceiptNftApiArgs extends ApiInputArgs {
  url: string;
  isReceiptMasterEdition: boolean;
}

export interface GroupedDepositNftApiArgs extends ApiInputArgs {
  url: string;
  isReceiptMasterEdition: boolean;
}

export interface WithdrawNftApiArgs extends ApiInputArgs {}

//paramBuilder.ts arguments

export interface UniverseParamArgs {
  usersKey: PublicKey;
  name: string;
  description: string;
  websiteUrl: string;
}

interface BasicInputParamArgs {
  usersKey: PublicKey;
  mintKey: PublicKey;
  universeKey: PublicKey;
}

export interface InitReceiptMintParamArgs extends BasicInputParamArgs {}

export interface InitDepositNftParamsArgs extends BasicInputParamArgs {}

export interface DepositNftParamsArgs extends BasicInputParamArgs {}

export interface TransferReceiptNftParamArgs extends BasicInputParamArgs {
  url: string;
  isReceiptMasterEdition: boolean;
}

export interface GroupedDepositNftParamsArgs extends BasicInputParamArgs {
  url: string;
  isReceiptMasterEdition: boolean;
}

export interface WithdrawNftParamsArgs extends BasicInputParamArgs {}

// instructions.ts file
interface BasicInstructionArgs {
  program: Program<MetaBlocks>;
  usersKey: PublicKey;
  mintKey: PublicKey;
  universeKey: PublicKey;
}

export interface InitReceiptMintInstructionArgs extends BasicInstructionArgs {}

export interface InitDepositNftInstructionArgs extends BasicInstructionArgs {}

export interface DepositNftInstructionArgs extends BasicInstructionArgs {}

export interface TransferReceiptNftInstructionArgs
  extends BasicInstructionArgs {
  url: string;
  isReceiptMasterEdition: boolean;
}

export interface WithdrawNftInstructionArgs extends BasicInstructionArgs {}

export type SendTxRequest = {
  tx: Transaction;
  signers: Array<Signer | undefined>;
};

// Account API interfaces
export interface Universe {
  publicKey: string;
  authority: string;
  name: string;
  websiteUrl: string;
  description: string;
  lastUpdateTs: number;
  totalNfts: number;
  slot: number | undefined | null;
  signature: string | undefined | null;
  blockTime: number | undefined | null;
}

export interface BlockMetadata {
  slot: number | undefined | null;
  signature: string | undefined | null;
  blockTime: number | undefined | null;
}

export interface UserNft {
  publicKey: string;
  userNftBump: number;
  vaultBump: number;
  associatedVaultBump: number;
  nftAuthority: string;
  universe: string;
  vaultAuthority: string;
  receiptMintBump: number;
  userReceiptAtaBump: number;
  receiptMint: string;
  userReceiptAta: string;
  vaultReceiptAta: string;
  tokenMint: string;
  receiptMasterEdition: string;
  isReceiptMasterEdition: boolean;
  isUserNftVerified: boolean;
  isUserNftMetaplex: boolean;
  slot: number | undefined | null;
  signature: string | undefined | null;
  blockTime: number | undefined | null;
}

export interface FetchAccountArgs {
  connection: Connection;
  wallet: any;
}

const publicKey = (property = 'publicKey') => {
  return BufferLayout.blob(32, property);
};

const uint64 = (property = 'uint64') => {
  return BufferLayout.blob(8, property);
};

export const USER_NFT_ACCOUNT_DATA_LAYOUT_V1 = BufferLayout.struct([
  BufferLayout.u8('userNftBump'),
  uint64('index'),
  BufferLayout.u8('vaultBump'),
  BufferLayout.u8('associatedVaultBump'),
  publicKey('nftAuthority'),
  publicKey('universe'),
  publicKey('vaultAuthority'),
]);

export const USER_NFT_ACCOUNT_DATA_LAYOUT_V2 = BufferLayout.struct([
  BufferLayout.u8('userNftBump'),
  uint64('index'),
  BufferLayout.u8('vaultBump'),
  BufferLayout.u8('associatedVaultBump'),
  publicKey('nftAuthority'),
  publicKey('universe'),
  publicKey('vaultAuthority'),
  BufferLayout.u8('receiptMintBump'),
  BufferLayout.u8('userReceiptAtaBump'),
  publicKey('receiptMint'),
  publicKey('userReceiptAta'),
  publicKey('vaultReceiptAta'),
  publicKey('tokenMint'),
  publicKey('receiptMasterEdition'),
  BufferLayout.u8('isReceiptMasterEdition'),
  BufferLayout.u8('isUserNftVerified'),
  BufferLayout.u8('isUserNftMetaplex'),
]);

export interface UserNftLayout {
  userNftBump: number;
  index: Uint8Array;
  vaultBump: number;
  associatedVaultBump: number;
  nftAuthority: Uint8Array;
  universe: Uint8Array;
  vaultAuthority: Uint8Array;
  receiptMintBump?: number;
  userReceiptAtaBump?: number;
  receiptMint?: Uint8Array;
  userReceiptAta?: Uint8Array;
  vaultReceiptAta?: Uint8Array;
  tokenMint?: Uint8Array;
  receiptMasterEdition?: Uint8Array;
  isReceiptMasterEdition?: boolean;
  isUserNftVerified?: boolean;
  isUserNftMetaplex?: boolean;
}

export interface UserNftAccount {
  publicKey: PublicKey;
  account: UserNftLayout;
}

export interface UserNftFilterArgs {
  universes: Array<string>;
  vaultAuthorities: Array<string>;
  authorities: Array<string>;
}

export interface Metadata {
  info: Info;
  pubkey: string;
}

export interface Info {
  data: Uint8Array;
  executable: boolean;
  lamports: number;
  owner: PublicKey;
  rentEpoch: number;
}
export interface MetadataData {
  data: MetadataDataData;
  editionNonce: number;
  isMutable: boolean;
  key: number;
  mint: string;
  primarySaleHappened: boolean;
  tokenStandard: string;
  updateAuthority: string;
  uses?: string;
}

export interface MetadataDataData {
  creators: Array<Creator>;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: string;
}

export interface Creator {
  share: number;
  verified: boolean;
  address: string;
}
