import { BN, Program } from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';
import { KyraaError } from './error';
import { getMetaTreasuryProgram } from './factory';
import {
  getInitMetaTreasuryInstruction,
  getUpdateFixedFeeForMetaTreasuryInstruction,
} from './instructions/treasuryInstructions';
import { findMetaTreasuryAddress } from './pda';
import {
  GetMetaTreasuryApiArgs,
  InitializeMetaTreasuryApiArgs,
  UpdateFixedFeeForMetaTreasuryApiArgs,
} from './types';
import { MetaTreasury } from './types/meta_treasury';

const getTreasuryData = async (args: GetMetaTreasuryApiArgs) => {
  const program = getMetaTreasuryProgram(args.connection, args.wallet);
  return fetchTreasuryData(program);
};

const fetchTreasuryData = async (program: Program<MetaTreasury>) => {
  const [treasuryMetaAddress, _] = await findMetaTreasuryAddress();

  const result = await program.account.treasury.fetch(treasuryMetaAddress);

  // return await program.methods
  //   .getTreasury()
  //   .accounts({
  //     treasury: treasuryMetaAddress,
  //   })
  //   .view();

  return result;
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
      //metaBlocksProgram: metaBlocksProgram,
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
      //metaBlocksProgram: metaBlocksProgram,
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

export {
  getTreasuryData,
  fetchTreasuryData,
  initMetaTreasury,
  updateFixedFeeForMetaTreasury,
};
