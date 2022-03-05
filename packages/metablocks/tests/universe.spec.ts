import { assert } from 'chai';
import * as anchor from '@project-serum/anchor';
import { createUniverse, updateUniverse } from '../src/api';
import NodeWallet, { addSols } from './utils/sdk';
import { getMetaBlocksProgram } from '../src/factory';
import { findUniverseAddress } from '../src/pda';

describe('Universe Test Cases', () => {
  const dummyKeypair = anchor.web3.Keypair.generate();
  const dummyWallet = new NodeWallet(dummyKeypair);

  const connection = new anchor.web3.Connection(
    'http://localhost:8899',
    'confirmed'
  );
  const program = getMetaBlocksProgram(connection, dummyWallet);
  //let universePda: [PublicKey, number] = [dummyKeypair.publicKey, 0];

  beforeAll(async () => {
    //await addSolsIfEmpty(program.provider, testWallet, 2 * LAMPORTS_PER_SOL);
    await addSols(program.provider, dummyKeypair.publicKey, 10000000);
  });

  /**
   * Test create universe
   */
  it('should create universe', async () => {
    const args = {
      name: sampleUniverseData().name,
      description: sampleUniverseData().description,
      websiteUrl: sampleUniverseData().websiteUrl,
      connection: connection,
      wallet: dummyWallet,
    };

    const tx = await createUniverse(args);

    const [universeKey, _] = await findUniverseAddress(dummyWallet.publicKey);

    const universeData = await program.account.universe.fetch(universeKey);

    assert.isOk(
      universeData.authority.toString() === dummyWallet.publicKey.toString()
    );
    assert.isOk(
      universeData.config.websiteUrl === sampleUniverseData().websiteUrl
    );
    assert.equal(
      universeData.config.name,
      sampleUniverseData().name,
      'Universe Name should be equal'
    );
    assert.equal(
      universeData.config.description,
      sampleUniverseData().description,
      'Universe description should be equal'
    );
  });

  /**
   * Test Update universe
   */
  it('should update universe ', async () => {
    const [universeKey, _] = await findUniverseAddress(dummyWallet.publicKey);

    const beforeUniverseData = await program.account.universe.fetch(
      universeKey
    );

    assert.isOk(
      beforeUniverseData.authority.toString() ===
        dummyWallet.publicKey.toString()
    );
    assert.isOk(
      beforeUniverseData.config.websiteUrl === sampleUniverseData().websiteUrl
    );
    assert.equal(
      beforeUniverseData.config.name,
      sampleUniverseData().name,
      'Universe Name should be equal'
    );
    assert.equal(
      beforeUniverseData.config.description,
      sampleUniverseData().description,
      'Universe description should be equal'
    );

    const args = {
      name: sampleUpdatedUniverseData().name,
      description: sampleUpdatedUniverseData().description,
      websiteUrl: sampleUpdatedUniverseData().websiteUrl,
      connection: connection,
      wallet: dummyWallet,
    };

    const tx = await updateUniverse(args);
    const universeData = await program.account.universe.fetch(universeKey);
    assert.isOk(
      universeData.authority.toString() === dummyWallet.publicKey.toString()
    );

    assert.isOk(
      universeData.authority.toString() === dummyWallet.publicKey.toString()
    );
    assert.isOk(
      universeData.config.websiteUrl === sampleUpdatedUniverseData().websiteUrl
    );
    assert.equal(
      universeData.config.name,
      sampleUpdatedUniverseData().name,
      'Universe Name should be equal'
    );
    assert.equal(
      universeData.config.description,
      sampleUpdatedUniverseData().description,
      'Universe description should be equal'
    );
  });
});

const sampleUniverseData = () => {
  return {
    name: 'universe',
    description: 'description',
    websiteUrl: 'http://dummylocalhost.com',
  };
};

const sampleUpdatedUniverseData = () => {
  return {
    name: 'updatedUniverse',
    description: 'updatedDescription',
    websiteUrl: 'http://updatedDummylocalhost.com',
  };
};
