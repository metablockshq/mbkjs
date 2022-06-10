import { assert } from 'chai';
import {
  getAllStoredUniverseAccounts,
  getAllStoredWrappedUserNftAccounts,
  getStoredUniverseAccounts,
  getStoredWrappedUserNftAccounts,
} from '../src/api';

import { Keypair } from '@solana/web3.js';

describe('Supabase TEST cases', async () => {
  test('Get all stored wrapped user nfts', async () => {
    const result = await getAllStoredWrappedUserNftAccounts();
    //console.log(result);

    assert.isOk(result.length >= 0);
  });

  test('Get Stored Wrapped user nfts', async () => {
    const wallet = Keypair.generate();
    const universe = Keypair.generate();
    const result = await getStoredWrappedUserNftAccounts({
      wallet: wallet.publicKey.toString(),
      universe: universe.publicKey.toString(),
    });
    //console.log(result);

    assert.isOk(result.length === 0);
  });

  test('Get all stored universes', async () => {
    const result = await getAllStoredUniverseAccounts();
    //console.log(result);

    assert.isOk(result.length >= 0);
  });

  test('Get Stored universes for wallet', async () => {
    const wallet = Keypair.generate();
    const result = await getStoredUniverseAccounts({
      wallet: wallet.publicKey.toString(),
    });
    //console.log(result);

    assert.isOk(result.length === 0);
  });
});
