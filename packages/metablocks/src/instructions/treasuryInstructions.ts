import { SystemProgram } from '@solana/web3.js';
import * as pda from '../pda';
import { InitializeTreasuryArgs, UpdateFixedFeeArgs } from '../types';

export const getInitTreasuryInstruction = async (
  args: InitializeTreasuryArgs
) => {
  const [treasuryAddress, _] = await pda.findTreasuryAddress();

  return await args.program.methods
    .initTreasury({ fixedFee: args.fixedFee })
    .accounts({
      authority: args.usersKey,
      treasury: treasuryAddress,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};

export const getUpdateFixedFeeForTreasuryInstruction = async (
  args: UpdateFixedFeeArgs
) => {
  const [treasuryAddress, _] = await pda.findTreasuryAddress();

  return await args.program.methods
    .updateFixedFee({ fixedFee: args.fixedFee })
    .accounts({
      authority: args.usersKey,
      treasury: treasuryAddress,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};
