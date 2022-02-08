import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { MetaBlocks } from '../types/meta_blocks';
import { BlockMetadata } from '../types/types';

const camelToSnakeCase = (value: string): string => {
  return value
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
};

const camelToSnakeCaseArrayObject = (arrayValue: Array<any>): Array<any> => {
  arrayValue.forEach((a) => {
    Object.keys(a).forEach((k) => {
      let newK = camelToSnakeCase(k);
      if (newK != k) {
        a[newK] = a[k];
        delete a[k];
      }
    });
  });

  return arrayValue;
};

const getSignature = async (
  program: anchor.Program<MetaBlocks>,
  publicKey: PublicKey
) => {
  return await program.provider.connection.getSignaturesForAddress(publicKey);
};

const setBlockMetadata = async (
  accountAddress: PublicKey,
  program: anchor.Program<MetaBlocks>
): Promise<BlockMetadata> => {
  let metadata: BlockMetadata = {
    blockTime: null,
    signature: null,
    slot: null,
  };
  const signature = await getSignature(program, new PublicKey(accountAddress));
  if (signature.length > 0) {
    metadata = {
      blockTime: signature[0].blockTime,
      signature: signature[0].signature,
      slot: signature[0].slot,
    };
  }
  return metadata;
};

export {
  camelToSnakeCase,
  camelToSnakeCaseArrayObject,
  getSignature,
  setBlockMetadata,
};
