import { assert } from 'chai';
import { getMetaNftShortId, getShortenedReceiptUrl } from '../src/api';

describe('Test URL shortners', () => {
  test('Receipt URL Shortner', async () => {
    try {
      const result = await getShortenedReceiptUrl({
        arweaveUrl:
          'https://2ooesnq3qaunqubygijfxqdr5hgrkogayy2l6shanahl7a4v.arweave.net/05xJNhuAKNhQODI_SW_8Bx6c0VOMDGNL9I4GgOv4OVo/',
        universeAddress: 'taraUniverseKey',
        walletAddress: 'wallet',
      });
      //console.log(result);

      assert.equal(result.name, 'Tara Base Card', 'NFT name should be equal');
    } catch (err) {
      console.log(err);
    }
  });

  test('MetaNft shortId', async () => {
    try {
      const result = await getMetaNftShortId({
        arweaveUrl:
          'https://2ooesnq3qaunqubygijfxqdr5hgrkogayy2l6shanahl7a4v.arweave.net/05xJNhuAKNhQODI_SW_8Bx6c0VOMDGNL9I4GgOv4OVo/',
        universeAddress: 'taraUniverseKey',
        walletAddress: 'wallet',
      });
      //console.log(result.meta_blocks.short_id);

      assert.isOk(result.meta_blocks.shortId.length > 0);
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
