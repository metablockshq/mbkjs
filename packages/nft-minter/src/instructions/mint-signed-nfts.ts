import {
  Ed25519Program,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

import { MintSignedCollectionNftArgs, MintSignedNftArgs } from '../types/types';
import { programIds } from '../factory';
import * as pda from '../pda';

export const getMintSignedNftInstruction = async (args: MintSignedNftArgs) => {
  const claimArgs = {
    signature: args.signature,
    message: args.message,
  };

  const mintArgs = {
    mintMetadataBump: args.pdaKeys.mintMetadataBump,
    mintMasterEditionBump: args.pdaKeys.mintMasterEditionBump,
    mintName: args.mintName,
    mintSymbol: args.mintSymbol,
    isMasterEdition: args.isMasterEdition,
    isNftForCollection: args.isParentForNfts,
    mintUri: args.mintUri,
  };

  const mintRegularNftInstruction = await args.program.methods
    .mintRegularNft(mintArgs, claimArgs)
    .accounts({
      claimant: args.claimantAddress,
      nftMinter: args.pdaKeys.nftMinterAddress,
      claim: args.pdaKeys.claimAddress,
      mint: args.pdaKeys.mintAddress,
      claimantMintAta: args.pdaKeys.claimantMintAta,
      mintMetadata: args.pdaKeys.mintMetadataAddress,
      mintMasterEdition: args.pdaKeys.mintMasterEditionAddress,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    })
    .instruction();
  return mintRegularNftInstruction;
};

export const getMintSignedCollectionNftInstruction = async (
  args: MintSignedCollectionNftArgs
) => {
  const claimArgs = {
    signature: args.signature,
    message: args.message,
  };

  const [nftCollectionMasterEdition, nftCollectionMasterEditionBump] =
    await pda.findMasterEditionAddress(args.nftCollectionMintAddress);

  const [nftCollectionMetadata, nftCollectionMetadataBump] =
    await pda.findMetadataAddress(args.nftCollectionMintAddress);

  const mintArgs = {
    mintMetadataBump: args.pdaKeys.mintMetadataBump,
    mintMasterEditionBump: args.pdaKeys.mintMasterEditionBump,
    mintName: args.mintName,
    mintSymbol: args.mintSymbol,
    isMasterEdition: args.isMasterEdition,
    isNftForCollection: args.isParentForNfts,
    mintUri: args.mintUri,
    nftCollectionMasterEditionBump: nftCollectionMasterEditionBump,
    nftCollectionMetadataBump: nftCollectionMetadataBump,
  };

  const mintCollectionNftInstruction = await args.program.methods
    .mintCollectionNft(mintArgs, claimArgs)
    .accounts({
      claimant: args.claimantAddress,
      nftMinter: args.pdaKeys.nftMinterAddress,
      claim: args.pdaKeys.claimAddress,
      mint: args.pdaKeys.mintAddress,
      claimantMintAta: args.pdaKeys.claimantMintAta,
      mintMetadata: args.pdaKeys.mintMetadataAddress,
      mintMasterEdition: args.pdaKeys.mintMasterEditionAddress,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
      nftCollectionMasterEdition: nftCollectionMasterEdition,
      nftCollectionMetadata: nftCollectionMetadata,
      nftCollectionMint: args.nftCollectionMintAddress,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
    })
    .instruction();
  return mintCollectionNftInstruction;
};

export const getEdInstruction = (args: {
  message: Uint8Array;
  authorityAddress: PublicKey;
  signature: Uint8Array;
}) => {
  const edInstruction = Ed25519Program.createInstructionWithPublicKey({
    message: args.message,
    publicKey: args.authorityAddress.toBytes(),
    signature: args.signature,
    instructionIndex: 0,
  });
  return edInstruction;
};
