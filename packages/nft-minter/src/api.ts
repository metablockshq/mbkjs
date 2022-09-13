import { Transaction } from '@solana/web3.js';
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
  MintCollectionNftArgs,
  MintNftArgs,
  MintNftWithCollectionArgs,
  MintRegularNftArgs,
  MintSignedCollectionNftApiArgs,
  MintSignedNftApiArgs,
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

    const argument: MintRegularNftArgs = {
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

    const instruction = await getMintRegularNftInstruction(argument);
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

    const argument: MintCollectionNftArgs = {
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

    const instruction = await getMintCollectionNftInstruction(argument);

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
      isParentForNfts: args.isParentForNfts,
      program: program,
      claimantAddress: usersKey,
      pdaKeys: pdaKeys,
    };

    const mintNftInstruction = await getMintNftInstuction(argument);

    const tranasction = new Transaction();
    tranasction.add(createMintInstruction);
    tranasction.add(mintNftInstruction);
    const tx = await program.provider.sendAndConfirm!(tranasction, []);

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
      isParentForNfts: args.isParentForNfts,
      program: program,
      claimantAddress: usersKey,
      pdaKeys: pdaKeys,
      nftCollectionMintAddress: args.collectionMintAddress,
    };

    const mintNftInstruction = await getMintNftWithCollectionInstuction(
      argument
    );

    const tranasction = new Transaction();
    tranasction.add(createMintInstruction);
    tranasction.add(mintNftInstruction);
    const tx = await program.provider.sendAndConfirm!(tranasction, []);

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
