import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, { addSols, CLUSTER_URL } from './utils/utils';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api, pda } from '../src';
import {
  NftCreator,
  MintCollectionNftApiArgs,
  MintRegularNftApiArgs,
  UpdateCollectionNftApiArgs,
} from '../src/types/types';
import nacl from 'tweetnacl';
import { getSafePdaKeys, SafePdaKeys } from '../src/pda';

describe('Update Collection NFT', () => {
  const creatorKeypair = anchor.web3.Keypair.generate();
  const creatorWallet = new NodeWallet(creatorKeypair);

  const anotherKeypair = Keypair.generate();
  const anotherWallet = new NodeWallet(anotherKeypair);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getNftMinterProgram(connection, creatorWallet);

  beforeAll(async () => {
    await addSols(
      program.provider,
      creatorWallet.publicKey,
      1 * LAMPORTS_PER_SOL
    );

    await addSols(
      program.provider,
      anotherWallet.publicKey,
      1 * LAMPORTS_PER_SOL
    );
  });

  it('Should update a Collection NFT', async () => {
    try {
      await mintTestRegularNft(creatorWallet, connection);

      await mintCollectionNft(
        anotherWallet,
        creatorKeypair,
        creatorWallet,
        program,
        connection
      );

      const nftCreator: NftCreator = {
        address: creatorWallet.publicKey,
        share: 100,
      };
      const creators: Array<NftCreator> = [];
      creators.push(nftCreator);

      const pdaKeys: SafePdaKeys = await getSafePdaKeys(
        creatorWallet.publicKey,
        1
      );

      const collectionPdaKeys: SafePdaKeys = await getSafePdaKeys(
        creatorWallet.publicKey,
        2
      );

      const args: UpdateCollectionNftApiArgs = {
        connection: connection,
        wallet: creatorWallet,
        mintName: 'COL NAME',
        mintSymbol: 'CSYML',
        mintUri: 'Updated collection mint uri',
        isPrimarySaleHappened: false,
        sellerBasisPoints: 1000,
        isMutable: true,
        creators: creators,
        parentNftAdminAddress: creatorWallet.publicKey,
        oldParentNftMintAddress: pdaKeys.mintAddress,
        newParentNftMintAddress: pdaKeys.mintAddress,
        collectionMintAddress: collectionPdaKeys.mintAddress,
      };

      const tx = await api.updateCollectionNft(args);

      console.log(tx);
    } catch (err) {
      console.log(err);
    }
  });

  it('Another collection mint key update Collection NFT', async () => {
    try {
      await mintTestRegularNft(creatorWallet, connection);

      const nftCreator: NftCreator = {
        address: creatorWallet.publicKey,
        share: 100,
      };
      const creators: Array<NftCreator> = [];
      creators.push(nftCreator);

      // const nftData = await program.account.

      const pdaKeys: SafePdaKeys = await getSafePdaKeys(
        creatorWallet.publicKey,
        1
      );

      const collectionPdaKeys: SafePdaKeys = await getSafePdaKeys(
        creatorWallet.publicKey,
        2
      );

      const anotherPdaKeys: SafePdaKeys = await getSafePdaKeys(
        creatorWallet.publicKey, // the creator has to be same for updating with new collection mint address
        3
      );

      const args: UpdateCollectionNftApiArgs = {
        connection: connection,
        wallet: creatorWallet,
        mintName: 'COL NAME',
        mintSymbol: 'CSYML',
        mintUri: 'Updated collection mint uri',
        isPrimarySaleHappened: false,
        sellerBasisPoints: 1000,
        isMutable: true,
        creators: creators,
        parentNftAdminAddress: creatorWallet.publicKey,
        oldParentNftMintAddress: pdaKeys.mintAddress,
        newParentNftMintAddress: anotherPdaKeys.mintAddress,
        collectionMintAddress: collectionPdaKeys.mintAddress,
      };

      const tx = await api.updateCollectionNft(args);

      console.log(tx);
    } catch (err) {
      console.log(err);
    }
  });
});
async function mintCollectionNft(
  anotherWallet: NodeWallet,
  creatorKeypair: anchor.web3.Keypair,
  creatorWallet: NodeWallet,
  program: anchor.Program<any>,
  connection: anchor.web3.Connection
) {
  const testMessage = anotherWallet.publicKey.toBytes();
  const signature = nacl.sign.detached(testMessage, creatorKeypair.secretKey);
  const [nftSafeAddress, _] = await pda.findNftSafeAddress(
    creatorWallet.publicKey
  );
  const adminNftSafeData = await program.account.nftSafe.fetch(nftSafeAddress);

  const mintAddress = adminNftSafeData.parentMints[0].mint;
  const nftCreator: NftCreator = {
    address: creatorWallet.publicKey,
    share: 100,
  };
  const creators: Array<NftCreator> = [];
  creators.push(nftCreator);

  // transfer to another wallett!!
  const args2: MintCollectionNftApiArgs = {
    connection: connection,
    wallet: anotherWallet,
    receiverAddress: anotherWallet.publicKey,
    mintName: 'Test Mint',
    mintSymbol: 'TEST',
    isPrimarySaleHappened: false,
    sellerBasisPoints: 10000,
    isMutable: null,
    creators: null,
    isMasterEdition: true,
    isParentNft: false,
    mintUri: 'http://mint.uri.com',
    nftCollectionAdmin: creatorKeypair.publicKey,
    nftCollectionMintAddress: mintAddress,
    signature: signature,
    message: testMessage,
  };
  const tx2 = await api.mintCollectionNft(args2);
  console.log('The transaction is ', tx2);
}

async function mintTestRegularNft(
  creatorWallet: NodeWallet,
  connection: anchor.web3.Connection
) {
  try {
    try {
      const tx = await api.initializeNftSafe({
        wallet: creatorWallet,
        connection: connection,
      });
      console.log('Create Init Safe', tx);
    } catch (err) {
      console.log('already initialized');
    }

    const nftCreator: NftCreator = {
      address: creatorWallet.publicKey,
      share: 100,
    };
    const creators: Array<NftCreator> = [];
    creators.push(nftCreator);

    const args1: MintRegularNftApiArgs = {
      connection: connection,
      wallet: creatorWallet,
      mintName: 'Test Mint',
      mintSymbol: 'TEST',
      isMasterEdition: true,
      isParentNft: true,
      mintUri: 'http://mint.uri.com',
      receiverAddress: creatorWallet.publicKey,
      creators: creators,
      sellerBasisPoints: 1000,
      isMutable: null,
    };
    const tx1 = await api.mintRegularNft(args1);
    console.log('The transaction is ', tx1);
  } catch (err) {
    console.log('already Existing');
  }
}
