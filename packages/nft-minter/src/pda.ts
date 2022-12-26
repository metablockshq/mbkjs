import { Program } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { programIds } from './factory';

const findAssociatedTokenAddress = async (
  tokenRecipientKey: PublicKey,
  mintKey: PublicKey
) => {
  const tokenProgramID = programIds.TOKEN_PROGRAM_ID;

  return await PublicKey.findProgramAddress(
    [
      tokenRecipientKey.toBuffer(),
      tokenProgramID.toBuffer(),
      mintKey.toBuffer(),
    ],
    programIds.ASSOCIATED_TOKEN_PROGRAM_ID
  );
};

const findMetadataAddress = async (mint: PublicKey) => {
  const tokenMetadataProgram = programIds.TOKEN_METADATA_PROGRAM_ID;

  return await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), tokenMetadataProgram.toBuffer(), mint.toBuffer()],
    tokenMetadataProgram
  );
};
const findMasterEditionAddress = async (mint: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      programIds.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    programIds.TOKEN_METADATA_PROGRAM_ID
  );
};

const findNftMinterAddress = async (program: Program<any>) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-minter')],
    program.programId
  );
};

const findClaimAddress = async (
  claimant: PublicKey,
  mint: PublicKey,
  program: Program
) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-minter'), claimant.toBuffer(), mint.toBuffer()],
    program.programId
  );
};

const findMintAddress = async (claimant: PublicKey, program: Program) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-minter'), claimant.toBuffer()],
    program.programId
  );
};

export const findNftSafeAddress = async (
  creator: PublicKey,
  program: Program
) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-safe'), creator.toBuffer()],
    program.programId
  );
};

export const findNftSafeMintAddress = async (
  creator: PublicKey,
  nftCount: number,
  program: Program
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('nft-safe'),
      creator.toBuffer(),
      Buffer.from(nftCount.toString()),
    ],
    program.programId
  );
};

// mint signed nft pdakeys
export interface PdaKeys {
  nftMinterAddress: PublicKey;
  nftMinterMintAta: PublicKey;
  mintAddress: PublicKey;
  claimAddress: PublicKey;
  claimantMintAta: PublicKey;
  mintMetadataAddress: PublicKey;
  mintMetadataBump: number;
  mintMasterEditionAddress: PublicKey;
  mintMasterEditionBump: number;
}

export const getPdaKeys = async (
  claimantWallet: PublicKey,
  program: Program
): Promise<PdaKeys> => {
  const [nftMinterAddress, _] = await findNftMinterAddress(program);

  const [mintAddress, _2] = await findMintAddress(claimantWallet, program);

  const [claimAddress, _3] = await findClaimAddress(
    claimantWallet,
    mintAddress,
    program
  );

  const [claimantMintAta, _4] = await findAssociatedTokenAddress(
    claimantWallet,
    mintAddress
  );

  const [nftMinterMintAta, _5] = await findAssociatedTokenAddress(
    nftMinterAddress,
    mintAddress
  );

  const [mintMetadataAddress, mintMetadataBump] = await findMetadataAddress(
    mintAddress
  );

  const [mintMasterEditionAddress, mintMasterEditionBump] =
    await findMasterEditionAddress(mintAddress);

  return {
    nftMinterAddress: nftMinterAddress,
    mintAddress: mintAddress,
    claimAddress: claimAddress,
    claimantMintAta: claimantMintAta,
    mintMetadataAddress: mintMetadataAddress,
    mintMetadataBump: mintMetadataBump,
    mintMasterEditionAddress: mintMasterEditionAddress,
    mintMasterEditionBump: mintMasterEditionBump,
    nftMinterMintAta: nftMinterMintAta,
  };
};

//mint safe pda keys
export interface SafePdaKeys {
  nftSafeAddress: PublicKey;
  mintAddress: PublicKey;
  mintBump: number;
  payerMintAta: PublicKey;
  mintMetadataAddress: PublicKey;
  mintMetadataBump: number;
  mintMasterEditionAddress: PublicKey;
  mintMasterEditionBump: number;
}

export const getSafePdaKeys = async (
  payerAddress: PublicKey,
  nftCount: number,
  program: Program<any>
): Promise<SafePdaKeys> => {
  const [nftSafeAddress, _1] = await findNftSafeAddress(payerAddress, program);

  const [nftSafeMintAddress, nftMintBump] = await findNftSafeMintAddress(
    payerAddress,
    nftCount,
    program
  );

  const [payerMintAta, _5] = await findAssociatedTokenAddress(
    payerAddress,
    nftSafeMintAddress
  );

  const [mintMetadataAddress, mintMetadataBump] = await findMetadataAddress(
    nftSafeMintAddress
  );

  const [mintMasterEditionAddress, mintMasterEditionBump] =
    await findMasterEditionAddress(nftSafeMintAddress);

  return {
    nftSafeAddress: nftSafeAddress,
    mintAddress: nftSafeMintAddress,
    mintBump: nftMintBump,
    payerMintAta: payerMintAta,
    mintMetadataAddress: mintMetadataAddress,
    mintMetadataBump: mintMetadataBump,
    mintMasterEditionAddress: mintMasterEditionAddress,
    mintMasterEditionBump: mintMasterEditionBump,
  };
};

export interface TokenMetadataKeys {
  metadataBump: number;
  masterEditionBump: number;
  mintAddress: PublicKey;
  metadataAddress: PublicKey;
  masterEditionAddress: PublicKey;
}

export const getTokenMetadataKeys = async (
  mint: PublicKey
): Promise<TokenMetadataKeys> => {
  const [metadataAddress, metadataBump] = await findMetadataAddress(mint);

  const [masterEditionAddress, masterEditionBump] =
    await findMasterEditionAddress(mint);

  return {
    metadataBump: metadataBump,
    masterEditionBump: masterEditionBump,
    mintAddress: mint,
    metadataAddress: metadataAddress,
    masterEditionAddress: masterEditionAddress,
  };
};

export {
  findAssociatedTokenAddress,
  findMetadataAddress,
  findMasterEditionAddress,
  findClaimAddress,
  findMintAddress,
  findNftMinterAddress,
};
