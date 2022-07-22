import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

import metaBlocksIdl from './idl/meta_blocks.json';
import metaNftIdl from './idl/meta_nft.json';
import metaTreasuryIdl from './idl/meta_treasury.json';

import { MetaBlocks } from './types/meta_blocks';
import { MetaNft } from './types/meta_nft';
import { MetaTreasury } from './types/meta_treasury';

const programIds = {
  TOKEN_PROGRAM_ID: new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
  ),
  ASSOCIATED_TOKEN_PROGRAM_ID: new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
  ),
  METAPLEX_PROGRAM_ID: new PublicKey(
    'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98'
  ),
  META_BLOCKS_PROGRAM_ID: new PublicKey(metaBlocksIdl.metadata.address),
  META_NFT_PROGRAM_ID: new PublicKey(metaNftIdl.metadata.address),
  META_TREASURY_PROGRAM_ID: new PublicKey(metaTreasuryIdl.metadata.address),
  TOKEN_METADATA_PROGRAM_ID: new PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  ),
};

const getAnchorProvider = (conn: Connection, wallet: any) => {
  return new AnchorProvider(conn, wallet, {
    preflightCommitment: 'processed',
    skipPreflight: false,
  });
};

const getMetaBlocksProgram = (conn: Connection, wallet: any) => {
  const provider = getAnchorProvider(conn, wallet);
  const program = new Program<any>(
    metaBlocksIdl,
    programIds.META_BLOCKS_PROGRAM_ID,
    provider
  ) as Program<MetaBlocks>;
  return program;
};

const getMetaNftProgram = (conn: Connection, wallet: any) => {
  const provider = getAnchorProvider(conn, wallet);
  const program = new Program<any>(
    metaNftIdl,
    programIds.META_NFT_PROGRAM_ID,
    provider
  ) as Program<MetaNft>;
  return program;
};

const getMetaTreasuryProgram = (conn: Connection, wallet: any) => {
  const provider = getAnchorProvider(conn, wallet);
  const program = new Program<any>(
    metaTreasuryIdl,
    programIds.META_TREASURY_PROGRAM_ID,
    provider
  ) as Program<MetaTreasury>;
  return program;
};

export {
  getMetaNftProgram,
  getMetaBlocksProgram,
  getAnchorProvider,
  getMetaTreasuryProgram,
  programIds,
};
