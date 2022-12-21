import { Program } from '@project-serum/anchor';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { programIds } from '../factory';
import {
  CollectionNftPdaKeys,
  findAssociatedTokenAddress,
  RegularNftPdaKeys,
} from '../pda';
import { MintCollectionNftArgs, MintRegularNftArgs } from '../types/types';

// mint regular nft instruction
async function getMintRegularNftInstruction(args: {
  pdaKeys: RegularNftPdaKeys;
  program: Program;
  receiverAddress: PublicKey;
  payerAddress: PublicKey;
  isParentNft: boolean;
  isMasterEdition: boolean;
  mintUri: string;
  mintSymbol: string;
  mintName: string;
  parentNftCount: number;
}) {
  const argument: MintRegularNftArgs = {
    mintMetadataBump: args.pdaKeys.mintMetadataBump,
    mintMasterEditionBump: args.pdaKeys.mintMasterEditionBump,
    mintName: args.mintName,
    mintSymbol: args.mintSymbol,
    isMasterEdition: args.isMasterEdition,
    isParentNft: args.isParentNft,
    mintUri: args.mintUri,
    nftCount: args.parentNftCount,
  };

  const [receiverMintAta, _] = await findAssociatedTokenAddress(
    args.receiverAddress,
    args.pdaKeys.parentMintAddress
  );

  const mintRegularNftInstruction = await args.program.methods
    .mintRegularNft(argument)
    .accounts({
      receiver: args.receiverAddress,
      payer: args.payerAddress,
      nftSafe: args.pdaKeys.nftSafeAddress,
      mint: args.pdaKeys.parentMintAddress,
      payerMintAta: args.pdaKeys.payerMintAta,
      receiverMintAta: receiverMintAta,
      mintMetadata: args.pdaKeys.mintMetadataAddress,
      mintMasterEdition: args.pdaKeys.mintMasterEditionAddress,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();
  return mintRegularNftInstruction;
}

// mint collection nft instruction
async function getMintCollectionNftInstruction(args: {
  pdaKeys: CollectionNftPdaKeys;
  program: Program;
  receiverAddress: PublicKey;
  payerAddress: PublicKey;
  isParentNft: boolean;
  isMasterEdition: boolean;
  mintUri: string;
  mintSymbol: string;
  mintName: string;
  nftRegularMint: PublicKey;
  nftRegularMasterEdition: PublicKey;
  nftRegularMetadata: PublicKey;
  nftRegularMetadataBump: number;
  nftRegularMasterEditionBump: number;
  nftRegularAdmin: PublicKey;
  nftCollectionCount: number;
  message: Uint8Array | null;
  signature: Uint8Array | null;
}) {
  const argument: MintCollectionNftArgs = {
    mintMetadataBump: args.pdaKeys.mintMetadataBump,
    mintMasterEditionBump: args.pdaKeys.mintMasterEditionBump,
    isMasterEdition: args.isMasterEdition,
    isParentNft: args.isParentNft,
    mintName: args.mintName,
    mintSymbol: args.mintSymbol,
    mintUri: args.mintUri,
    nftRegularMasterEditionBump: args.nftRegularMasterEditionBump,
    nftRegularMetadataBump: args.nftRegularMetadataBump,
    message: args.payerAddress == args.receiverAddress ? null : args.message,
    signature:
      args.payerAddress == args.receiverAddress ? null : args.signature,
  };

  const [receiverMintAta, _] = await findAssociatedTokenAddress(
    args.receiverAddress,
    args.pdaKeys.collectionMintAddress
  );

  let payerMintAta = args.pdaKeys.payerMintAta;
  if (args.payerAddress.toString() === args.receiverAddress.toString()) {
    payerMintAta = receiverMintAta;
  }

  const mintCollectionNftInstruction = await args.program.methods
    .mintCollectionNft(argument)
    .accounts({
      nftRegularAdmin: args.nftRegularAdmin,
      nftRegularMasterEdition: args.nftRegularMasterEdition,
      nftRegularMetadata: args.nftRegularMetadata,
      nftRegularMint: args.nftRegularMint,
      nftRegularAdminSafe: args.pdaKeys.nftSafeAddress,
      receiver: args.receiverAddress,
      payer: args.payerAddress,
      mint: args.pdaKeys.collectionMintAddress,
      receiverMintAta: receiverMintAta,
      payerMintAta: payerMintAta,
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
  return mintCollectionNftInstruction;
}

export { getMintRegularNftInstruction, getMintCollectionNftInstruction };
