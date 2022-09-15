import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

import nftMinterIdl from './idl/nft_minter.json';

import { NftMinter } from './types/nft_minter';

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
  TOKEN_METADATA_PROGRAM_ID: new PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  ),
  NFT_MINTER_PROGRAM_ID: new PublicKey(nftMinterIdl.metadata.address),
};

const getAnchorProvider = (conn: Connection, wallet: any) => {
  return new AnchorProvider(conn, wallet, {
    preflightCommitment: 'processed',
    skipPreflight: false,
  });
};

const getNftMinterProgram = (conn: Connection, wallet: any) => {
  const provider = getAnchorProvider(conn, wallet);
  const program = new Program<any>(
    nftMinterIdl,
    programIds.NFT_MINTER_PROGRAM_ID,
    provider
  ) as Program<any>;
  return program;
};

export { getNftMinterProgram, getAnchorProvider, programIds };
