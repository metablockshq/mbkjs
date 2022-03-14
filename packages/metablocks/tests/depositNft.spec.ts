import { assert } from 'chai';
import * as anchor from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createUniverse, depositNft } from '../src/api';
import NodeWallet, { addSols, CLUSTER_URL, mintNFT } from './utils/sdk';
import { getMetaBlocksProgram } from '../src/factory';
import {
  findReceiptMintAddress,
  findUniverseAddress,
  findWrappedUserNftAddress,
  getPdaKeys,
  PdaKeys,
} from '../src/pda';
import { GroupedDepositNftApiArgs } from '../src';
import { getTokenAccount } from '@project-serum/common';

describe('Deposit Test cases', () => {
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
  });

  it('should deposit NFT', async () => {
    const [universeKey, _universeBump] = await findUniverseAddress(
      fakeUniverseAuthorityWallet.publicKey
    );

    const pdaKeys: PdaKeys = await getPdaKeys(
      universeKey,
      dummyKeypair.publicKey,
      userNftMint
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
    const [receiptMintAddress, _receiptMintBump] = await findReceiptMintAddress(
      universeKey,
      dummyKeypair.publicKey,
      userNftMint
    );
    const [wrappedUserNftKey, _] = await findWrappedUserNftAddress(
      dummyKeypair.publicKey,
      receiptMintAddress
    );

    const depositNftData = await program.account.wrappedUserNft.fetch(
      wrappedUserNftKey
    );

    assert.equal(
      depositNftData.nftAuthority.toString(),
      dummyKeypair.publicKey.toString()
    );

    assert.isOk(
      depositNftData.vaultAuthority.toString() === pdaKeys.vaultKey.toString()
    );

    const vaultNftAccount = await getTokenAccount(
      program.provider,
      pdaKeys.vaultNftAta
    );

    const userReceiptNftAccount = await getTokenAccount(
      program.provider,
      pdaKeys.userReceiptAta
    );

    assert.isOk(vaultNftAccount.amount.toString() === '1');
    assert.isOk(userReceiptNftAccount.amount.toString() === '1');
  });
});
