import * as anchor from '@project-serum/anchor';
import { programIds } from '../factory';
import {
  CreateMetaNftArgs,
  DepositNftArgs,
  InitMetaBlocksAuthorityArgs,
  InitMetaNftArgs,
  InitReceiptMintArgs,
} from '../types';

/**
 * This is where accounts are initialized
 * @param args  deposit args
 * @returns  deposit instruction
 */
export const getDepositNftInstruction = async (args: DepositNftArgs) => {
  const vaultCreator = {
    address: args.pdaKeys.vaultKey,
    verified: true,
    share: 100,
  };

  const userCreator = {
    address: args.usersKey,
    verified: false,
    share: 0,
  };

  const creators = [];
  creators.push(vaultCreator);
  creators.push(userCreator);

  let isMetaDataInitialized = false;

  const receiptMetadataKeyData =
    await args.program.provider.connection.getAccountInfo(
      args.pdaKeys.receiptMetadataKey,
      'confirmed'
    );

  if (receiptMetadataKeyData !== null) {
    isMetaDataInitialized = true;
  }

  //transfer nft to user instruction
  const depositNftArgs = {
    uri: args.uri,
    creators: creators,
    name: args.name,
    symbol: 'mbkr',
    sellerFeeBasisPoints: 3,
    isMutable: false,
    isReceiptMasterEdition: args.isReceiptMasterEdition,
    isMetaDataInitialized: isMetaDataInitialized,
  };

  return await args.program.methods
    .depositNftV1(depositNftArgs)
    .accounts({
      wrappedUserNft: args.pdaKeys.wrappedUserNft,
      universe: args.pdaKeys.universeKey,
      authority: args.usersKey,
      vault: args.pdaKeys.vaultKey,
      receiptMint: args.pdaKeys.receiptMint,
      vaultReceiptAta: args.pdaKeys.vaultReceiptAta,
      userReceiptAta: args.pdaKeys.userReceiptAta,
      tokenMint: args.pdaKeys.mint,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
      metaNftProgram: programIds.META_NFT_PROGRAM_ID,
      metaNft: args.pdaKeys.metaNft,
      vaultNftAta: args.pdaKeys.vaultNftAta,
      userNftAta: args.pdaKeys.userNftAta,
      userNftMetadata: args.pdaKeys.userNftMetadataKey,
      treasury: args.pdaKeys.treasuryAddress,
      treasuryAuthority: args.treasuryAuthority,
      receiptMetadata: args.pdaKeys.receiptMetadataKey,
      receiptMasterEdition: args.pdaKeys.receiptMasterEditionKey,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
    })
    .instruction();
};

/**
 * Here receipt mint is created if it is not existing
 * @param args init receipt args
 * @returns init receipt instruction
 */
export const getInitReceiptInstruction = async (args: InitReceiptMintArgs) => {
  const initReceiptMintArgs = {};

  return await args.program.methods
    .initReceiptMintV1(initReceiptMintArgs)
    .accounts({
      universe: args.pdaKeys.universeKey,
      authority: args.usersKey,
      vault: args.pdaKeys.vaultKey,
      receiptMint: args.pdaKeys.receiptMint,
      tokenMint: args.pdaKeys.mint,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      treasury: args.pdaKeys.treasuryAddress,
      treasuryAuthority: args.treasuryAuthority,
    })
    .instruction();
};

/**
 * This creates meta nft accounts
 * @param args Meta Nft args
 * @returns Meta Nft create instruction
 */
export const getCreateCpiMetaNftInstruction = async (
  args: CreateMetaNftArgs
) => {
  const vaultCreator = {
    address: args.pdaKeys.metaBlocksAuthority,
    verified: false,
    share: 100,
  };

  const userCreator = {
    address: args.usersKey,
    verified: true,
    share: 0,
  };

  const creators = [];
  creators.push(vaultCreator);
  creators.push(userCreator);

  let isMetaDataInitialized = false;

  const metaNftMetadataAddressData =
    await args.program.provider.connection.getAccountInfo(
      args.pdaKeys.metaNftMetadataAddress,
      'confirmed'
    );

  if (metaNftMetadataAddressData !== null) {
    isMetaDataInitialized = true;
  }

  const createMetaNftArgs = {
    uri: args.uri,
    creators: creators,
    name: args.name,
    symbol: 'mbkr',
    sellerFeeBasisPoints: 3,
    isMutable: false,
    isMetaNftMasterEdition: false,
    isMetaDataInitialized: isMetaDataInitialized,
  };

  return await args.program.methods
    .createCpiMetaNftV1(createMetaNftArgs)
    .accounts({
      metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
      metaNft: args.pdaKeys.metaNft,
      userMetaNftAta: args.pdaKeys.userMetaNftAta,
      metaNftMint: args.pdaKeys.metaNftMint,
      payer: args.usersKey,
      metaNftMetadata: args.pdaKeys.metaNftMetadataAddress,
      metaNftMasterEdition: args.pdaKeys.metaNftMasterEditionAddress,
      metaNftProgram: programIds.META_NFT_PROGRAM_ID,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
    })
    .instruction();
};

/**
 * This initializes meta nft mint
 * @param args init meta nft
 * @returns init meta nft instruction
 */
export const getInitCpiMetaNftInstruction = async (args: InitMetaNftArgs) => {
  const initMetaNftArgs = {};

  return await args.program.methods
    .initCpiMetaNftV1(initMetaNftArgs)
    .accounts({
      metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
      metaNft: args.pdaKeys.metaNft,
      metaNftMint: args.pdaKeys.metaNftMint,
      payer: args.usersKey,
      universe: args.pdaKeys.universeKey,
      metaNftProgram: programIds.META_NFT_PROGRAM_ID,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      treasury: args.pdaKeys.treasuryAddress,
      treasuryAuthority: args.treasuryAuthority,
    })
    .instruction();
};

export const getInitMetaBlocksAuthorityInstruction = async (
  args: InitMetaBlocksAuthorityArgs
) => {
  return await args.program.methods
    .initMetaBlocksAuthorityV1({})
    .accounts({
      metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
      payer: args.usersKey,
      universe: args.pdaKeys.universeKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction();
};
