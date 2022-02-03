import { SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  findUniverseAddress,
  findUserNftAddress,
  findAssociatedAddress,
  findVaultAuthorityAddress,
  findReceiptMintAddress,
  findReceiptTokenAddress,
  findMetadataAddress,
  findMasterEditionAddress,
} from "./pda";

// compute Create universe params
const computeCreateUniverseParams = async ({
  usersKey,
  name,
  description,
  websiteUrl,
}) => {
  const [universeKey, universeBump] = await findUniverseAddress(usersKey);

  const createUniverseArgs = {
    name: name,
    websiteUrl: websiteUrl,
    description: description,
    bump: universeBump,
  };

  const accounts = {
    universe: universeKey,
    payer: usersKey,
    universeAuthority: usersKey,
    systemProgram: SystemProgram.programId,
  };

  return {
    createUniverseArgs,
    accounts,
  };
};

const computeUpdateUniverseParams = async ({
  usersKey,
  name,
  description,
  websiteUrl,
}) => {
  const [universeKey, universeBump] = await findUniverseAddress(usersKey);

  const updateUniverseArgs = {
    name: name,
    websiteUrl: websiteUrl,
    description: description,
    bump: universeBump,
  };

  const accounts = {
    universe: universeKey,
    payer: usersKey,
    universeAuthority: usersKey,
    systemProgram: SystemProgram.programId,
  };

  return {
    accounts,
    updateUniverseArgs,
  };
};

const computeInitReceiptMintParams = async ({
  usersKey,
  mintKey,
  universeKey,
}) => {
  const [receiptMint, receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const initReceiptMintArgs = {
    receiptMintBump: receiptMintBump,
    vaultBump: vaultAuthorityBump,
  };
  const initReceiptMintAccounts = {
    universe: universeKey,
    authority: usersKey,
    vaultAuthority: vaultAuthorityKey,
    receiptMint: receiptMint,
    tokenMint: mintKey,
    tokenProgram: new PublicKey(programIds.token),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  return {
    initReceiptMintArgs,
    initReceiptMintAccounts,
  };
};

const computeInitDepositNftParams = async ({
  usersKey,
  mintKey,
  universeKey,
}) => {
  const [receiptMint, receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const [vaultReceiptAta, vaultReceiptAtaBump] = await findAssociatedAddress(
    vaultAuthorityKey,
    receiptMint
  );

  const vaultAtaBump = await findAssociatedAddress(
    vaultAuthorityKey,
    mintKey
  )[1];

  const [receiptTokenAddress, receiptTokenBump] = await findReceiptTokenAddress(
    receiptMint
  );

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const [userReceiptAta, userReceiptAtaBump] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const initDepositArgs = {
    receiptMintBump: receiptMintBump,
    receiptTokenBump: receiptTokenBump,
    vaultBump: vaultAuthorityBump,
    vaultReceiptAtaBump: vaultReceiptAtaBump,
    userNftBump: userNftBump,
    associatedVaultBump: vaultAtaBump,
    userReceiptAtaBump: userReceiptAtaBump,
  };

  const initDepositAccounts = {
    userNft: userNftKey,
    universe: universeKey,
    authority: usersKey,
    vaultAuthority: vaultAuthorityKey,
    receiptMint: receiptMint,
    receiptToken: receiptTokenAddress,
    vaultReceiptAta: vaultReceiptAta,
    userReceiptAta: userReceiptAta,
    tokenMint: mintKey,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  return {
    initDepositArgs,
    initDepositAccounts,
  };
};

const computeDepositNftParams = async ({ usersKey, mintKey, universeKey }) => {
  const [receiptMint, receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const [vaultAta, vaultAtaBump] = await findAssociatedAddress(
    vaultAuthorityKey,
    mintKey
  );

  const receiptTokenBump = await findReceiptTokenAddress(receiptMint)[1];

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const userReceiptAtaBump = await findAssociatedAddress(
    usersKey,
    receiptMint
  )[1];

  const userNftMetadata = await findMetadataAddress(mintKey)[0];

  const depositNftArgs = {
    userNftBump: userNftBump,
    vaultBump: vaultAuthorityBump,
    associatedBump: vaultAtaBump,
    receiptMintBump: receiptMintBump,
    receiptAtaBump: userReceiptAtaBump,
    receiptTokenBump: receiptTokenBump,
  };

  const depositNftAccounts = {
    userNft: userNftKey,
    vaultAuthority: vaultAuthorityKey,
    authority: usersKey,
    universe: universeKey,
    userNftAta: userNftKey,
    userNftMetadata: userNftMetadata,
    vaultNftAta: vaultAta,
    tokenMint: mintKey,
    receiptMint: receiptMint,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  return {
    depositNftArgs,
    depositNftAccounts,
  };
};

const computeTransferReceiptNftParams = async ({
  usersKey,
  mintKey,
  universeKey,
  url,
  isReceiptMasterEdition,
}) => {
  const [receiptMint, receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const vaultReceiptAta = await findAssociatedAddress(
    vaultAuthorityKey,
    receiptMint
  )[0];

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const userReceiptAta = await findAssociatedAddress(usersKey, receiptMint)[0];

  const receiptMetadataAddress = await findMetadataAddress(receiptMint)[0];

  const receiptMasterEditionAddress = await findMasterEditionAddress(
    receiptMint
  )[0];

  const vaultCreator = {
    address: vaultAuthorityKey,
    verified: true,
    share: 100,
  };

  const userCreator = {
    address: usersKey,
    verified: false,
    share: 0,
  };

  const creators = [];
  creators.push(vaultCreator);
  creators.push(userCreator);

  const transferReceiptNftArgs = {
    userNftBump: userNftBump,
    vaultBump: vaultAuthorityBump,
    receiptMintBump: receiptMintBump,
    uri: url,
    creators: creators,
    name: "MetablocksReceiptNft",
    symbol: "mbk",
    sellerFeeBasisPoints: 0,
    isMutable: false,
    isReceiptMasterEdition: isReceiptMasterEdition,
  };

  const transferReceiptNftAccounts = {
    userNft: userNftKey,
    universe: universeKey,
    authority: usersKey,
    vaultAuthority: vaultAuthorityKey,
    receiptMint: receiptMint,
    tokenMint: mintKey,
    userReceiptAta: userReceiptAta,
    vaultReceiptAta: vaultReceiptAta,
    receiptMetadata: receiptMetadataAddress,
    receiptMasterEdition: receiptMasterEditionAddress,
    tokenMetadataProgram: new PublicKey(programIds.metadata),
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  return {
    transferReceiptArgs,
    transferReceiptNftAccounts,
  };
};

const computeGroupedDepositNftParams = async ({
  usersKey,
  mintKey,
  universeKey,
  receiptUrl,
  isReceiptMasterEdition,
}) => {
  const [receiptMint, receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const [vaultReceiptAta, vaultReceiptAtaBump] = await findAssociatedAddress(
    vaultAuthorityKey,
    receiptMint
  );

  const [vaultAta, vaultAtaBump] = await findAssociatedAddress(
    vaultAuthorityKey,
    mintKey
  );

  const [receiptTokenAddress, receiptTokenBump] = await findReceiptTokenAddress(
    receiptMint
  );

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const [userReceiptAta, userReceiptAtaBump] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const [userNftMetadata, _] = await findMetadataAddress(mintKey);

  const [receiptMetadataAddress, _receiptMetadataBump] =
    await findMetadataAddress(receiptMint);

  const [receiptMasterEditionAddress, _receiptMasterEditionBump] =
    await findMasterEditionAddress(receiptMint);

  const vaultCreator = {
    address: vaultAuthorityKey,
    verified: true,
    share: 100,
  };

  const userCreator = {
    address: usersKey,
    verified: false,
    share: 0,
  };

  const creators = [];
  creators.push(vaultCreator);
  creators.push(userCreator);

  // args
  //init receipt Args
  const initReceiptMintArgs = {
    receiptMintBump: receiptMintBump,
    vaultBump: vaultAuthorityBump,
  };

  // init reposit args
  const initDepositNftArgs = {
    receiptMintBump: receiptMintBump,
    receiptTokenBump: receiptTokenBump,
    vaultBump: vaultAuthorityBump,
    vaultReceiptAtaBump: vaultReceiptAtaBump,
    userNftBump: userNftBump,
    associatedVaultBump: vaultAtaBump,
    userReceiptAtaBump: userReceiptAtaBump,
  };

  // deposit nft args
  const depositNftArgs = {
    userNftBump: userNftBump,
    vaultBump: vaultAuthorityBump,
    associatedBump: vaultAtaBump,
    receiptMintBump: receiptMintBump,
    receiptAtaBump: userReceiptAtaBump,
    receiptTokenBump: receiptTokenBump,
  };

  //transfer receipt args
  const transferReceiptNftArgs = {
    userNftBump: userNftBump,
    vaultBump: vaultAuthorityBump,
    receiptMintBump: receiptMintBump,
    uri: receiptUrl,
    creators: creators,
    name: "MetablocksReceiptNft",
    symbol: "mbk",
    sellerFeeBasisPoints: 0,
    isMutable: false,
    isReceiptMasterEdition: isReceiptMasterEdition,
  };

  //accounts
  // init receipt accounts
  const initReceiptMintAccounts = {
    universe: universeKey,
    authority: usersKey,
    vaultAuthority: vaultAuthorityKey,
    receiptMint: receiptMint,
    tokenMint: mintKey,
    tokenProgram: new PublicKey(programIds.token),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  //init depsoit Nft Accounts
  const initDepositNftAccounts = {
    userNft: userNftKey,
    universe: universeKey,
    authority: usersKey,
    vaultAuthority: vaultAuthorityKey,
    receiptMint: receiptMint,
    receiptToken: receiptTokenAddress,
    vaultReceiptAta: vaultReceiptAta,
    userReceiptAta: userReceiptAta,
    tokenMint: mintKey,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  // deposit Nft Accounts
  const depositNftAccounts = {
    userNft: userNftKey,
    vaultAuthority: vaultAuthorityKey,
    authority: usersKey,
    universe: universeKey,
    userNftAta: userNftKey,
    userNftMetadata: userNftMetadata,
    vaultNftAta: vaultAta,
    tokenMint: mintKey,
    receiptMint: receiptMint,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  // transfer receipt Nft Accounts
  const transferReceiptNftAccounts = {
    userNft: userNftKey,
    universe: universeKey,
    authority: usersKey,
    vaultAuthority: vaultAuthorityKey,
    receiptMint: receiptMint,
    tokenMint: mintKey,
    userReceiptAta: userReceiptAta,
    vaultReceiptAta: vaultReceiptAta,
    receiptMetadata: receiptMetadataAddress,
    receiptMasterEdition: receiptMasterEditionAddress,
    tokenMetadataProgram: new PublicKey(programIds.metadata),
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  return {
    initReceiptMint: {
      initReceiptMintArgs,
      initReceiptMintAccounts,
    },

    initDepositNft: {
      initDepositNftArgs,
      initDepositNftAccounts,
    },
    depositNft: {
      depositNftArgs,
      depositNftAccounts,
    },

    transferReceiptNft: {
      transferReceiptNftArgs,
      transferReceiptNftAccounts,
    },
  };
};

const computeWithdrawNftParams = async ({ usersKey, mintKey, universeKey }) => {
  const receiptMint = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  )[0];

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const userNftAta = await findAssociatedAddress(usersKey, mintKey)[0];
  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const vaultNftAta = await findAssociatedAddress(
    vaultAuthorityKey,
    mintKey
  )[0];

  const vaultReceiptAta = await findAssociatedAddress(
    vaultAuthorityKey,
    receiptMint
  )[0];

  const userReceiptAta = await findAssociatedAddress(usersKey, receiptMint)[0];

  const withdrawNftArgs = {
    userNftBump: userNftBump,
    vaultAuthorityBump: vaultAuthorityBump,
  };
  const withdrawNftAccounts = {
    userNft: userNftKey,
    vaultAuthority: vaultAuthorityKey,
    authority: usersKey,
    universe: universeKey,
    userNftAta: userNftAta, // recipientKey,
    vaultNftAta: vaultNftAta,
    tokenMint: mintKey,
    receiptMint: receiptMint,
    userReceiptAta: userReceiptAta,
    vaultReceiptAta: vaultReceiptAta,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  return {
    withdrawNftArgs,
    withdrawNftAccounts,
  };
};

export {
  computeCreateUniverseParams,
  computeUpdateUniverseParams,
  computeInitReceiptMintParams,
  computeInitDepositNftParams,
  computeDepositNftParams,
  computeTransferReceiptNftParams,
  computeGroupedDepositNftParams,
  computeWithdrawNftParams,
};
