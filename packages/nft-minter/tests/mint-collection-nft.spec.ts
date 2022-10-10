import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, { addSols, CLUSTER_URL } from './utils/utils';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api, pda } from '../src';
import {
  MintCollectionNftApiArgs,
  MintRegularNftApiArgs,
} from '../src/types/types';
import nacl from 'tweetnacl';

describe('MINT Colleciton NFT', () => {
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

        const args1: MintRegularNftApiArgs = {
          connection: connection,
          wallet: creatorWallet,
          mintName: 'Test Mint',
          mintSymbol: 'TEST',
          isMasterEdition: true,
          isParentNft: true, // is this nft mint a parent mint for other mints ?
          mintUri: 'http://mint.uri.com',
          receiverAddress: creatorWallet.publicKey,
        };
        const tx1 = await api.mintRegularNft(args1);
        console.log('The transaction is ', tx1);
      } catch (err) {
        console.log('already Existing');
      }

      const testMessage = creatorKeypair.publicKey.toBytes();
      const signature = nacl.sign.detached(
        testMessage,
        creatorKeypair.secretKey
      );

      const [nftSafeAddress, _] = await pda.findNftSafeAddress(
        creatorWallet.publicKey
      );

      const adminNftSafeData = await program.account.nftSafe.fetch(
        nftSafeAddress
      );

      const mintAddress = adminNftSafeData.parentMints[0].mint;
      //console.log(adminNftSafeData.parentMints[0].nftCount);

      //console.log(mintAddress);
      // transfer to another wallett!!
      const args2: MintCollectionNftApiArgs = {
        connection: connection,
        wallet: anotherWallet,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isMasterEdition: true,
        isParentNft: false, // is this nft mint a parent mint for other mints ?
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
