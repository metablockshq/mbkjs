import * as anchor from '@project-serum/anchor';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';

export interface WhitelistMintMode {
  neverBurn: undefined | boolean;
  burnEveryTime: undefined | boolean;
}

export interface CandyMachine {
  authority: anchor.web3.PublicKey;
  wallet: anchor.web3.PublicKey;
  tokenMint: null | anchor.web3.PublicKey;
  itemsRedeemed: anchor.BN;
  data: CandyMachineData;
}
export interface CandyMachineData {
  itemsAvailable: anchor.BN;
  uuid: null | string;
  symbol: string;
  sellerFeeBasisPoints: number;
  isMutable: boolean;
  maxSupply: anchor.BN;
  price: anchor.BN;
  retainAuthority: boolean;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: PublicKey;
  };
  goLiveDate: null | anchor.BN;
  endSettings: null | [number, anchor.BN];
  whitelistMintSettings: null | {
    mode: WhitelistMintMode;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | anchor.BN;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
  creators: {
    address: PublicKey;
    verified: boolean;
    share: number;
  }[];
}

export interface CandyMachineAccount {
  id: anchor.web3.PublicKey;
  program: anchor.Program;
  state: CandyMachineState;
}

export interface CandyMachineState {
  authority: anchor.web3.PublicKey;
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  treasury: anchor.web3.PublicKey;
  tokenMint: anchor.web3.PublicKey;
  isSoldOut: boolean;
  isActive: boolean;
  isPresale: boolean;
  isWhitelistOnly: boolean;
  goLiveDate: anchor.BN;
  price: anchor.BN;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: anchor.web3.PublicKey;
  };
  endSettings: null | {
    number: anchor.BN;
    endSettingType: any;
  };
  whitelistMintSettings: null | {
    mode: any;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | anchor.BN;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
  retainAuthority: boolean;
}

export interface WhitelistMintMode {
  neverBurn: undefined | boolean;
  burnEveryTime: undefined | boolean;
}

export type AccountAndPubkey = {
  pubkey: string;
  account: AccountInfo<Buffer>;
};

export interface CollectionData {
  mint: anchor.web3.PublicKey;
  candyMachine: anchor.web3.PublicKey;
}

export enum SequenceType {
  Sequential,
  Parallel,
  StopOnFailure,
}

export interface BlockhashAndFeeCalculator {
  blockhash: string;
  lastValidBlockHeight: number;
}

// api args

export interface BasicApiArgs {
  wallet: any;
  connection: Connection;
}

export interface CandyMachineApiArgs extends BasicApiArgs {
  candyMachineId: PublicKey;
}

export interface CreateCandyMachineApiArgs extends BasicApiArgs {
  treasuryWallet: PublicKey;
  splToken: PublicKey | null;
  candyData: CandyMachineData;
}

export interface MintNftApiArgs extends BasicApiArgs {
  candyMachine: CandyMachineAccount;
}
