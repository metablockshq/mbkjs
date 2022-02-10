import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { MetaBlocks } from '../types/meta_blocks';
import { BlockMetadata } from '../types/types';
import bs58 from 'bs58';
import camelcase from 'camelcase';
import { sha256 } from 'js-sha256';
import { Program } from '@project-serum/anchor';
import * as BufferLayout from '@solana/buffer-layout';

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

const getAllAccountInfo = async <T>(
  idlAccountName: string,
  program: Program,
  layout: BufferLayout.Structure
) => {
  const discriminator = accountDiscriminator(idlAccountName);

  let resp = await program.provider.connection.getProgramAccounts(
    program.programId,
    {
      commitment: program.provider.connection.commitment,
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: bs58.encode(discriminator),
          },
        },
        ...[],
      ],
    }
  );

  return resp.map(({ pubkey, account }) => {
    return {
      publicKey: pubkey,
      account: layout.decode(account.data) as T,
    };
  });
};

const accountDiscriminator = (name: string): Buffer => {
  return Buffer.from(
    sha256.digest(`account:${camelcase(name, { pascalCase: true })}`)
  ).slice(0, 8);
};

const getPubkeyFromUnit8Array = (input: Uint8Array | PublicKey): string => {
  if (input instanceof Uint8Array) {
    return PublicKey.decode(Buffer.from(input)).toString();
  } else {
    return input.toString();
  }
};

export {
  camelToSnakeCase,
  camelToSnakeCaseArrayObject,
  getSignature,
  setBlockMetadata,
  getAllAccountInfo,
  getPubkeyFromUnit8Array,
};
