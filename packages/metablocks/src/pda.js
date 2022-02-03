import { Program, Provider, utils } from "@kyraa/anchor";
import { PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";

import { programIds, getMetaBlocksProgram } from "./factory";

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

const findUserAssociatedNftAddress = async (usersKey, mintKey) => {
  return await PublicKey.findProgramAddress(
    [
      usersKey.toBuffer(),
      new PublicKey(programIds.spl).toBuffer(),
      mintKey.toBuffer(),
    ],
    new PublicKey(programIds.associatedToken)
  );
};

const findVaultAddress = async (universeKey, usersKey, mintKey) => {
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

const findVaultAssociatedAddress = async (tokenRecipient, mintKey) => {
  return await PublicKey.findProgramAddress(
    [
      tokenRecipient.toBuffer(),
      new PublicKey(programIds.spl).toBuffer(),
      mintKey.toBuffer(),
    ],
    new PublicKey(programIds.associatedToken)
  );
};

export {
  findUniverseAddress,
  findUserNftAddress,
  findUserAssociatedNftAddress,
  findVaultAddress,
  findVaultAssociatedAddress,
};
