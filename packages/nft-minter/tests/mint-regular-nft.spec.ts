import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';
import NodeWallet, { addSols, CLUSTER_URL } from './utils/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { api } from '../src';
import { MintRegularNftApiArgs, NftCreator } from '../src/types/types';

describe('MINT REGULAR NFT', () => {
  const creatorKeypair = anchor.web3.Keypair.generate();
  const creatorWallet = new NodeWallet(creatorKeypair);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getNftMinterProgram(connection, creatorWallet);

  beforeAll(async () => {
    await addSols(
      program.provider,
      creatorWallet.publicKey,
      1 * LAMPORTS_PER_SOL
    );
  });

  it('Should create a Regular NFT', async () => {
    try {
      const tx = await api.initializeNftSafe({
        wallet: creatorWallet,
        connection: connection,
      });

      console.log('Create Init Safe', tx);

      const nftCreator: NftCreator = {
        address: creatorWallet.publicKey,
        share: 100,
      };
      const creators: Array<NftCreator> = [];
      creators.push(nftCreator);

      const args1: MintRegularNftApiArgs = {
        connection: connection,
        wallet: creatorWallet,
        mintName: 'Test Mint',
        mintSymbol: 'TEST',
        isMasterEdition: true,
        isParentNft: true, // Check if this is for minting parent nft
        mintUri: 'http://mint.uri.com',
        receiverAddress: creatorWallet.publicKey,
        creators: creators,
        sellerBasisPoints: 1000,
        isMutable: null, // could be null or true, once false cannot be converted back to true
      };
      const tx1 = await api.mintRegularNft(args1);

      console.log('The transaction is ', tx1);
    } catch (err) {
      console.log(err);
    }
  });
});
