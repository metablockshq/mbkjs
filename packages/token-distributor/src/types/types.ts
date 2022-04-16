import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

export interface InitTokenDistributorArgs {
  totalTokenAmount: anchor.BN;
  initialAuthorityTokens: anchor.BN;
  userClaimAmount: number;
  tokenExpiryDate: anchor.BN;
  overallTokenClaimLimit: anchor.BN;
}

export interface ClaimArgs {
  signature: any;
  message: any;
  claimBump: number;
}

export interface TransferTokensArgs {
  amount: anchor.BN;
}

export interface DelegateTokensArgs {
  amount: anchor.BN;
}

export interface UpdateDistributorArgs {
  totalTokenAmount: anchor.BN | null;
  userClaimAmount: number | null;
  tokenExpiryDate: anchor.BN | null;
  overallTokenClaimLimit: anchor.BN | null;
  resetUsersTokensClaimed: boolean | null;
}

// api args

interface BasicInputApiArgs {
  connection: Connection;
  wallet: any;
}

export interface InitTokenDistributorApiArgs extends BasicInputApiArgs {
  totalTokenAmount: number;
  initialAuthorityTokens: number;
  userClaimAmount: number;
  tokenExpiryDate: number;
  overallTokenClaimLimit: number;
}

export interface ClaimApiArgs extends BasicInputApiArgs {
  signature: Uint8Array;
  authority: PublicKey;
}

export interface TransferTokensApiArgs extends BasicInputApiArgs {
  amount: number;
  recipientAuthority: PublicKey;
}

export interface DelegateTokensApiArgs extends BasicInputApiArgs {
  amount: number;
  delegateAuthority: PublicKey;
}

export interface UpdateDistributorApiArgs extends BasicInputApiArgs {
  totalTokenAmount: number | null;
  userClaimAmount: number | null;
  tokenExpiryDate: number | null;
  overallTokenClaimLimit: number | null;
  resetUsersTokensClaimed: boolean | null;
}
