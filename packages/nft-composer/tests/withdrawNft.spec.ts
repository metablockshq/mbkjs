import { assert } from 'chai';
import * as anchor from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createUniverse, depositNft, withdrawNft } from '../src/api';
import NodeWallet, {
  addSols,
  CLUSTER_URL,
  getTokenAccount,
  mintNFT,
} from './utils/sdk';
import { getMetaBlocksProgram } from '../src/factory';
import { findUniverseAddress, getPdaKeys, PdaKeys } from '../src/pda';
import { GroupedDepositNftApiArgs, WithdrawNftApiArgs } from '../src';

describe('Withdraw Test cases', () => {
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
      receiptUrl: 'http://localhost:8090',
      receiptName: 'receiptName',
      metaNftName: 'metaNftName',
      metaNftUrl: 'http://localhost_meta_api.url',
      isMetaNftMasterEdition: false,
      wallet: dummyWallet,
      mintKey: userNftMint,
      universeKey: universeKey,
    };

    await depositNft(args);
  });

  it('Should withdraw NFT', async () => {
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );
    const args: WithdrawNftApiArgs = {
      connection: connection,
      wallet: dummyWallet,
      mintKey: userNftMint,
      universeKey: universeKey,
    };

    await withdrawNft(args);

    const pdaKeys: PdaKeys = await getPdaKeys(
      universeKey,
      dummyKeypair.publicKey,
      userNftMint
    );

    const userNftAccount = await getTokenAccount(
      program.provider,
      pdaKeys.userNftAta
    );

    assert.isOk(
      userNftAccount.amount.toString() === '1',
      'User should have received back NFT'
    );
  });

  it('Should be able to redeposit NFT', async () => {
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );

    const args: GroupedDepositNftApiArgs = {
      connection: connection,
      isReceiptMasterEdition: false,
      receiptUrl: 'http://localhost:8090',
      receiptName: 'receiptName',
      metaNftName: 'metaNftName',
      metaNftUrl: 'http://localhost_meta_api.url',
      isMetaNftMasterEdition: false,
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

  it('Should be able to reWithdraw NFT', async () => {
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );
    const args: WithdrawNftApiArgs = {
      connection: connection,
      wallet: dummyWallet,
      mintKey: userNftMint,
      universeKey: universeKey,
    };

    await withdrawNft(args);
  });
});
