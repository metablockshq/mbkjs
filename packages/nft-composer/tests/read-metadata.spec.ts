import * as anchor from '@project-serum/anchor';
import NodeWallet, { CLUSTER_URL } from './utils/sdk';
import { getMetaBlocksProgram } from '../src/factory';
import { assert } from 'chai';
import { getAllWrappedUserNfts } from '../src/accounts';
import { getMetaNftMetadata, getReceiptNftsMetadata } from '../src/api';

describe('Read Metadata Test cases', () => {
  const dummyKeypair = anchor.web3.Keypair.generate();
  const dummyWallet = new NodeWallet(dummyKeypair);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getMetaBlocksProgram(connection, dummyWallet);

  it('Read the Metadata for user with universe', async () => {
    const wrappedUserNfts = await getAllWrappedUserNfts(program);

    const wrappes = wrappedUserNfts.filter(
      (wrappedUserNft) =>
        wrappedUserNft.universe !== undefined &&
        wrappedUserNft.nftAuthority !== undefined
    );

    const result = await getReceiptNftsMetadata({
      connection: connection,
      universe: wrappes[0].universe,
      userPublicAddress: wrappes[0].nftAuthority,
      wallet: dummyWallet,
    });

    console.log(result);
  });

  it('Read the Metadata for user with universe', async () => {
    const wrappedUserNfts = await getAllWrappedUserNfts(program);

    const wrappes = wrappedUserNfts.filter(
      (wrappedUserNft) =>
        wrappedUserNft.universe !== undefined &&
        wrappedUserNft.nftAuthority !== undefined
    );

    const result = await getMetaNftMetadata({
      connection: connection,
      universe: wrappes[0].universe,
      userPublicAddress: wrappes[0].nftAuthority,
    });

    console.log(result);
  });
});
