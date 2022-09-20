import { assert } from 'chai';
import { getMetaNftUrl, getReceiptUrl } from '../src/api';
import { NftComposerCluster } from '../src/types';

describe('Test Build URL', () => {
  test('Get Receipt URL ', async () => {
    try {
      const result = await getReceiptUrl({
        arweaveUrl:
          'https://2ooesnq3qaunqubygijfxqdr5hgrkogayy2l6shanahl7a4v.arweave.net/05xJNhuAKNhQODI_SW_8Bx6c0VOMDGNL9I4GgOv4OVo/',
        universeAddress: 'taraUniverseKey',
        walletAddress: 'wallet',
        cluster: NftComposerCluster.Devnet,
      });

      console.log(result);
      assert.isOk(result);
    } catch (err) {
      console.log(err);
    }
  });

  test('MetaNft shortId', async () => {
    try {
      const result = await getMetaNftUrl({
        universeAddress: 'taraUniverseKey',
        walletAddress: 'wallet',
        cluster: NftComposerCluster.Devnet,
      });
      console.log(result);

      assert.isOk(result);
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
        expect(err.response.data.error).toBe(
          'shortId already exists for this universeAddress + walletAddress pair'
        );
      }
    }
  });
});
