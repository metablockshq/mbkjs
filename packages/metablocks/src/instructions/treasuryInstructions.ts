import { SystemProgram } from '@solana/web3.js';
import { programIds } from '../factory';
import * as pda from '../pda';
import {
  InitializeMetaTreasuryArgs,
  InitializeTreasuryArgs,
  UpdateFixedFeeForMetaTreasuryArgs,
  UpdateTreasuryArgs,
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

export const getInitTreasuryInstuction = async (
  args: InitializeTreasuryArgs
) => {
  const [treasuryAddress, _] = await pda.findTreasuryAddress();
  const [treasuryMetaAddress, _2] = await pda.findMetaTreasuryAddress();

  return await args
    .metaBlocksProgram!.methods.initTreasuryV1()
    .accounts({
      treasury: treasuryAddress,
      systemProgram: SystemProgram.programId,
      metaTreasury: treasuryMetaAddress,
      metaTreasuryProgram: programIds.META_TREASURY_PROGRAM_ID,
      authority: args.usersKey,
    })
    .instruction();
};

export const getUpdateTreasuryInstuction = async (args: UpdateTreasuryArgs) => {
  const [treasuryAddress, _] = await pda.findTreasuryAddress();
  const [treasuryMetaAddress, _2] = await pda.findMetaTreasuryAddress();

  return await args
    .metaBlocksProgram!.methods.updateTreasuryV1()
    .accounts({
      treasury: treasuryAddress,
      systemProgram: SystemProgram.programId,
      metaTreasury: treasuryMetaAddress,
      metaTreasuryProgram: programIds.META_TREASURY_PROGRAM_ID,
      authority: args.usersKey,
    })
    .instruction();
};
