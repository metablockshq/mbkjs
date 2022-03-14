import { utils } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { programIds } from './factory';

const findUniverseAddress = async (universeAuthority: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('Universe')),
      universeAuthority.toBytes(),
    ],
    programIds.META_BLOCKS_PROGRAM_ID
  );
};

const findWrappedUserNftAddress = async (
  userAuthority: PublicKey,
  receiptMintKey: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('WrappedUserNft')),
      userAuthority.toBuffer(),
      receiptMintKey.toBuffer(),
    ],
    programIds.META_BLOCKS_PROGRAM_ID
  );
};

const findAssociatedAddress = async (
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

const findVaultAddress = async (
  universeKey: PublicKey,
  usersKey: PublicKey,
  mintKey: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('VaultMetaBlocks')),
      universeKey.toBuffer(),
      usersKey.toBuffer(),
      mintKey.toBuffer(),
    ],
    programIds.META_BLOCKS_PROGRAM_ID
  );
};

const findReceiptMintAddress = async (
  universeKey: PublicKey,
  authorityKey: PublicKey,
  tokenMint: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('ReceiptNftMint')),
      universeKey.toBuffer(),
      authorityKey.toBuffer(),
      tokenMint.toBuffer(),
    ],
    programIds.META_BLOCKS_PROGRAM_ID
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

const findMetaNftAddress = async (
  authorityKey: PublicKey,
  universeKey: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('MetaNft')),
      universeKey.toBuffer(),
      authorityKey.toBuffer(),
    ],
    programIds.META_NFT_PROGRAM_ID
  );
};

const findMetaNftMintAddress = async (
  universeKey: PublicKey,
  authorityKey: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('MetaNftMint')),
      universeKey.toBuffer(),
      authorityKey.toBuffer(),
    ],
    programIds.META_NFT_PROGRAM_ID
  );
};

const findMetaBlocksAuthority = async (
  universeKey: PublicKey,
  payerKey: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('MetaBlocksAuthority')),
      universeKey.toBuffer(),
      payerKey.toBuffer(),
    ],
    programIds.META_BLOCKS_PROGRAM_ID
  );
};

export {
  findUniverseAddress,
  findWrappedUserNftAddress,
  findAssociatedAddress,
  findVaultAddress,
  findReceiptMintAddress,
  findMetadataAddress,
  findMasterEditionAddress,
  findMetaNftAddress,
  findMetaNftMintAddress,
  findMetaBlocksAuthority,
};

export interface PdaKeys {
  universeKey: PublicKey;
  vaultKey: PublicKey;
  vaultNftAta: PublicKey;
  mint: PublicKey;
  userNftAta: PublicKey;
  receiptMint: PublicKey;
  userReceiptAta: PublicKey;
  receiptMetadataKey: PublicKey;
  receiptMasterEditionKey: PublicKey;
  userNftMetadataKey: PublicKey;
  wrappedUserNft: PublicKey;
  vaultReceiptAta: PublicKey;
  metaNft: PublicKey;
  metaNftMint: PublicKey;
  metaNftMintAta: PublicKey;
  metaBlocksAuthority: PublicKey;
  metaNftMetadataAddress: PublicKey;
  metaNftMasterEditionAddress: PublicKey;
}

export const getPdaKeys = async (
  universeKey: PublicKey,
  usersKey: PublicKey,
  mintKey: PublicKey
): Promise<PdaKeys> => {
  const [receiptMint, _receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [userNftAta, _u] = await findAssociatedAddress(usersKey, mintKey);

  const [vaultKey, _vaultAuthorityBump] = await findVaultAddress(
    universeKey,
    usersKey,
    receiptMint
  );

  const [vaultReceiptAta, _vaultReceiptAtaBump] = await findAssociatedAddress(
    vaultKey,
    receiptMint
  );

  const [vaultNftAta, _vaultAtaBump] = await findAssociatedAddress(
    vaultKey,
    mintKey
  );

  const [wrappedUserNftKey, _userNftBump] = await findWrappedUserNftAddress(
    usersKey,
    receiptMint
  );

  const [userReceiptAta, _userReceiptAtaBump] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const [userNftMetadata, _] = await findMetadataAddress(mintKey);

  const [receiptMetadataAddress, _receiptMetadataBump] =
    await findMetadataAddress(receiptMint);

  const [receiptMasterEditionAddress, _receiptMasterEditionBump] =
    await findMasterEditionAddress(receiptMint);

  const [metaNft, _mft] = await findMetaNftAddress(usersKey, universeKey);

  const [metaNftMint, _mfm] = await findMetaNftMintAddress(
    universeKey,
    usersKey
  );

  const [metaBlocksAuthority, _mba] = await findMetaBlocksAuthority(
    universeKey,
    usersKey
  );

  const [metaNftMintAta, _mfma] = await findAssociatedAddress(
    metaNft,
    metaNftMint
  );

  const [metaNftMetadataAddress, _metaNftMetadataBump] =
    await findMetadataAddress(metaNftMint);

  const [metaNftMasterEditionAddress, _metaNftMasterEditionBump] =
    await findMasterEditionAddress(metaNftMint);

  return {
    universeKey: universeKey,
    vaultKey: vaultKey,
    vaultNftAta: vaultNftAta,
    mint: mintKey,
    userNftAta: userNftAta,
    receiptMint: receiptMint,
    userReceiptAta: userReceiptAta,
    receiptMetadataKey: receiptMetadataAddress,
    receiptMasterEditionKey: receiptMasterEditionAddress,
    userNftMetadataKey: userNftMetadata,
    wrappedUserNft: wrappedUserNftKey,
    vaultReceiptAta: vaultReceiptAta,
    metaNft: metaNft,
    metaNftMint: metaNftMint,
    metaNftMintAta: metaNftMintAta,
    metaBlocksAuthority: metaBlocksAuthority,
    metaNftMetadataAddress: metaNftMetadataAddress,
    metaNftMasterEditionAddress: metaNftMasterEditionAddress,
  };
};
