import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, {
  addSols,
  CLUSTER_URL,
  getTestAuthority,
} from './utils/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api } from '../src';
import { MintSignedNftApiArgs } from '../src/types/types';
import nacl from 'tweetnacl';

describe('MINT Unsigned NFT', () => {
  const authority = getTestAuthority();
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

  it('Should create an signed NFT', async () => {
    try {
      const testMessage = claimantWallet.publicKey.toBytes();
      const signature = nacl.sign.detached(testMessage, authority.secretKey);

      const args: MintSignedNftApiArgs = {
        authorityAddress: authorityWallet.publicKey,
        signature: signature,
        message: testMessage,
        connection: connection,
        wallet: claimantWallet,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isMasterEdition: true,
        isParentForNfts: false,
        mintUri: 'http://mint.uri.com',
      };
      const tx = await api.mintSignedNft(args);

      console.log('The transaction is ', tx);
    } catch (err) {
      console.log(err);
    }
  });
});
