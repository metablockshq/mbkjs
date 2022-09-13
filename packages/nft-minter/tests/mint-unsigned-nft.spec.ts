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

describe('MINT Unsigned NFT', () => {
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

  it('Should create an unsigned NFT', async () => {
    try {
      const args: MintUnsignedNftApiArgs = {
        connection: connection,
        wallet: claimantWallet,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isMasterEdition: true,
        isParentForNfts: false,
        mintUri: 'http://mint.uri.com',
      };
      const tx = await api.mintUnsignedNft(args);

      console.log('The transaction is ', tx);
    } catch (err) {
      console.log(err);
    }
  });
});
