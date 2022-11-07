import { ComputeBudgetProgram, Transaction } from '@solana/web3.js';
import { getNftMinterProgram } from './factory';
import { getInitNftSafeInstruction } from './instructions/init-nft-safe';
import { getInitializeNftMinterInstruction } from './instructions/initialize-nft-minter';
import {
  getMintCollectionNftInstruction,
  getMintRegularNftInstruction,
} from './instructions/mint-safe-nfts';
import {
  getEdInstruction,
  getMintSignedCollectionNftInstruction,
  getMintSignedNftInstruction,
} from './instructions/mint-signed-nfts';

import {
  findNftSafeAddress,
  getPdaKeys,
  getSafePdaKeys,
  PdaKeys,
  SafePdaKeys,
} from './pda';
import {
  InitializeNftMinterApiArgs,
  InitializeNftSafeApiArgs,
  IntializeNftMinterArgs,
  MintCollectionNftApiArgs,
  MintRegularNftApiArgs,
  MintSignedCollectionNftApiArgs,
  MintSignedCollectionNftArgs,
  MintSignedNftApiArgs,
  MintSignedNftArgs,
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

const mintSignedNft = async (args: MintSignedNftApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;
    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const argument: MintSignedNftArgs = {
      signature: args.signature,
      message: args.message,
      mintName: args.mintName,
      mintUri: args.mintUri,
      mintSymbol: args.mintSymbol,
      isMasterEdition: args.isMasterEdition,
      isParentForNfts: args.isParentForNfts,
      pdaKeys: pdaKeys,
      program: program,
      claimantAddress: usersKey,
    };

    const instruction = await getMintSignedNftInstruction(argument);
    const edInstruction = getEdInstruction({
      message: args.message,
      authorityAddress: args.authorityAddress,
      signature: args.signature,
    });

    const tranasction = new Transaction();
    tranasction.add(edInstruction);
    tranasction.add(instruction);
    const tx = await program.provider.sendAndConfirm!(tranasction, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

const mintSignedCollectionNft = async (
  args: MintSignedCollectionNftApiArgs
) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const argument: MintSignedCollectionNftArgs = {
      signature: args.signature,
      message: args.message,
      mintName: args.mintName,
      mintUri: args.mintUri,
      mintSymbol: args.mintSymbol,
      isMasterEdition: args.isMasterEdition,
      isParentForNfts: args.isParentForNfts,
      pdaKeys: pdaKeys,
      program: program,
      claimantAddress: usersKey,
      nftCollectionMintAddress: args.collectionMintAddress,
    };

    const instruction = await getMintSignedCollectionNftInstruction(argument);

    const edInstruction = getEdInstruction({
      message: args.message,
      authorityAddress: args.authorityAddress,
      signature: args.signature,
    });

    const transaction = new Transaction();
    transaction.add(edInstruction);
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
    console.log(parentNftCount);

    const adminPdaKeys: SafePdaKeys = await getSafePdaKeys(
      args.nftCollectionAdmin,
      parentNftCount - 1 // nft parent nft nft count // this has to be -1 count to be changed in future
    );

    // console.log(parentNftCount);

    const pdaKeys: SafePdaKeys = await getSafePdaKeys(
      args.nftCollectionAdmin,
      adminNftSafeData.nftCount // should be latest nft count
    );

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
      nftCollectionMint: adminPdaKeys.mintAddress,
      nftCollectionMasterEdition: adminPdaKeys.mintMasterEditionAddress,
      nftCollectionMetadata: adminPdaKeys.mintMetadataAddress,
      nftCollectionMetadataBump: adminPdaKeys.mintMetadataBump,
      nftCollectionMasterEditionBump: adminPdaKeys.mintMasterEditionBump,
      nftCollectionAdmin: args.nftCollectionAdmin,
      message: args.message != null ? args.message : null,
      signature: args.signature != null ? args.signature : null,
    });

    console.log('The pdaKeys ');

    console.log({
      mintAddress: pdaKeys.mintAddress.toString(),
      mintMasterEditionAddress: pdaKeys.mintMasterEditionAddress.toString(),
      mintMetadataAddress: pdaKeys.mintMetadataAddress.toString(),
      payerMintAta: pdaKeys.payerMintAta.toString(),
      nftSafeAddress: pdaKeys.nftSafeAddress.toString(),
      mintMasterEditionBump: pdaKeys.mintMasterEditionBump.toString(),
      mintMetadataBump: pdaKeys.mintMetadataBump.toString(),
    });

    console.log({
      receiverAddress: args.receiverAddress.toString(),
      payerAddress: usersKey.publicKey.toString(),
      isParentNft: args.isParentNft,
      isMasterEdition: args.isMasterEdition,
      mintUri: args.mintUri,
      mintSymbol: args.mintSymbol,
      mintName: args.mintName,
      nftCollectionMint: adminPdaKeys.mintAddress.toString(),
      nftCollectionMasterEdition:
        adminPdaKeys.mintMasterEditionAddress.toString(),
      nftCollectionMetadata: adminPdaKeys.mintMetadataAddress.toString(),
      nftCollectionMetadataBump: adminPdaKeys.mintMetadataBump.toString(),
      nftCollectionMasterEditionBump:
        adminPdaKeys.mintMasterEditionBump.toString(),
      nftCollectionAdmin: args.nftCollectionAdmin.toString(),
    });

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 350000,
    });
    const transaction = new Transaction();
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
  mintSignedNft,
  mintSignedCollectionNft,
  initializeNftSafe,
  mintRegularNft,
  mintCollectionNft,
};
