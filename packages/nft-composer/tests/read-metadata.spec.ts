import * as anchor from '@project-serum/anchor';
import NodeWallet, { CLUSTER_URL } from './utils/sdk';
import { getMetaBlocksProgram } from '../src/factory';
import { assert } from 'chai';
import { getAllWrappedUserNfts } from '../src/accounts';
import { getMetaNftMetadata, getReceiptNftsMetadata } from '../src/api';

describe('Metadata Read Test cases', () => {
  const dummyKeypair = anchor.web3.Keypair.generate();
  const dummyWallet = new NodeWallet(dummyKeypair);

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  const program = getMetaBlocksProgram(connection, dummyWallet);

  it('ReceiptNFT : Read the Metadata for user with universe', async () => {
    const wrappedUserNfts = await getAllWrappedUserNfts(program);

    if (wrappedUserNfts.length > 0) {
      const filteredWrapped = wrappedUserNfts.filter(
        (wrappedUserNft) =>
          wrappedUserNft.universe !== undefined &&
          wrappedUserNft.nftAuthority !== undefined
      );

      const result = await getReceiptNftsMetadata({
        connection: connection,
        universe: filteredWrapped[0].universe,
        userPublicAddress: filteredWrapped[0].nftAuthority,
        wallet: dummyWallet,
      });

      console.log(result);
    }
  });

  it('MetaNFT : Read the Metadata for user with universe', async () => {
    try {
      const wrappedUserNfts = await getAllWrappedUserNfts(program);

      if (wrappedUserNfts.length > 0) {
        const filteredWrapped = wrappedUserNfts.filter(
          (wrappedUserNft) =>
            wrappedUserNft.universe !== undefined &&
            wrappedUserNft.nftAuthority !== undefined
        );

        await Promise.all(
          filteredWrapped.map(async (wrappedUserNft) => {
            try {
              const result = await getMetaNftMetadata({
                connection: connection,
                universe: wrappedUserNft.universe,
                userPublicAddress: wrappedUserNft.nftAuthority,
                wallet: dummyWallet,
              });

              console.log(result);
            } catch (err) {
              console.log(err);
            }
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
});
