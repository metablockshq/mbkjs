import { Program, Provider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from './mbIdl';
import { MetaBlocks } from './types/meta_blocks';

const programIds = {
  token: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  associatedToken: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  //metaBlocks: '9pNcm4DmZJgHYynuvhSbZ3m4bqBSKeuXqZ2cCZKbcLJc',
  metaBlocks: '7AXe9KFM3mVw7UcocVRqtJnunc6L3opkicJVc59YxSr5',

  metaplex: 'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98',
  metadata: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
};

const programId = new PublicKey(programIds.metaBlocks);

const getProvider = (conn: Connection, wallet: any) => {
  return new Provider(conn, wallet, {
    preflightCommitment: 'processed',
    skipPreflight: false,
  });
};

const getMetaBlocksProgram = (conn: Connection, wallet: any) => {
  const provider = getProvider(conn, wallet);
  const program = new Program<any>(
    idl,
    programId,
    provider
  ) as Program<MetaBlocks>;
  return program;
};

export { getMetaBlocksProgram, getProvider, programIds };
