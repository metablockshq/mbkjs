import { assert } from 'chai';
import * as anchor from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import NodeWallet, {
  addSols,
  CLUSTER_URL,
  getTestKeypair,
  getTestWallet,
} from './utils/sdk';
import { getPdaKeys, PdaKeys } from '../src/pda';
import { getTokenAccount } from '@project-serum/common';
import { getTokenDistributorProgram } from '../src/factory';
import {
  api,
  ClaimApiArgs,
  DelegateTokensApiArgs,
  InitTokenDistributorApiArgs,
  TransferTokensApiArgs,
  UpdateDistributorApiArgs,
} from '../src';
import nacl from 'tweetnacl';

describe('Deposit Test cases', () => {
  const dummyKeypair = getTestKeypair();
  const dummyWallet = getTestWallet(dummyKeypair);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getTokenDistributorProgram(connection, dummyWallet);

  beforeAll(async () => {
    await addSols(
      program.provider,
      dummyWallet.publicKey,
      1 * LAMPORTS_PER_SOL
    );
  });

  it('should init distributor ', async () => {
    const args: InitTokenDistributorApiArgs = {
      wallet: dummyWallet,
      connection: connection,
      tokenExpiryDate: 1680383846,
      totalTokenAmount: 20000,
      initialAuthorityTokens: 5000,
      userClaimAmount: 1,
    };
    const tx = await api.initTokenDistributorV1(args);

    assert.isOk(tx.length > 0);
  });

  it('should claim token', async () => {
    const claimant = anchor.web3.Keypair.generate();
    const claimantWallet = new NodeWallet(claimant);

    await addSols(program.provider, claimant.publicKey);

    const testMessage = claimantWallet.publicKey.toBytes();

    const signature = nacl.sign.detached(testMessage, dummyKeypair.secretKey);

    const args: ClaimApiArgs = {
      signature: signature,
      connection: connection,
      wallet: claimantWallet,
      message: testMessage,
    };

    const tx = await api.claimV1(args);
    assert.isOk(tx.length > 0);
  });

  it('should transfer tokens', async () => {
    const recipient = anchor.web3.Keypair.generate();

    const args: TransferTokensApiArgs = {
      wallet: dummyWallet,
      amount: 1000,
      recipientAuthority: recipient.publicKey,
      connection: connection,
    };

    const tx = await api.transferTokensV1(args);
    assert.isOk(tx.length > 0);
  });

  it('should delegate tokens ', async () => {
    const delegate = anchor.web3.Keypair.generate();

    const args: DelegateTokensApiArgs = {
      wallet: dummyWallet,
      amount: 1000,
      delegateAuthority: delegate.publicKey,
      connection: connection,
    };

    const tx = await api.delegateTokensV1(args);
    assert.isOk(tx.length > 0);
  });

  it('should update token distributor', async () => {
    const args: UpdateDistributorApiArgs = {
      connection: connection,
      wallet: dummyWallet,
      totalTokenAmount: 20000,
      userClaimAmount: 1,
      tokenExpiryDate: 1775078246,
    };

    const tx = await api.updateDistributorV1(args);

    assert.isOk(tx.length > 0);
  });
});
