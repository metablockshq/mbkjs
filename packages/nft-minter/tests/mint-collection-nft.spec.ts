import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, { addSols, CLUSTER_URL } from './utils/utils';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api, pda } from '../src';
import {
  NftCreator,
  MintCollectionNftApiArgs,
  MintRegularNftApiArgs,
} from '../src/types/types';
import nacl from 'tweetnacl';

describe('MINT Collection NFT', () => {
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

  it('Should create a Collection NFT', async () => {
    try {
      try {
        const tx = await api.initializeNftSafe({
          wallet: creatorWallet,
          connection: connection,
        });

        console.log('Create Init Safe', tx);

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
          isParentNft: true, // Check if this is for minting parent nft
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

      const testMessage = anotherWallet.publicKey.toBytes();
      const signature = nacl.sign.detached(
        testMessage,
        creatorKeypair.secretKey
      );

      const [nftSafeAddress, _] = await pda.findNftSafeAddress(
        creatorWallet.publicKey,
        program
      );

      const adminNftSafeData = await program.account.nftSafe.fetch(
        nftSafeAddress
      );

      const mintAddress = adminNftSafeData.parentMints[0].mint;
      //console.log(adminNftSafeData.parentMints[0].nftCount);

      const nftCreator: NftCreator = {
        address: creatorWallet.publicKey,
        share: 100,
      };
      const creators: Array<NftCreator> = [];
      creators.push(nftCreator);

      //console.log(mintAddress);
      // transfer to another wallett!!
      const args2: MintCollectionNftApiArgs = {
        connection: connection,
        wallet: anotherWallet,
        receiverAddress: anotherWallet.publicKey,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isPrimarySaleHappened: false,
        sellerBasisPoints: 10000,
        isMutable: null, // optional if set to false, cannot be set back to true
        creators: null, // optional
        isMasterEdition: true,
        isParentNft: false, // Check if this is for minting parent nft
        mintUri: 'http://mint.uri.com',
        nftCollectionAdmin: creatorKeypair.publicKey,
        nftCollectionMintAddress: mintAddress,
        signature: signature,
        message: testMessage,
      };

      const tx2 = await api.mintCollectionNft(args2);
      console.log('The transaction is ', tx2);
    } catch (err) {
      console.log(err);
    }
  });
});
