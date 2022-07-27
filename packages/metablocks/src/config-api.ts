import { BN, Program } from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';
import { KyraaError } from './error';
import { getMetaBlocksProgram, getMetaTreasuryProgram } from './factory';
import {
  getInitMetaTreasuryInstruction,
  getUpdateFixedFeeForMetaTreasuryInstruction,
  getInitTreasuryInstuction,
  getUpdateTreasuryInstuction,
} from './instructions/treasuryInstructions';
import { findMetaTreasuryAddress } from './pda';
import {
  GetMetaTreasuryApiArgs,
  InitializeMetaTreasuryApiArgs,
  InitializeTreasuryApiArgs,
  UpdateFixedFeeForMetaTreasuryApiArgs,
  UpdateTreasuryApiArgs,
} from './types';
import { MetaTreasury } from './types/meta_treasury';

const getTreasuryData = async (args: GetMetaTreasuryApiArgs) => {
  const program = getMetaTreasuryProgram(args.connection, args.wallet);
  return fetchTreasuryData(program);
};

const fetchTreasuryData = async (program: Program<MetaTreasury>) => {
  const [treasuryAddress, _] = await findMetaTreasuryAddress();

  return await program.methods
    .getTreasury()
    .accounts({
      treasury: treasuryAddress,
    })
    .view();
};

const initMetaTreasury = async (args: InitializeMetaTreasuryApiArgs) => {
  try {
    const usersKey = args.wallet.publicKey;

    const metaTreasuryProgram = getMetaTreasuryProgram(
      args.connection,
      args.wallet
    );

    const instruction = await getInitMetaTreasuryInstruction({
      metaTreasuryProgram: metaTreasuryProgram,
      usersKey: usersKey,
      fixedFee: new BN(args.fixedFee),
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const tx = await metaTreasuryProgram.provider.sendAndConfirm!(
      transaction,
      []
    );
    return tx;
  } catch (err) {
    throw new KyraaError(err);
  }
};

const updateFixedFeeForMetaTreasury = async (
  args: UpdateFixedFeeForMetaTreasuryApiArgs
) => {
  try {
    const usersKey = args.wallet.publicKey;

    const metaTreasuryProgram = getMetaTreasuryProgram(
      args.connection,
      args.wallet
    );

    const instruction = await getUpdateFixedFeeForMetaTreasuryInstruction({
      usersKey: usersKey,
      metaTreasuryProgram: metaTreasuryProgram,
      fixedFee: new BN(args.fixedFee),
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const tx = await metaTreasuryProgram.provider.sendAndConfirm!(
      transaction,
      []
    );
    return tx;
  } catch (err) {
    throw new KyraaError(err);
  }
};

//metablocks treasury
const initMetaBlocksTreasury = async (args: InitializeTreasuryApiArgs) => {
  try {
    const usersKey = args.wallet.publicKey;

    const metaBlocksProgram = getMetaBlocksProgram(
      args.connection,
      args.wallet
    );

    const instruction = await getInitTreasuryInstuction({
      metaBlocksProgram: metaBlocksProgram,
      usersKey: usersKey,
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const tx = await metaBlocksProgram.provider.sendAndConfirm!(
      transaction,
      []
    );
    return tx;
  } catch (err) {
    throw new KyraaError(err);
  }
};

const updateMetaBlocksTreasury = async (args: UpdateTreasuryApiArgs) => {
  try {
    const usersKey = args.wallet.publicKey;

    const metaBlocksProgram = getMetaBlocksProgram(
      args.connection,
      args.wallet
    );

    const instruction = await getUpdateTreasuryInstuction({
      metaBlocksProgram: metaBlocksProgram,
      usersKey: usersKey,
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const tx = await metaBlocksProgram.provider.sendAndConfirm!(
      transaction,
      []
    );
    return tx;
  } catch (err) {
    throw new KyraaError(err);
  }
};

export {
  getTreasuryData,
  fetchTreasuryData,
  initMetaTreasury,
  updateFixedFeeForMetaTreasury,
  initMetaBlocksTreasury,
  updateMetaBlocksTreasury,
};
