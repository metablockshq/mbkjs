import { SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { pda } from '..';
import { IntializeNftMinterArgs } from '../types/types';

export const getInitializeNftMinterInstruction = async (
  args: IntializeNftMinterArgs
) => {
  const [nftMinterAddress, _] = await pda.findNftMinterAddress();

  const createNftMinterInstruction = await args.program.methods
    .initializeNftMinter()
    .accounts({
      systemProgram: SystemProgram.programId,
      nftMinter: nftMinterAddress,
      rent: SYSVAR_RENT_PUBKEY,
      authority: args.authorityAddress,
    })
    .instruction();

  return createNftMinterInstruction;
};
