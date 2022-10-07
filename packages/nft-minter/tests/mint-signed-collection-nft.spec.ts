import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, {
  addSols,
  CLUSTER_URL,
  getTestAuthority,
} from './utils/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api, pda } from '../src';
import {
  MintRegularNftApiArgs,
  MintSignedCollectionNftApiArgs,
} from '../src/types/types';
import nacl from 'tweetnacl';

describe('MINT Unsigned Collection NFT', () => {
  const authority = getTestAuthority();
  const authorityWallet = new NodeWallet(authority);

  const claimantKeypair = anchor.web3.Keypair.generate();
  const claimantWallet = new NodeWallet(claimantKeypair);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getNftMinterProgram(connection, authorityWallet);

  beforeAll(async () => {
    await addSols(program.provider, authority.publicKey, 1 * LAMPORTS_PER_SOL);
    await addSols(
      program.provider,
      claimantKeypair.publicKey,
      1 * LAMPORTS_PER_SOL
    );
  });

  it('Should create an Signed Collection NFT', async () => {
    try {
      const [mintAddress, _2] = await pda.findMintAddress(
        authorityWallet.publicKey
      );

      try {
        const tx = await api.initializeNftSafe({
          wallet: authorityWallet,
          connection: connection,
        });

        console.log('Create Init Safe', tx);

        const args1: MintRegularNftApiArgs = {
          connection: connection,
          wallet: authorityWallet,
          mintName: 'Test Mint',
          mintSymbol: 'TEST',
          isMasterEdition: true,
          isParentNft: true, // is this nft mint a parent mint for other mints ?
          mintUri: 'http://mint.uri.com',
          receiverAddress: authorityWallet.publicKey,
        };
        const tx1 = await api.mintRegularNft(args1);

        console.log('The transaction is ', tx1);
      } catch (err) {
        console.log('Already present');
      }

      const testMessage = claimantWallet.publicKey.toBytes();
      const signature = nacl.sign.detached(testMessage, authority.secretKey);

      const args2: MintSignedCollectionNftApiArgs = {
        authorityAddress: authorityWallet.publicKey,
        connection: connection,
        wallet: claimantWallet,
        signature: signature,
        message: testMessage,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isMasterEdition: true,
        isParentForNfts: false,
        mintUri: 'http://child.mint.uri.com',
        collectionMintAddress: mintAddress,
      };
      const tx2 = await api.mintSignedCollectionNft(args2);

      console.log('The transaction is ', tx2);
    } catch (err) {
      console.log(err);
    }
  });
});
