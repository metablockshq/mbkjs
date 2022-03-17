import * as anchor from '@project-serum/anchor';
import { programIds } from '../factory';
import {
  CreateMetaNftArgs,
  DepositArgs,
  InitDepositNftArgs,
  InitMetaBlocksAuthorityArgs,
  InitMetaNftArgs,
  InitReceiptMintArgs,
  TransferReceiptNftArgs,
  UpdateReceiptMetadataArgs,
} from '../types';

/**
 * Here receipt nft is transferred to user , a part of deposit Instruction
 * @param args Transfer Receipt Args
 * @returns Transfer Receipt Instruction
 */
export const getTransferReceiptNftInstruction = async (
  args: TransferReceiptNftArgs
) => {
  //transfer nft to user instruction
  const transferReceiptNftArgs = {};

  return args.program.instruction.transferReceiptNftToUserV1(
    transferReceiptNftArgs,
    {
      accounts: {
        wrappedUserNft: args.pdaKeys.wrappedUserNft,
        universe: args.pdaKeys.universeKey,
        authority: args.usersKey,
        vault: args.pdaKeys.vaultKey,
        receiptMint: args.pdaKeys.receiptMint,
        tokenMint: args.pdaKeys.mint,
        userReceiptAta: args.pdaKeys.userReceiptAta,
        vaultReceiptAta: args.pdaKeys.vaultReceiptAta,
        tokenProgram: programIds.TOKEN_PROGRAM_ID,
        associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    }
  );
};
/**
 *  Here Receipt nft Metadata is updated. this is a part of deposit instruction
 * @param args Update Metadata
 * @returns instruction
 */
export const getUpdateReceiptMetadataInstruction = async (
  args: UpdateReceiptMetadataArgs
) => {
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
  const updateReceiptMetadataArgs = {
    uri: args.uri,
    creators: creators,
    name: args.name,
    symbol: 'mbkr',
    sellerFeeBasisPoints: 3,
    isMutable: false,
    isReceiptMasterEdition: args.isReceiptMasterEdition,
    isMetaDataInitialized: isMetaDataInitialized,
  };

  return args.program.instruction.updateReceiptMetadataV1(
    updateReceiptMetadataArgs,
    {
      accounts: {
        wrappedUserNft: args.pdaKeys.wrappedUserNft,
        universe: args.pdaKeys.universeKey,
        authority: args.usersKey,
        vault: args.pdaKeys.vaultKey,
        receiptMint: args.pdaKeys.receiptMint,
        tokenMint: args.pdaKeys.mint,
        receiptMetadata: args.pdaKeys.receiptMetadataKey,
        receiptMasterEdition: args.pdaKeys.receiptMasterEditionKey,
        tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: programIds.TOKEN_PROGRAM_ID,
        associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    }
  );
};
/**
 * This is where user nfts are transferred to meta blocks program.
 * This is a part of deposit functionality
 * @param args Deposit Args
 * @returns Deposit Instruction
 */
export const getDepositNftInstruction = (args: DepositArgs) => {
  const argument = {};

  return args.program.instruction.depositNftV1(argument, {
    accounts: {
      wrappedUserNft: args.pdaKeys.wrappedUserNft,
      vault: args.pdaKeys.vaultKey,
      authority: args.usersKey,
      universe: args.pdaKeys.universeKey,
      userNftAta: args.pdaKeys.userNftAta,
      userNftMetadata: args.pdaKeys.userNftMetadataKey,
      vaultNftAta: args.pdaKeys.vaultNftAta,
      tokenMint: args.pdaKeys.mint,
      receiptMint: args.pdaKeys.receiptMint,
      metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
      metaNft: args.pdaKeys.metaNft,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      metaNftProgram: programIds.META_NFT_PROGRAM_ID,
    },
  });
};
/**
 * This is where accounts are initialized
 * @param args Init deposit args
 * @returns init deposit instruction
 */
export const getInitDepositInstruction = (args: InitDepositNftArgs) => {
  const initDepositNftArgs = {};

  return args.program.instruction.initDepositNftV1(initDepositNftArgs, {
    accounts: {
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
    },
  });
};

/**
 * Here receipt mint is created if it is not existing
 * @param args init receipt args
 * @returns init receipt instruction
 */
export const getInitReceiptInstruction = (args: InitReceiptMintArgs) => {
  const initReceiptMintArgs = {};

  return args.program.instruction.initReceiptMintV1(initReceiptMintArgs, {
    accounts: {
      universe: args.pdaKeys.universeKey,
      authority: args.usersKey,
      vault: args.pdaKeys.vaultKey,
      receiptMint: args.pdaKeys.receiptMint,
      tokenMint: args.pdaKeys.mint,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
  });
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

  return args.program.instruction.createCpiMetaNftV1(createMetaNftArgs, {
    accounts: {
      metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
      metaNft: args.pdaKeys.metaNft,
      metaNftMintAta: args.pdaKeys.metaNftMintAta,
      metaNftMint: args.pdaKeys.metaNftMint,
      payer: args.usersKey,
      universe: args.pdaKeys.universeKey,
      metaNftMetadata: args.pdaKeys.metaNftMetadataAddress,
      metaNftMasterEdition: args.pdaKeys.metaNftMasterEditionAddress,
      metaNftProgram: programIds.META_NFT_PROGRAM_ID,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      associatedTokenProgram: programIds.ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: programIds.TOKEN_METADATA_PROGRAM_ID,
    },
  });
};

/**
 * This initializes meta nft mint
 * @param args init meta nft
 * @returns init meta nft instruction
 */
export const getInitCpiMetaNftInstruction = (args: InitMetaNftArgs) => {
  const initMetaNftArgs = {};

  return args.program.instruction.initCpiMetaNftV1(initMetaNftArgs, {
    accounts: {
      metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
      metaNft: args.pdaKeys.metaNft,
      metaNftMint: args.pdaKeys.metaNftMint,
      payer: args.usersKey,
      universe: args.pdaKeys.universeKey,
      metaNftProgram: programIds.META_NFT_PROGRAM_ID,
      tokenProgram: programIds.TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
  });
};

export const getInitMetaBlocksAuthorityInstruction = (
  args: InitMetaBlocksAuthorityArgs
) => {
  return args.program.instruction.initMetaBlocksAuthority(
    {},
    {
      accounts: {
        metaBlocksAuthority: args.pdaKeys.metaBlocksAuthority,
        payer: args.usersKey,
        universe: args.pdaKeys.universeKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    }
  );
};
