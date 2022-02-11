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

const findUserNftAddress = async (
  userAuthority: PublicKey,
  mintKey: PublicKey
) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode('UserNft')),
      userAuthority.toBuffer(),
      mintKey.toBuffer(),
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

const findVaultAuthorityAddress = async (
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

const findReceiptTokenAddress = async (receiptMint: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('ReceiptNftToken'), receiptMint.toBuffer()],
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
  findUserNftAddress,
  findAssociatedAddress,
  findVaultAuthorityAddress,
  findReceiptMintAddress,
  findReceiptTokenAddress,
  findMetadataAddress,
  findMasterEditionAddress,
};
