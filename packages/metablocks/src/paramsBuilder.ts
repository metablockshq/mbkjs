import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { programIds } from './factory';
import {
  findUniverseAddress,
  findUserNftAddress,
  findAssociatedAddress,
  findVaultAuthorityAddress,
  findReceiptMintAddress,
  findReceiptTokenAddress,
  findMetadataAddress,
  findMasterEditionAddress,
} from './pda';
import {
  DepositNftParamsArgs,
  GroupedDepositNftParamsArgs,
  InitDepositNftParamsArgs,
  InitReceiptMintParamArgs,
  TransferReceiptNftParamArgs,
  UniverseParamArgs,
  WithdrawNftParamsArgs,
} from './types/types';

// compute Create universe params
const computeCreateUniverseParams = async (args: UniverseParamArgs) => {
  const [universeKey, universeBump] = await findUniverseAddress(args.usersKey);

  const createUniverseArgs = {
    bump: universeBump,
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  };

  const accounts = {
    universe: universeKey,
    payer: args.usersKey,
    universeAuthority: args.usersKey,
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
}: UniverseParamArgs) => {
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
}: InitReceiptMintParamArgs) => {
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
}: InitDepositNftParamsArgs) => {
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

  const [_, vaultAtaBump] = await findAssociatedAddress(
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

const computeDepositNftParams = async ({
  usersKey,
  mintKey,
  universeKey,
}: DepositNftParamsArgs) => {
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

  const [_, receiptTokenBump] = await findReceiptTokenAddress(receiptMint);

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const [_u, userReceiptAtaBump] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const [userNftMetadata, _b] = await findMetadataAddress(mintKey);

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
}: TransferReceiptNftParamArgs) => {
  const [receiptMint, receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const [vaultReceiptAta, _] = await findAssociatedAddress(
    vaultAuthorityKey,
    receiptMint
  );

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const [userReceiptAta, _u] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const [receiptMetadataAddress, _r] = await findMetadataAddress(receiptMint);

  const [receiptMasterEditionAddress, _rr] = await findMasterEditionAddress(
    receiptMint
  );

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
    name: 'MetablocksReceiptNft',
    symbol: 'mbk',
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
    transferReceiptNftArgs,
    transferReceiptNftAccounts,
  };
};

const computeGroupedDepositNftParams = async ({
  usersKey,
  mintKey,
  universeKey,
  url,
  isReceiptMasterEdition,
}: GroupedDepositNftParamsArgs) => {
  const [receiptMint, receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [userNftAta, _u] = await findAssociatedAddress(usersKey, mintKey);

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

  // deposit nft args
  const depositNftArgs = {
    userNftBump: userNftBump,
    vaultBump: vaultAuthorityBump,
    associatedBump: vaultAtaBump,
    receiptMintBump: receiptMintBump,
    receiptAtaBump: userReceiptAtaBump,
    receiptTokenBump: receiptTokenBump,
  };

  // deposit Nft Accounts
  const depositNftAccounts = {
    userNft: userNftKey,
    vaultAuthority: vaultAuthorityKey,
    authority: usersKey,
    universe: universeKey,
    userNftAta: userNftAta,
    userNftMetadata: userNftMetadata,
    vaultNftAta: vaultAta,
    tokenMint: mintKey,
    receiptMint: receiptMint,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  //transfer receipt args
  const transferReceiptNftArgs = {
    userNftBump: userNftBump,
    vaultBump: vaultAuthorityBump,
    receiptMintBump: receiptMintBump,
    uri: url,
    creators: creators,
    name: 'MetablocksReceiptNft',
    symbol: 'mbk',
    sellerFeeBasisPoints: 0,
    isMutable: false,
    isReceiptMasterEdition: isReceiptMasterEdition,
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

const computeWithdrawNftParams = async ({
  usersKey,
  mintKey,
  universeKey,
}: WithdrawNftParamsArgs) => {
  const [receiptMint, _] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [userNftKey, userNftBump] = await findUserNftAddress(
    usersKey,
    receiptMint
  );

  const [userNftAta, _u] = await findAssociatedAddress(usersKey, mintKey);
  const [vaultAuthorityKey, vaultAuthorityBump] =
    await findVaultAuthorityAddress(universeKey, usersKey, receiptMint);

  const [vaultNftAta, _v] = await findAssociatedAddress(
    vaultAuthorityKey,
    mintKey
  );

  const [vaultReceiptAta, _vr] = await findAssociatedAddress(
    vaultAuthorityKey,
    receiptMint
  );

  const [userReceiptAta, _ur] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const withdrawNftArgs = {
    userNftBump: userNftBump,
    vaultBump: vaultAuthorityBump,
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
