import * as anchor from '@project-serum/anchor';
import { MetaBlocks } from '../types/meta_blocks';
import { BlockMetadata, Universe } from '../types/types';
import { camelToSnakeCaseArrayObject, setBlockMetadata } from './utils';

const getAllUniverses = async (
  program: anchor.Program<MetaBlocks>,
  isBlockMetadata: boolean = false
): Promise<Universe[]> => {
  const universeAccounts = await program.account.universe.all();

  const universes = await Promise.all(
    universeAccounts.map(async (element) => {
      const universeAccount = element.account;
      let metadata: BlockMetadata = {
        slot: null,
        signature: null,
        blockTime: null,
      };

      if (isBlockMetadata) {
        metadata = await setBlockMetadata(element.publicKey, program);
      }
      return {
        publicKey: element.publicKey.toString(),
        authority: universeAccount.authority.toString(),
        name: universeAccount.config.name as string,
        websiteUrl: universeAccount.config.websiteUrl as string,
        description: universeAccount.config.description as string,
        lastUpdateTs: universeAccount.lastUpdateTs.toNumber(),
        totalNfts: universeAccount.totalNfts.toNumber(),
        blockTime: metadata.blockTime,
        signature: metadata.signature,
        slot: metadata.slot,
      };
    })
  );

  return camelToSnakeCaseArrayObject(universes);
};

export { getAllUniverses };
