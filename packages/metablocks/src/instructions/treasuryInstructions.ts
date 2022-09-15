import { SystemProgram } from '@solana/web3.js';
import * as pda from '../pda';
import {
  InitializeMetaTreasuryArgs,
  UpdateFixedFeeForMetaTreasuryArgs,
  UpdateMeteTreasuryArgs,
} from '../types';

export const getInitMetaTreasuryInstruction = async (
  args: InitializeMetaTreasuryArgs
) => {
  const [treasuryMetaAddress, _] = await pda.findMetaTreasuryAddress();

  return await args
    .metaTreasuryProgram!.methods.initTreasury({ fixedFee: args.fixedFee })
    .accounts({
      authority: args.usersKey,
      treasury: treasuryMetaAddress,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};

export const getUpdateFixedFeeForMetaTreasuryInstruction = async (
  args: UpdateFixedFeeForMetaTreasuryArgs
) => {
  const [treasuryMetaAddress, _] = await pda.findMetaTreasuryAddress();

  return await args
    .metaTreasuryProgram!.methods.updateFixedFee({ fixedFee: args.fixedFee })
    .accounts({
      authority: args.usersKey,
      treasury: treasuryMetaAddress,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};

export const getUpdateMetaTreasuryInstruction = async (
  args: UpdateMeteTreasuryArgs
) => {
  const [treasuryMetaAddress, _] = await pda.findMetaTreasuryAddress();

  return await args.metaTreasuryProgram.methods
    .updateTreasury({ fixedFee: args.fixedFee })
    .accounts({
      authority: args.usersKey,
      treasury: treasuryMetaAddress,
      newAuthority: args.usersKey2,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};
