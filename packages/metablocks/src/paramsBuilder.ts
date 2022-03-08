import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { programIds } from './factory';
import {
  findUniverseAddress,
  findWrappedUserNftAddress,
  findAssociatedAddress,
  findVaultAddress,
  findReceiptMintAddress,
  findMetadataAddress,
  PdaKeys,
  getPdaKeys,
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
  const [universeKey, _universeBump] = await findUniverseAddress(args.usersKey);

  const createUniverseArgs = {
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  };

  const accounts = {
    universe: universeKey,
    authority: args.usersKey,
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
  };

  const accounts = {
    universe: universeKey,
    authority: usersKey,
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
  const [receiptMint, _] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultKey, _vaultAuthorityBump] = await findVaultAddress(
    universeKey,
    usersKey,
    receiptMint
  );

  const initReceiptMintArgs = {};
  const initReceiptMintAccounts = {
    universe: universeKey,
    authority: usersKey,
    vault: vaultKey,
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

  const [vaultAuthorityKey, _vaultAuthorityBump] = await findVaultAddress(
    universeKey,
    usersKey,
    receiptMint
  );

  const [vaultReceiptAta, _vaultReceiptAtaBump] = await findAssociatedAddress(
    vaultAuthorityKey,
    receiptMint
  );

  const [wrappedUserNft, _userNftBump] = await findWrappedUserNftAddress(
    usersKey,
    receiptMint
  );

  const [userReceiptAta, _userReceiptAtaBump] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const initDepositArgs = {};

  const initDepositAccounts = {
    wrappedUserNft: wrappedUserNft,
    universe: universeKey,
    authority: usersKey,
    vault: vaultAuthorityKey,
    receiptMint: receiptMint,
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
  const [receiptMint, _receiptMintBump] = await findReceiptMintAddress(
    universeKey,
    usersKey,
    mintKey
  );

  const [vaultKey, _vaultBump] = await findVaultAddress(
    universeKey,
    usersKey,
    receiptMint
  );

  const [vaultAta, _vaultAtaBump] = await findAssociatedAddress(
    vaultKey,
    mintKey
  );

  const [userNftKey, _userNftBump] = await findWrappedUserNftAddress(
    usersKey,
    receiptMint
  );

  const [_u, _userReceiptAtaBump] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const [userNftMetadata, _b] = await findMetadataAddress(mintKey);

  const depositNftArgs = {};

  const depositNftAccounts = {
    wrappedUserNft: userNftKey,
    vault: vaultKey,
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
  const pdaKeys: PdaKeys = await getPdaKeys(universeKey, usersKey, mintKey);

  const vaultCreator = {
    address: pdaKeys.vaultKey,
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
    uri: url,
    creators: creators,
    name: 'MetablocksReceiptNft',
    symbol: 'mbk',
    sellerFeeBasisPoints: 0,
    isMutable: false,
    isReceiptMasterEdition: isReceiptMasterEdition,
  };

  const transferReceiptNftAccounts = {
    wrappedUserNft: pdaKeys.wrappedUserNft,
    universe: universeKey,
    authority: usersKey,
    vault: pdaKeys.vaultKey,
    receiptMint: pdaKeys.receiptMint,
    tokenMint: mintKey,
    userReceiptAta: pdaKeys.userReceiptAta,
    vaultReceiptAta: pdaKeys.vaultReceiptAta,
    receiptMetadata: pdaKeys.receiptMetadataKey,
    receiptMasterEdition: pdaKeys.receiptMasterEditionKey,
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
  const pdaKeys: PdaKeys = await getPdaKeys(universeKey, usersKey, mintKey);

  const vaultCreator = {
    address: pdaKeys.vaultKey,
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
  const initReceiptMintArgs = {};

  // init receipt accounts
  const initReceiptMintAccounts = {
    universe: universeKey,
    authority: usersKey,
    vault: pdaKeys.vaultKey,
    receiptMint: pdaKeys.receiptMint,
    tokenMint: mintKey,
    tokenProgram: new PublicKey(programIds.token),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  // init reposit args
  const initDepositNftArgs = {};

  //init depsoit Nft Accounts
  const initDepositNftAccounts = {
    wrappedUserNft: pdaKeys.wrappedUserNft,
    universe: universeKey,
    authority: usersKey,
    vault: pdaKeys.vaultKey,
    receiptMint: pdaKeys.receiptMint,
    vaultReceiptAta: pdaKeys.vaultReceiptAta,
    userReceiptAta: pdaKeys.userReceiptAta,
    tokenMint: mintKey,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  // deposit nft args
  const depositNftArgs = {};

  // deposit Nft Accounts
  const depositNftAccounts = {
    wrappedUserNft: pdaKeys.wrappedUserNft,
    vault: pdaKeys.vaultKey,
    authority: usersKey,
    universe: universeKey,
    userNftAta: pdaKeys.userNftAta,
    userNftMetadata: pdaKeys.userNftMetadataKey,
    vaultNftAta: pdaKeys.vaultNftAta,
    tokenMint: mintKey,
    receiptMint: pdaKeys.receiptMint,
    tokenProgram: new PublicKey(programIds.token),
    associatedTokenProgram: new PublicKey(programIds.associatedToken),
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };

  //transfer receipt args
  const transferReceiptNftArgs = {
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
    wrappedUserNft: pdaKeys.wrappedUserNft,
    universe: universeKey,
    authority: usersKey,
    vault: pdaKeys.vaultKey,
    receiptMint: pdaKeys.receiptMint,
    tokenMint: mintKey,
    userReceiptAta: pdaKeys.userReceiptAta,
    vaultReceiptAta: pdaKeys.vaultReceiptAta,
    receiptMetadata: pdaKeys.receiptMetadataKey,
    receiptMasterEdition: pdaKeys.receiptMasterEditionKey,
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

  const [wrappedUserNftKey, _wrappedUserNftBump] =
    await findWrappedUserNftAddress(usersKey, receiptMint);

  const [userNftAta, _u] = await findAssociatedAddress(usersKey, mintKey);
  const [vaultKey, _vaultBump] = await findVaultAddress(
    universeKey,
    usersKey,
    receiptMint
  );

  const [vaultNftAta, _v] = await findAssociatedAddress(vaultKey, mintKey);

  const [vaultReceiptAta, _vr] = await findAssociatedAddress(
    vaultKey,
    receiptMint
  );

  const [userReceiptAta, _ur] = await findAssociatedAddress(
    usersKey,
    receiptMint
  );

  const withdrawNftArgs = {};
  const withdrawNftAccounts = {
    wrappedUserNft: wrappedUserNftKey,
    vault: vaultKey,
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
