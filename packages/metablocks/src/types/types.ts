import { Program, Provider } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { MetaBlocks } from "./meta_blocks";

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