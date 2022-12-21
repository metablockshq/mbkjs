import { ComputeBudgetProgram, Transaction } from '@solana/web3.js';
import { getNftMinterProgram } from './factory';
import { getInitNftSafeInstruction } from './instructions/init-nft-safe';
import { getInitializeNftMinterInstruction } from './instructions/initialize-nft-minter';
import {
  getEdInstruction,
  getMintCollectionNftInstruction,
  getMintRegularNftInstruction,
} from './instructions/mint-safe-nfts';

import { findNftSafeAddress, getSafePdaKeys, SafePdaKeys } from './pda';
import {
  Creator,
  InitializeNftMinterApiArgs,
  InitializeNftSafeApiArgs,
  IntializeNftMinterArgs,
  MintCollectionNftApiArgs,
  MintRegularNftApiArgs,
} from './types/types';

const initializeNftMinter = async (args: InitializeNftMinterApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const argument: IntializeNftMinterArgs = {
      authorityAddress: usersKey,
      program: program,
    };

    const instruction = await getInitializeNftMinterInstruction(argument);
    const transaction = new Transaction();
    transaction.add(instruction);
    const tx = await program.provider.sendAndConfirm!(transaction, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

// This has to be initialized for the user if not existing for minting NFTs
const initializeNftSafe = async (args: InitializeNftSafeApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const argument = {
      payerAddress: usersKey,
      program: program,
    };

    const instruction = await getInitNftSafeInstruction(argument);
    const transaction = new Transaction();
    transaction.add(instruction);
    const tx = await program.provider.sendAndConfirm!(transaction, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

const mintRegularNft = async (args: MintRegularNftApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const [nftSafeAddress, _] = await findNftSafeAddress(usersKey);

    let nftSafeData = null;

    try {
      nftSafeData = await program.account.nftSafe.fetch(nftSafeAddress);
    } catch (err) {
      console.log('Nft data does not exists');
      if (nftSafeData == null) {
        await initializeNftSafe({
          wallet: args.wallet,
          connection: args.connection,
        });

        nftSafeData = await program.account.nftSafe.fetch(nftSafeAddress);
      }
    }

    const pdaKeys: SafePdaKeys = await getSafePdaKeys(
      usersKey,
      nftSafeData.nftCount
    );

    let creators: Array<Creator> | null = null;
    if (args.creators != null) {
      creators = args.creators.map((creator) => {
        return {
          address: creator.address,
          share: creator.share,
          verified: false,
        };
      });
      creators.push({
        address: pdaKeys.nftSafeAddress,
        share: 0,
        verified: true,
      });
    }

    const argument = {
      pdaKeys: pdaKeys,
      program: program,
      receiverAddress: args.receiverAddress,
      payerAddress: usersKey,
      isParentNft: args.isParentNft,
      isMasterEdition: args.isMasterEdition,
      mintUri: args.mintUri,
      mintSymbol: args.mintSymbol,
      mintName: args.mintName,
      creators: creators,
      sellerBasisPoints: args.sellerBasisPoints,
      isMutable: args.isMutable,
    };

    const mintRegularNftInstruction = await getMintRegularNftInstruction(
      argument
    );
    const transaction = new Transaction();
    transaction.add(mintRegularNftInstruction);
    const tx = await program.provider.sendAndConfirm!(transaction, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

const mintCollectionNft = async (args: MintCollectionNftApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const [nftSafeAddress, _] = await findNftSafeAddress(
      args.nftCollectionAdmin
    );

    let adminNftSafeData = null;

    try {
      adminNftSafeData = await program.account.nftSafe.fetch(nftSafeAddress);
    } catch (err) {
      throw Error('There is no Regular NFT');
    }

    let parentNftCount = -1;

    for (let i = 0; i < adminNftSafeData.parentMints.length; i++) {
      if (
        adminNftSafeData.parentMints[i].mint.toString() ===
        args.nftCollectionMintAddress.toString()
      ) {
        parentNftCount = adminNftSafeData.parentMints[i].nftCount;
        break;
      }
    }
    //console.log('asdasdas');
    //console.log(parentNftCount);

    const adminPdaKeys: SafePdaKeys = await getSafePdaKeys(
      args.nftCollectionAdmin,
      parentNftCount - 1 // nft parent nft nft count // this has to be -1 count to be changed in future
    );

    // console.log(parentNftCount);

    const pdaKeys: SafePdaKeys = await getSafePdaKeys(
      args.nftCollectionAdmin,
      adminNftSafeData.nftCount // should be latest nft count
    );

    let creators: Array<Creator> | null = null;
    if (args.creators != null) {
      creators = args.creators.map((creator) => {
        return {
          address: creator.address,
          share: creator.share,
          verified: false,
        };
      });
      creators.push({
        address: pdaKeys.nftSafeAddress,
        share: 0,
        verified: true,
      });
    }

    const mintCollectionNftInstruction = await getMintCollectionNftInstruction({
      pdaKeys: pdaKeys,
      program: program,
      receiverAddress: args.receiverAddress,
      payerAddress: usersKey,
      isParentNft: args.isParentNft,
      isMasterEdition: args.isMasterEdition,
      mintUri: args.mintUri,
      mintSymbol: args.mintSymbol,
      mintName: args.mintName,
      isPrimarySaleHappened: args.isPrimarySaleHappened,
      sellerBasisPoints: args.sellerBasisPoints,
      isMutable: args.isMutable,
      creators: creators,
      nftCollectionMint: adminPdaKeys.mintAddress,
      nftCollectionMasterEdition: adminPdaKeys.mintMasterEditionAddress,
      nftCollectionMetadata: adminPdaKeys.mintMetadataAddress,
      nftCollectionMetadataBump: adminPdaKeys.mintMetadataBump,
      nftCollectionMasterEditionBump: adminPdaKeys.mintMasterEditionBump,
      nftCollectionAdmin: args.nftCollectionAdmin,
      message: args.message != null ? args.message : null,
      signature: args.signature != null ? args.signature : null,
    });

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 350000,
    });
    const transaction = new Transaction();

    if (args.message != null && args.signature != null) {
      const edInstruction = getEdInstruction({
        message: args.message,
        authorityAddress: args.nftCollectionAdmin,
        signature: args.signature,
      });
      transaction.add(edInstruction);
    }

    transaction.add(modifyComputeUnits);
    transaction.add(mintCollectionNftInstruction);
    const tx = await program.provider.sendAndConfirm!(transaction, []).catch(
      (err) => {
        console.log(err);

        throw err;
      }
    );

    return tx;
  } catch (e) {
    throw e;
  }
};

export {
  initializeNftMinter,
  initializeNftSafe,
  mintRegularNft,
  mintCollectionNft,
};
