import { BN, Program } from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';
import { KyraaError } from './error';
import { getMetaTreasuryProgram } from './factory';
import {
  getInitTreasuryInstruction,
  getUpdateFixedFeeForTreasuryInstruction,
} from './instructions/treasuryInstructions';
import { findTreasuryAddress } from './pda';
import {
  GetTreasuryApiArgs,
  InitializeTreasuryApiArgs,
  UpdateFixedFeeApiArgs,
} from './types';
import { MetaTreasury } from './types/meta_treasury';

const getTreasuryData = async (args: GetTreasuryApiArgs) => {
  const program = getMetaTreasuryProgram(args.connection, args.wallet);
  return fetchTreasuryData(program);
};

const fetchTreasuryData = async (program: Program<MetaTreasury>) => {
  const [treasuryAddress, _] = await findTreasuryAddress();

  return await program.methods
    .getTreasury()
    .accounts({
      treasury: treasuryAddress,
    })
    .view();
};

const initTreasury = async (args: InitializeTreasuryApiArgs) => {
  try {
    const usersKey = args.wallet.publicKey;
    const program = getMetaTreasuryProgram(args.connection, args.wallet);

    const instruction = await getInitTreasuryInstruction({
      program: program,
      usersKey: usersKey,
      fixedFee: new BN(args.fixedFee),
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);
    return tx;
  } catch (err) {
    throw new KyraaError(err);
  }
};

const updateFixedFeeForTreasury = async (args: UpdateFixedFeeApiArgs) => {
  try {
    const usersKey = args.wallet.publicKey;
    const program = getMetaTreasuryProgram(args.connection, args.wallet);

    const instruction = await getUpdateFixedFeeForTreasuryInstruction({
      usersKey: usersKey,
      program: program,
      fixedFee: new BN(args.fixedFee),
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const tx = await program.provider.sendAndConfirm!(transaction, []);
  } catch (err) {
    throw new KyraaError(err);
  }
};

export {
  getTreasuryData,
  fetchTreasuryData,
  initTreasury,
  updateFixedFeeForTreasury,
};
