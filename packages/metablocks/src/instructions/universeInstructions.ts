import { SystemProgram } from '@solana/web3.js';

import { findUniverseAddress } from '../pda';
import { UniverseArgs } from '../types/types';

/**
 * Use this to create an universe
 * @param args universe args
 * @returns create instruction for universe
 */
const getCreateUniverseInstruction = async (args: UniverseArgs) => {
  const [universeKey, _universeBump] = await findUniverseAddress(args.usersKey);

  const createUniverseArgs = {
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  };

  return args.program.instruction.createUniverseV1(createUniverseArgs, {
    accounts: {
      universe: universeKey,
      authority: args.usersKey,
      systemProgram: SystemProgram.programId,
    },
  });
};

/**
 * Use this to edit universe
 * @param args universe args
 * @returns update instruction for universe
 */
const getUpdateUniverseInstruction = async (args: UniverseArgs) => {
  const [universeKey, _universeBump] = await findUniverseAddress(args.usersKey);

  const updateUniverseArgs = {
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  };

  return args.program.instruction.updateUniverseV1(updateUniverseArgs, {
    accounts: {
      universe: universeKey,
      authority: args.usersKey,
      systemProgram: SystemProgram.programId,
    },
  });
};

export { getCreateUniverseInstruction, getUpdateUniverseInstruction };
