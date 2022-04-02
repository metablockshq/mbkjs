import { Program } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import {
  ClaimArgs,
  DelegateTokensArgs,
  InitTokenDistributorArgs,
  TokenDistributor,
  TransferTokensArgs,
  UpdateDistributorArgs,
} from './types';
import { findAssociatedAddress, findClaimCount, PdaKeys } from './pda';

export const getInitTokenDistributorInstruction = async (
  args: InitTokenDistributorArgs,
  program: Program<any>,
  pdaKeys: PdaKeys,
  authority: PublicKey
) => {
  return await program.methods
    .initDistributorV1(args)
    .accounts({
      distributor: pdaKeys.distributorAddress,
      tokenWhitelistMint: pdaKeys.tokenWhiteListMintAddress,
      tokenWhitelistAta: pdaKeys.tokenWhitelistAta,
      authority: authority,
      authorityWhitelistAta: pdaKeys.authorityWhitelistAta,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .instruction();
};

export const getClaimInstruction = async (
  signature: any,
  message: any,
  program: Program<any>,
  pdaKeys: PdaKeys,
  claimPayer: PublicKey
) => {
  const [claimantWhitelistAta, _] = await findAssociatedAddress(
    claimPayer,
    pdaKeys.tokenWhiteListMintAddress
  );

  const [claimCountAddress, claimBump] = await findClaimCount(claimPayer);

  const args: ClaimArgs = {
    signature: signature,
    message: message,
    claimBump: claimBump,
  };

  return await program.methods
    .claimV1(args)
    .accounts({
      distributor: pdaKeys.distributorAddress,
      payer: claimPayer,
      tokenWhitelistMint: pdaKeys.tokenWhiteListMintAddress,
      tokenWhitelistAta: pdaKeys.tokenWhitelistAta,
      claimCount: claimCountAddress,
      claimantWhitelistAta: claimantWhitelistAta,
      systemProgram: anchor.web3.SystemProgram.programId,
      instructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .instruction();
};

export const getTransferTokensInstruction = async (
  args: TransferTokensArgs,
  recipientAuthority: PublicKey,
  program: Program<any>,
  pdaKeys: PdaKeys,
  authority: PublicKey
) => {
  const [recipientAuthorityAta, _] = await findAssociatedAddress(
    recipientAuthority,
    pdaKeys.tokenWhiteListMintAddress
  );

  return await program.methods
    .transferWlTokensV1(args)
    .accounts({
      authority: authority,
      distributor: pdaKeys.distributorAddress,
      tokenWhitelistMint: pdaKeys.tokenWhiteListMintAddress,
      tokenWhitelistAta: pdaKeys.tokenWhitelistAta,
      recipient: recipientAuthority,
      recipientWhitelistAta: recipientAuthorityAta,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .instruction();
};

export const getDelegateTokensInstruction = async (
  args: DelegateTokensArgs,
  delegateAuthority: PublicKey,
  program: Program<any>,
  pdaKeys: PdaKeys,
  authority: PublicKey
) => {
  return await program.methods
    .delegateWlTokensV1(args)
    .accounts({
      authority: authority,
      distributor: pdaKeys.distributorAddress,
      tokenWhitelistMint: pdaKeys.tokenWhiteListMintAddress,
      tokenWhitelistAta: pdaKeys.tokenWhitelistAta,
      delegate: delegateAuthority,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .instruction();
};

export const getUpdateDistributorInstruction = async (
  args: UpdateDistributorArgs,
  program: Program<any>,
  pdaKeys: PdaKeys,
  authority: PublicKey
) => {
  return await program.methods
    .updateDistributorV1(args)
    .accounts({
      distributor: pdaKeys.distributorAddress,
      tokenWhitelistMint: pdaKeys.tokenWhiteListMintAddress,
      tokenWhitelistAta: pdaKeys.tokenWhitelistAta,
      authority: authority,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .instruction();
};
