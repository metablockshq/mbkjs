import { Program, Provider } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { CANDY_MACHINE_PROGRAM_V2_ID } from './constants';
import localIdl from './idl/candy_machine.json';

const getProvider = (conn: Connection, wallet: any) => {
  return new Provider(conn, wallet, {
    preflightCommitment: 'processed',
    skipPreflight: false,
  });
};

const getCandyMachineProgram = async (conn: Connection, wallet: any) => {
  const provider = getProvider(conn, wallet);

  let program = null;
  const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_V2_ID, provider);
  if (idl == null) {
    program = new Program<any>(
      localIdl,
      CANDY_MACHINE_PROGRAM_V2_ID,
      provider
    ) as Program<any>;
    return program;
  } else {
    program = new Program(idl!, CANDY_MACHINE_PROGRAM_V2_ID, provider);
  }
  return program;
};

export { getProvider, getCandyMachineProgram };
