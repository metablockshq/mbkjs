import { Program, Provider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { TokenDistributor, IDL } from './types/token_distributor';
import idl from './idl/token_distributor.json';
const programIds = {
  TOKEN_DISTRIBUTOR_PROGRAM_ID: new PublicKey(idl.metadata.address),
};

const getProvider = (conn: Connection, wallet: any) => {
  return new Provider(conn, wallet, {
    preflightCommitment: 'processed',
    skipPreflight: false,
  });
};

const getTokenDistributorProgram = (conn: Connection, wallet: any) => {
  const provider = getProvider(conn, wallet);
  const program = new Program<any>(
    idl,
    programIds.TOKEN_DISTRIBUTOR_PROGRAM_ID,
    provider
  ) as Program<any>;
  return program;
};

export { getTokenDistributorProgram };
