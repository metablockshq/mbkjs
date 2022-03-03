import { assert, expect } from 'chai';
import * as anchor from '@project-serum/anchor';
import { Wallet } from '@project-serum/anchor';
import { MetaBlocks } from '../src/types/meta_blocks';
import { Connection, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { createUniverse } from '../src/api';
import { UniverseApiArgs } from '../src';
import NodeWallet, { addSols } from './utils';
import { getMetaBlocksProgram } from '../src/factory';

describe('Create universe', () => {
  const dummyKeypair = anchor.web3.Keypair.generate();
  const dummyWallet = new NodeWallet(dummyKeypair);
  const connection = new anchor.web3.Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );
  const program = getMetaBlocksProgram(connection, dummyWallet);
  program.simulate;

  beforeAll(async () => {
    await addSols(program.provider, dummyWallet.publicKey, LAMPORTS_PER_SOL);
  });

  it('should pass', async () => {
    const args: UniverseApiArgs = {
      name: 'universe',
      description: 'universe',
      websiteUrl: 'universe',
      connection: connection,
      wallet: dummyWallet,
    };

    await createUniverse(args);
  });
});
