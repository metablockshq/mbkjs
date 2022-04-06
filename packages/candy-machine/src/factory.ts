import { Program, Provider } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { CANDY_MACHINE_PROGRAM_V2_ID } from './constants';

const getProvider = (conn: Connection, wallet: any) => {
  return new Provider(conn, wallet, {
    preflightCommitment: 'processed',
    skipPreflight: false,
  });
};

const getCandyMachineProgram = async (conn: Connection, wallet: any) => {
  const provider = getProvider(conn, wallet);

  const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_V2_ID, provider);
  const program = new Program(idl!, CANDY_MACHINE_PROGRAM_V2_ID, provider);
  return program;
};

export { getProvider, getCandyMachineProgram };
