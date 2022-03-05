import { utils } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { programIds } from './factory';

const findUniverseAddress = async (universeAuthority: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('Universe')),
      universeAuthority.toBytes(),
    ],
    new PublicKey(programIds.metaBlocks)
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
    new PublicKey(programIds.metaBlocks)
  );
};

const findAssociatedAddress = async (
  tokenRecipientKey: PublicKey,
  mintKey: PublicKey
) => {
  const tokenProgramID = new PublicKey(programIds.token);

  return await PublicKey.findProgramAddress(
    [
      tokenRecipientKey.toBuffer(),
      tokenProgramID.toBuffer(),
      mintKey.toBuffer(),
    ],
    new PublicKey(programIds.associatedToken)
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
    new PublicKey(programIds.metaBlocks)
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
    new PublicKey(programIds.metaBlocks)
  );
};

const findMetadataAddress = async (mint: PublicKey) => {
  const tokenMetadataProgram = new PublicKey(programIds.metadata);

  return await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), tokenMetadataProgram.toBuffer(), mint.toBuffer()],
    tokenMetadataProgram
  );
};
const findMasterEditionAddress = async (mint: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata'),
      new PublicKey(programIds.metadata).toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    new PublicKey(programIds.metadata)
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
  };
};
