import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { findNftSafeAddress } from '../pda';

async function getInitNftSafeInstruction(args: {
  program: Program;
  payerAddress: PublicKey;
}) {
  const [nftSafeAddress, _1] = await findNftSafeAddress(args.payerAddress);

  const initNftSafeInstruction = await args.program.methods
    .initNftSafe()
    .accounts({
      payer: args.payerAddress,
      systemProgram: SystemProgram.programId,
      nftSafe: nftSafeAddress,
    })
    .instruction();

  return initNftSafeInstruction;
}

export { getInitNftSafeInstruction };
