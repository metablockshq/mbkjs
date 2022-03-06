import { assert } from 'chai';
import * as anchor from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createUniverse, depositNft, withdrawNftWithReceipt } from '../src/api';
import NodeWallet, { addSols, CLUSTER_URL, mintNFT } from './utils/sdk';
import { getMetaBlocksProgram } from '../src/factory';
import { findUniverseAddress, getPdaKeys, PdaKeys } from '../src/pda';
import {
  GroupedDepositNftApiArgs,
  WithdrawNftWithReceiptApiArgs,
} from '../src';
import { getTokenAccount } from '@project-serum/common';

describe('Withdraw With Receipt Test cases', () => {
  const dummyKeypair = anchor.web3.Keypair.generate();
  const fakeUniverseAuthority = anchor.web3.Keypair.generate();

  const dummyWallet = new NodeWallet(dummyKeypair);
  const fakeUniverseAuthorityWallet = new NodeWallet(fakeUniverseAuthority);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getMetaBlocksProgram(connection, dummyWallet);

  let userNftMint: anchor.web3.PublicKey = dummyKeypair.publicKey;
  let userNftAta = dummyKeypair.publicKey;

  beforeAll(async () => {
    await addSols(
      program.provider,
      dummyKeypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );

    await addSols(
      program.provider,
      fakeUniverseAuthority.publicKey,
      2 * LAMPORTS_PER_SOL
    );

    const { mintKey, nftAta } = await mintNFT(
      dummyWallet.payer,
      program.provider
    );

    userNftAta = nftAta;
    userNftMint = mintKey;

    const universeArgs = {
      name: 'namesss',
      description: 'description',
      websiteUrl: 'websiteUrl',
      connection: connection,
      wallet: fakeUniverseAuthorityWallet,
    };

    await createUniverse(universeArgs);
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );

    const args: GroupedDepositNftApiArgs = {
      connection: connection,
      isReceiptMasterEdition: false,
      url: 'http://localhost:8090',
      wallet: dummyWallet,
      mintKey: userNftMint,
      universeKey: universeKey,
    };

    await depositNft(args);
  });

  it('Should be able withdraw with Receipt', async () => {
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );

    const pdaKeys: PdaKeys = await getPdaKeys(
      universeKey,
      dummyKeypair.publicKey,
      userNftMint
    );

    const args: WithdrawNftWithReceiptApiArgs = {
      connection: connection,
      receiptMint: pdaKeys.receiptMint,
      wallet: dummyWallet,
      universeKey: universeKey,
    };

    await withdrawNftWithReceipt(args);
  });

  it('Should be able to redeposit NFT', async () => {
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );

    const args: GroupedDepositNftApiArgs = {
      connection: connection,
      isReceiptMasterEdition: false,
      url: 'http://localhost:8090',
      wallet: dummyWallet,
      mintKey: userNftMint,
      universeKey: universeKey,
    };

    await depositNft(args);

    const pdaKeys: PdaKeys = await getPdaKeys(
      universeKey,
      dummyKeypair.publicKey,
      userNftMint
    );

    const userReceiptNftAccount = await getTokenAccount(
      program.provider,
      pdaKeys.userReceiptAta
    );

    assert.isOk(
      userReceiptNftAccount.amount.toString() === '1',
      'Vault should have received back NFT'
    );
  });

  it('Should be able re-withdraw with Receipt', async () => {
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );

    const pdaKeys: PdaKeys = await getPdaKeys(
      universeKey,
      dummyKeypair.publicKey,
      userNftMint
    );

    const args: WithdrawNftWithReceiptApiArgs = {
      connection: connection,
      receiptMint: pdaKeys.receiptMint,
      wallet: dummyWallet,
      universeKey: universeKey,
    };

    await withdrawNftWithReceipt(args);
  });
});
