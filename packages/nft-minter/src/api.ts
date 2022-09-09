import { PublicKey, Transaction } from '@solana/web3.js';
import { getNftMinterProgram } from './factory';
import { getInitializeNftMinterInstruction } from './instructions/initialize-nft-minter';
import {
  getEdInstruction,
  getMintCollectionNftInstruction,
  getMintRegularNftInstruction,
} from './instructions/mint-signed-nfts';
import {
  getCreateMintInstruction,
  getMintNftInstuction,
  getMintNftWithCollectionInstuction,
} from './instructions/mint-unsigned-nfts';
import { getPdaKeys, PdaKeys } from './pda';
import {
  CreateMintArgs,
  InitializeNftMinterApiArgs,
  IntializeNftMinterArgs,
  MintCollectionNftApiArgs,
  MintCollectionNftArgs,
  MintNftArgs,
  MintNftWithCollectionArgs,
  MintRegularNftApiArgs,
  MintRegularNftArgs,
  MintUnsignedCollectionNftApiArgs,
  MintUnsignedNftApiArgs,
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
    const tx = new Transaction();
    tx.add(instruction);
    await program.provider.sendAndConfirm!(tx, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

const mintSignedNft = async (args: MintRegularNftApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;
    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const argument: MintRegularNftArgs = {
      signature: args.signature,
      message: args.message,
      mintName: args.mintName,
      mintUri: args.mintUri,
      mintSymbol: args.mintSymbol,
      isMasterEdition: args.isMasterEdition,
      isNftForCollection: args.isNftForCollection,
      pdaKeys: pdaKeys,
      program: program,
      claimantAddress: usersKey,
    };

    const instruction = await getMintRegularNftInstruction(argument);
    const edInstruction = getEdInstruction({
      message: args.message,
      walletAddress: args.wallet.publicKey,
      signature: args.signature,
    });

    const tx = new Transaction();
    tx.add(edInstruction);
    tx.add(instruction);
    await program.provider.sendAndConfirm!(tx, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

const mintSignedCollectionNft = async (args: MintCollectionNftApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const argument: MintCollectionNftArgs = {
      signature: args.signature,
      message: args.message,
      mintName: args.mintName,
      mintUri: args.mintUri,
      mintSymbol: args.mintSymbol,
      isMasterEdition: args.isMasterEdition,
      isNftForCollection: args.isNftForCollection,
      pdaKeys: pdaKeys,
      program: program,
      claimantAddress: usersKey,
      nftCollectionMintAddress: args.collectionMintAddress,
    };

    const instruction = await getMintCollectionNftInstruction(argument);

    const edInstruction = getEdInstruction({
      message: args.message,
      walletAddress: args.wallet.publicKey,
      signature: args.signature,
    });

    const tx = new Transaction();
    tx.add(edInstruction);
    tx.add(instruction);
    await program.provider.sendAndConfirm!(tx, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

const mintUnsignedNft = async (args: MintUnsignedNftApiArgs) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const createMintArgument: CreateMintArgs = {
      program: program,
      claimantAddress: usersKey,
      pdaKeys: pdaKeys,
      uri: args.mintUri,
    };

    const createMintInstruction = await getCreateMintInstruction(
      createMintArgument
    );

    const argument: MintNftArgs = {
      mintName: args.mintName,
      mintSymbol: args.mintSymbol,
      isMasterEdition: args.isMasterEdition,
      isNftForCollection: args.isNftForCollection,
      program: program,
      claimantAddress: usersKey,
      pdaKeys: pdaKeys,
    };

    const mintNftInstruction = await getMintNftInstuction(argument);

    const tx = new Transaction();
    tx.add(createMintInstruction);
    tx.add(mintNftInstruction);
    await program.provider.sendAndConfirm!(tx, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

const mintUnsignedCollectionNft = async (
  args: MintUnsignedCollectionNftApiArgs
) => {
  try {
    const program = getNftMinterProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const createMintArgument: CreateMintArgs = {
      program: program,
      claimantAddress: usersKey,
      pdaKeys: pdaKeys,
      uri: args.mintUri,
    };

    const createMintInstruction = await getCreateMintInstruction(
      createMintArgument
    );

    const argument: MintNftWithCollectionArgs = {
      mintName: args.mintName,
      mintSymbol: args.mintSymbol,
      isMasterEdition: args.isMasterEdition,
      isNftForCollection: args.isNftForCollection,
      program: program,
      claimantAddress: usersKey,
      pdaKeys: pdaKeys,
      nftCollectionMintAddress: args.collectionMintAddress,
    };

    const mintNftInstruction = await getMintNftWithCollectionInstuction(
      argument
    );

    const tx = new Transaction();
    tx.add(createMintInstruction);
    tx.add(mintNftInstruction);
    await program.provider.sendAndConfirm!(tx, []);

    return tx;
  } catch (e) {
    throw e;
  }
};

export {
  initializeNftMinter,
  mintSignedNft,
  mintSignedCollectionNft,
  mintUnsignedNft,
  mintUnsignedCollectionNft,
};
