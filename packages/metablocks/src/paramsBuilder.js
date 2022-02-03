import { SystemProgram } from "@solana/web3.js";
import {
  findUniverseAddress,
  findUserNftAddress,
  findVaultAddress,
  findVaultAssociatedAddress,
  findUserAssociatedNftAddress,
} from "./pda";

const computeCreateUniverseParams = async ({ usersKey }) => {
  const [universeKey, universeBump] = await findUniverseAddress(usersKey);
  const accounts = {
    universe: universeKey,
    payer: usersKey,
    universeAuthority: usersKey,
    systemProgram: SystemProgram.programId,
  };

  return {
    universeKey,
    universeBump,
    accounts,
  };
};

const computeDepositNftParams = async (usersKey, mintKey, universeKey) => {
  // userNftKey is the wrapper account for the vault where the NFT is stored rn
  // bump is needed for validation
  const [userNftKey, userNftBump] = await findUserNftAddress(usersKey, mintKey);

  // vaultKey is the owner of the vaultAssociatedAccount
  const [vaultKey, vaultBump] = await findVaultAddress(
    universeKey,
    usersKey,
    mintKey
  );

  // vaultAssociatedKey is the public key of the (escrow) account that actually stores the nft
  const [vaultAssociatedKey, vaultAssociatedBump] =
    await findVaultAssociatedAddress(vaultKey, mintKey);

  const [userAssociatedNftKey, userAssociatedNftBump] =
    await findUserAssociatedNftAddress(usersKey, mintKey);

  const depositAccounts = {
    userNft: userNftKey,
    vaultAuthority: vaultKey,
    authority: usersKey,
    universe: universeKey,
    userAssociatedNft: userAssociatedNftKey,
    vaultAssociatedNft: vaultAssociatedKey,
    tokenMint: mintKey,
    payer: usersKey,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  return {
    userNftKey,
    userNftBump,
    userAssociatedNftKey,
    userAssociatedNftBump,
    vaultKey,
    vaultBump,
    vaultAssociatedKey,
    vaultAssociatedBump,

    // only need this to perform rpc
    depositAccount,
  };
};

export { computeDepositNftParams, computeCreateUniverseParams };
