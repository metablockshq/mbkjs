import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import nftMinterIdl from './idl/nft_minter.json';

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
  // TOKEN_METADATA_PROGRAM_ID: new PublicKey(
  //   'zpHebBS4xj9gX4RYfpJYJVFiucnYBjFsAZojh4mTuS1'
  // ),
  MAINNET_NFT_MINTER_PROGRAM_ID: new PublicKey(nftMinterIdl.metadata.address),
  DEVNET_NFT_MINTER_PROGRAMID: new PublicKey(
    'devhRdhbqQh1kN4xb86tqVBKhQQTui7f3LBiphcLsvq'
  ),
};

const getAnchorProvider = (conn: Connection, wallet: any) => {
  return new AnchorProvider(conn, wallet, {
    preflightCommitment: 'processed',
    skipPreflight: false,
  });
};

const getNftMinterProgram = (connection: Connection, wallet: any) => {
  const provider = getAnchorProvider(connection, wallet);

  const nftMinterProgramId = getNftMinterProgramId(connection);

  const program = new Program<any>(
    nftMinterIdl,
    nftMinterProgramId,
    provider
  ) as Program<any>;
  return program;
};

const getNftMinterProgramId = (connection: Connection) => {
  if (connection.rpcEndpoint.includes('dev')) {
    return programIds.DEVNET_NFT_MINTER_PROGRAMID;
  }

  return programIds.MAINNET_NFT_MINTER_PROGRAM_ID;
};

export { getNftMinterProgram, getAnchorProvider, programIds };
