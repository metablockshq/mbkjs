import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { MetaBlocks } from '../types/meta_blocks';
import { BlockMetadata } from '../types/types';
import bs58 from 'bs58';
import camelcase from 'camelcase';
import { sha256 } from 'js-sha256';
import { Program } from '@project-serum/anchor';
import { Layout } from 'buffer-layout';

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

const getAllAccountInfo = async (
  idlAccountName: string,
  program: anchor.Program<MetaBlocks>,
  layouts: Layout[]
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

  return processAccountInfo(resp, layouts);
};

const processAccountInfo = (
  resp: {
    pubkey: anchor.web3.PublicKey;
    account: anchor.web3.AccountInfo<Buffer>;
  }[],
  layouts: Layout[]
) => {
  return resp.map(({ pubkey, account }) => {
    let result = null;
    for (let layout of layouts) {
      try {
        result = {
          publicKey: pubkey,
          account: layout.decode(account.data.slice(8)),
        };
      } catch (err) {
        continue;
      }
    }
    return result;
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

const getNullableAccountInfoBuffer = async (
  publicKey: PublicKey,
  connection: Connection
): Promise<Buffer | null> => {
  const accountInfo = await connection.getAccountInfo(
    publicKey,
    connection.commitment
  );
  if (accountInfo === null) {
    return null;
  }
  return accountInfo.data;
};

const getDeserializedAccount = (
  buffer: Buffer,
  layout: Layout,
  idlAccountName: string
) => {
  try {
    // Assert the account discriminator is correct.
    const discriminator = accountDiscriminator(idlAccountName);
    if (discriminator.compare(buffer.slice(0, 8))) {
      throw new Error('Invalid account discriminator');
    }

    return layout.decode(buffer.slice(8));
  } catch (err) {
    throw new Error('Could not deserialize the account');
  }
};

export {
  camelToSnakeCase,
  camelToSnakeCaseArrayObject,
  getSignature,
  setBlockMetadata,
  getAllAccountInfo,
  getPubkeyFromUnit8Array,
  getNullableAccountInfoBuffer,
  getDeserializedAccount,
};
