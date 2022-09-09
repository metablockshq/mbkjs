import { SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { pda } from '..';
import { programIds } from '../factory';
import {
  CreateMintArgs,
  MintNftArgs,
  MintNftWithCollectionArgs,
} from '../types/types';

export const getCreateMintInstruction = async (args: CreateMintArgs) => {
  return await args.program.methods
    .createMint({
      uri: args.uri,
    })
    .accounts({
      claimant: args.claimantAddress,
      nftMinter: args.pdaKeys.nftMinterAddress,
      claim: args.pdaKeys.claimAddress,
      mint: args.pdaKeys.mintAddress,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })

    .instruction();
};

export const getMintNftInstuction = async (args: MintNftArgs) => {
  const mintArgs = {
    mintMetadataBump: args.pdaKeys.mintMetadataBump,
    mintMasterEditionBump: args.pdaKeys.mintMasterEditionBump,
    mintName: args.mintName,
    mintSymbol: args.mintSymbol,
    isMasterEdition: args.isMasterEdition,
    isNftForCollection: args.isNftForCollection,
  };

  return await args.program.methods
    .mintNft(mintArgs)
    .accounts({
      claimant: args.claimantAddress,
      nftMinter: args.pdaKeys.nftMinterAddress,
      nftMinterAta: args.pdaKeys.nftMinterMintAta,
      claim: args.pdaKeys.claimAddress,
      mint: args.pdaKeys.mintAddress,
      claimantMintAta: args.pdaKeys.claimantMintAta,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      mintMetadata: args.pdaKeys.mintMetadataAddress,
      mintMasterEdition: args.pdaKeys.mintMasterEditionAddress,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
    })
    .instruction();
};

export const getMintNftWithCollectionInstuction = async (
  args: MintNftWithCollectionArgs
) => {
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
    isNftForCollection: args.isNftForCollection,
    nftCollectionMint: args.nftCollectionMintAddress,
    nftCollectionMasterEdition: nftCollectionMasterEdition,
    nftCollectionMetdata: nftCollectionMetadata,
    nftCollectionMetadataBump: nftCollectionMetadataBump,
    nftCollectionMasterEditionBump: nftCollectionMasterEditionBump,
  };

  return await args.program.methods
    .mintNftWithCollection(mintArgs)
    .accounts({
      claimant: args.claimantAddress,
      nftMinter: args.pdaKeys.nftMinterAddress,
      claim: args.pdaKeys.claimAddress,
      mint: args.pdaKeys.mintAddress,
      claimantMintAta: args.pdaKeys.claimantMintAta,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      mintMetadata: args.pdaKeys.mintMetadataAddress,
      mintMasterEdition: args.pdaKeys.mintMasterEditionAddress,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
      nftCollectionMint: args.nftCollectionMintAddress,
      nftCollectionMasterEdition: nftCollectionMasterEdition,
      nftCollectionMetadata: nftCollectionMetadata,
    })
    .instruction();
};
