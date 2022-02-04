import { Program } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { MetaBlocks } from "./meta_blocks";

export interface UniverseArgs {
  connection: Connection;
  wallet: any;
  name: string;
  description: string;
  websiteUrl: string;
}

interface InputArgs {
  connection: Connection;
  wallet: any;
  mintKey: PublicKey;
  universeKey: PublicKey;
}
export interface InitReceiptMintArgs extends InputArgs {}

export interface InitDepositNftArgs extends InputArgs {}

export interface DepositNftArgs extends InputArgs {}

export interface TransferReceiptNftArgs extends InputArgs {
  url: string;
  isReceiptMasterEdition: boolean;
}

export interface GroupedDepositNftArgs extends InputArgs {
  url: string;
  isReceiptMasterEdition: boolean;
}

export interface WithdrawNftArgs extends InputArgs {}

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
