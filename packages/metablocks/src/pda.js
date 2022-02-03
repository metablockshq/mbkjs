import { utils } from "@kyraa/anchor";
import { PublicKey } from "@solana/web3.js";

import { programIds } from "./factory";

const findUniverseAddress = async (universeAuthority) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode("Universe")),
      universeAuthority.toBytes(),
    ],
    new PublicKey(programIds.metaBlocks)
  );
};

const findUserNftAddress = async (userAuthority, mintKey) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode("UserNft")),
      userAuthority.toBuffer(),
      mintKey.toBuffer(),
    ],
    new PublicKey(programIds.metaBlocks)
  );
};

const findAssociatedAddress = async (tokenRecipientKey, mintKey) => {
  return await PublicKey.findProgramAddress(
    [
      tokenRecipientKey.toBuffer(),
      new PublicKey(programIds.token).toBuffer(),
      mintKey.toBuffer(),
    ],
    new PublicKey(programIds.associatedToken)
  );
};

const findVaultAuthorityAddress = async (universeKey, usersKey, mintKey) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode("VaultMetaBlocks")),
      universeKey.toBuffer(),
      usersKey.toBuffer(),
      mintKey.toBuffer(),
    ],
    new PublicKey(programIds.metaBlocks)
  );
};

// const findVaultAssociatedAddress = async (tokenRecipient, mintKey) => {
//   return await PublicKey.findProgramAddress(
//     [
//       tokenRecipient.toBuffer(),
//       new PublicKey(programIds.token).toBuffer(),
//       mintKey.toBuffer(),
//     ],
//     new PublicKey(programIds.associatedToken)
//   );
// };

const findReceiptMintAddress = async (universeKey, authorityKey, tokenMint) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from(utils.bytes.utf8.encode("ReceiptNftMint")),
      universeKey.toBuffer(),
      authorityKey.toBuffer(),
      tokenMint.toBuffer(),
    ],
    new PublicKey(programIds.metaBlocks)
  );
};

const findReceiptTokenAddress = async (receiptMint) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from("ReceiptNftToken"), receiptMint.toBuffer()],
    new PublicKey(programIds.metaBlocks)
  );
};

const findMetadataAddress = async (mint) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      new PublicKey(programIds.metadata).toBuffer(),
      mint.toBuffer(),
    ],
    new PublicKey(programIds.metadata)
  );
};
const findMasterEditionAddress = async (mint) => {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      new PublicKey(programIds.metadata).toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
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
