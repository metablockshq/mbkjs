import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, { addSols, CLUSTER_URL } from './utils/utils';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { api, pda } from '../src';
import {
  InitializeNftMinterApiArgs,
  MintUnsignedCollectionNftApiArgs,
  MintUnsignedNftApiArgs,
} from '../src/types/types';

describe('MINT Unsigned Collection NFT', () => {
  const authority = anchor.web3.Keypair.generate();
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

  it('Should create an unsigned Collection NFT', async () => {
    try {
      const [mintAddress, _2] = await pda.findMintAddress(
        authorityWallet.publicKey
      );

      const args1: MintUnsignedNftApiArgs = {
        connection: connection,
        wallet: authorityWallet,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isMasterEdition: true,
        isParentForNfts: true, // is this nft mint a parent mint for other mints ?
        mintUri: 'http://mint.uri.com',
      };
      const tx1 = await api.mintUnsignedNft(args1);

      console.log('The transaction is ', tx1);

      const args2: MintUnsignedCollectionNftApiArgs = {
        connection: connection,
        wallet: claimantWallet,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isMasterEdition: true,
        isParentForNfts: false,
        mintUri: 'http://child.mint.uri.com',
        collectionMintAddress: mintAddress,
      };
      const tx2 = await api.mintUnsignedCollectionNft(args2);

      console.log('The transaction is ', tx2);
    } catch (err) {
      console.log(err);
    }
  });
});
