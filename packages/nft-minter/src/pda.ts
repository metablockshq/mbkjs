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

export const findNftSafeCollectionMintAddress = async (
  authority: PublicKey,
  parentMintAddress: PublicKey,
  nftCollectionCount: number
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('nft-safe'),
      authority.toBuffer(),
      parentMintAddress.toBuffer(),
      Buffer.from(nftCollectionCount.toString()),
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
export interface RegularNftPdaKeys {
  nftSafeAddress: PublicKey;
  nftCollectionAdminSafeAddress: PublicKey;
  parentMintAddress: PublicKey;
  receiverMintAta: PublicKey;
  payerMintAta: PublicKey;
  mintMetadataAddress: PublicKey;
  mintMetadataBump: number;
  mintMasterEditionAddress: PublicKey;
  mintMasterEditionBump: number;
}

export const getParentPdaKeys = async (
  receiverAddress: PublicKey,
  payerAddress: PublicKey,
  nftCount: number,
  nftCollectionAdminAddress: PublicKey = Keypair.generate().publicKey
): Promise<RegularNftPdaKeys> => {
  const [nftSafeAddress, _1] = await findNftSafeAddress(payerAddress);

  const [nftParentMintAddress, _2] = await findNftSafeMintAddress(
    payerAddress,
    nftCount
  );

  const [nftCollectionAdminSafeAddress, _6] = await findNftSafeAddress(
    nftCollectionAdminAddress
  );

  const [receiverMintAta, _4] = await findAssociatedTokenAddress(
    receiverAddress,
    nftParentMintAddress
  );

  const [payerMintAta, _5] = await findAssociatedTokenAddress(
    payerAddress,
    nftParentMintAddress
  );

  const [mintMetadataAddress, mintMetadataBump] = await findMetadataAddress(
    nftParentMintAddress
  );

  const [mintMasterEditionAddress, mintMasterEditionBump] =
    await findMasterEditionAddress(nftParentMintAddress);
  return {
    nftCollectionAdminSafeAddress: nftCollectionAdminSafeAddress,
    nftSafeAddress: nftSafeAddress,
    parentMintAddress: nftParentMintAddress,
    payerMintAta: payerMintAta,
    receiverMintAta: receiverMintAta,
    mintMetadataAddress: mintMetadataAddress,
    mintMetadataBump: mintMetadataBump,
    mintMasterEditionAddress: mintMasterEditionAddress,
    mintMasterEditionBump: mintMasterEditionBump,
  };
};

export interface CollectionNftPdaKeys {
  nftSafeAddress: PublicKey;
  nftCollectionAdminSafeAddress: PublicKey;
  parentMintAddress: PublicKey | null;
  receiverMintAta: PublicKey;
  payerMintAta: PublicKey;
  mintMetadataAddress: PublicKey;
  mintMetadataBump: number;
  mintMasterEditionAddress: PublicKey;
  mintMasterEditionBump: number;
  collectionMintAddress: PublicKey;
}

export const getCollectionPdaKeys = async (
  receiverAddress: PublicKey,
  payerAddress: PublicKey,
  parentMintAddress: PublicKey,
  nftCollectionCount: number,
  nftCollectionAdminAddress: PublicKey = Keypair.generate().publicKey
): Promise<CollectionNftPdaKeys> => {
  const [nftSafeAddress, _1] = await findNftSafeAddress(payerAddress);

  const [nftSafeCollectionMintAddress, _8] =
    await findNftSafeCollectionMintAddress(
      payerAddress,
      parentMintAddress,
      nftCollectionCount
    );

  const [nftCollectionAdminSafeAddress, _6] = await findNftSafeAddress(
    nftCollectionAdminAddress
  );

  const [receiverMintAta, _4] = await findAssociatedTokenAddress(
    receiverAddress,
    nftSafeCollectionMintAddress
  );

  const [payerMintAta, _5] = await findAssociatedTokenAddress(
    payerAddress,
    nftSafeCollectionMintAddress
  );

  const [mintMetadataAddress, mintMetadataBump] = await findMetadataAddress(
    nftSafeCollectionMintAddress
  );

  const [mintMasterEditionAddress, mintMasterEditionBump] =
    await findMasterEditionAddress(nftSafeCollectionMintAddress);
  return {
    nftCollectionAdminSafeAddress: nftCollectionAdminSafeAddress,
    nftSafeAddress: nftSafeAddress,
    parentMintAddress: null,
    payerMintAta: payerMintAta,
    receiverMintAta: receiverMintAta,
    mintMetadataAddress: mintMetadataAddress,
    mintMetadataBump: mintMetadataBump,
    mintMasterEditionAddress: mintMasterEditionAddress,
    mintMasterEditionBump: mintMasterEditionBump,
    collectionMintAddress: nftSafeCollectionMintAddress,
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
