import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, { addSols, CLUSTER_URL } from './utils/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api } from '../src';
import { InitializeNftMinterApiArgs } from '../src/types/types';

describe('Test NFT MINTER', () => {
  const authority = anchor.web3.Keypair.generate();
  const authorityWallet = new NodeWallet(authority);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getNftMinterProgram(connection, authorityWallet);

  beforeAll(async () => {
    await addSols(program.provider, authority.publicKey, 1 * LAMPORTS_PER_SOL);
  });

  it('should initialize nft-minter', async () => {
    try {
      const args: InitializeNftMinterApiArgs = {
        connection: connection,
        wallet: authorityWallet,
        uri: 'http://test.uri.com',
      };

      const tx = await api.initializeNftMinter(args);
    } catch (err) {
      console.log(err);
    }
  });
});
