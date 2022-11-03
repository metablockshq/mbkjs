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

const findNftMinterAddress = async () => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-minter')],
    programIds.NFT_MINTER_PROGRAM_ID
  );
};

const findClaimAddress = async (claimant: PublicKey, mint: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-minter'), claimant.toBuffer(), mint.toBuffer()],
    programIds.NFT_MINTER_PROGRAM_ID
  );
};

const findMintAddress = async (claimant: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-minter'), claimant.toBuffer()],
    programIds.NFT_MINTER_PROGRAM_ID
  );
};

export const findNftSafeAddress = async (creator: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('nft-safe'), creator.toBuffer()],
    programIds.NFT_MINTER_PROGRAM_ID
  );
};

export const findNftSafeMintAddress = async (
  creator: PublicKey,
  nftCount: number
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('nft-safe'),
      creator.toBuffer(),
      Buffer.from(nftCount.toString()),
    ],
    programIds.NFT_MINTER_PROGRAM_ID
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
  claimantWallet: PublicKey
): Promise<PdaKeys> => {
  const [nftMinterAddress, _] = await findNftMinterAddress();

  const [mintAddress, _2] = await findMintAddress(claimantWallet);

  const [claimAddress, _3] = await findClaimAddress(
    claimantWallet,
    mintAddress
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
  // nftCollectionAdminSafeAddress: PublicKey;
  mintAddress: PublicKey;
  payerMintAta: PublicKey;
  mintMetadataAddress: PublicKey;
  mintMetadataBump: number;
  mintMasterEditionAddress: PublicKey;
  mintMasterEditionBump: number;
}

export const getSafePdaKeys = async (
  payerAddress: PublicKey,
  nftCount: number
  //nftCollectionAdminAddress: PublicKey = Keypair.generate().publicKey
): Promise<SafePdaKeys> => {
  const [nftSafeAddress, _1] = await findNftSafeAddress(payerAddress);

  const [nftSafeMintAddress, _2] = await findNftSafeMintAddress(
    payerAddress,
    nftCount
  );

  // const [nftCollectionAdminSafeAddress, _6] = await findNftSafeAddress(
  //   nftCollectionAdminAddress
  // );

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
    //nftCollectionAdminSafeAddress: nftCollectionAdminSafeAddress,
    nftSafeAddress: nftSafeAddress,
    mintAddress: nftSafeMintAddress,
    payerMintAta: payerMintAta,
    mintMetadataAddress: mintMetadataAddress,
    mintMetadataBump: mintMetadataBump,
    mintMasterEditionAddress: mintMasterEditionAddress,
    mintMasterEditionBump: mintMasterEditionBump,
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
