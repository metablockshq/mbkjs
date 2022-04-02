import { getTokenDistributorProgram } from './factory';
import {
  ClaimApiArgs,
  DelegateTokensApiArgs,
  DelegateTokensArgs,
  InitTokenDistributorApiArgs,
  InitTokenDistributorArgs,
  TransferTokensApiArgs,
  TransferTokensArgs,
  UpdateDistributorApiArgs,
  UpdateDistributorArgs,
} from './types';
import * as anchor from '@project-serum/anchor';
import {
  getClaimInstruction,
  getDelegateTokensInstruction,
  getInitTokenDistributorInstruction,
  getTransferTokensInstruction,
  getUpdateDistributorInstruction,
} from './instructions';
import { getPdaKeys, PdaKeys } from './pda';
import { Transaction } from '@solana/web3.js';

const initTokenDistributorV1 = async (args: InitTokenDistributorApiArgs) => {
  try {
    const program = getTokenDistributorProgram(args.connection, args.wallet);

    const usersKey = args.wallet.publicKey;

    const initArgs: InitTokenDistributorArgs = {
      totalTokenAmount: new anchor.BN(args.totalTokenAmount),
      initialAuthorityTokens: new anchor.BN(args.initialAuthorityTokens),
      userClaimAmount: args.userClaimAmount,
      tokenExpiryDate: new anchor.BN(args.tokenExpiryDate),
    };

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const instruction = await getInitTokenDistributorInstruction(
      initArgs,
      program,
      pdaKeys,
      usersKey
    );

    const tx = new Transaction();
    tx.add(instruction);
    return await program.provider.send(tx, []);
  } catch (err) {
    throw err;
  }
};

const claimV1 = async (args: ClaimApiArgs) => {
  try {
    const program = getTokenDistributorProgram(args.connection, args.wallet);

    const usersKey = args.wallet.publicKey;
    const message = usersKey.toBytes();

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const edInstruction =
      anchor.web3.Ed25519Program.createInstructionWithPublicKey({
        message: message,
        publicKey: args.authority.toBytes(),
        signature: args.signature,
      });

    const instruction = await getClaimInstruction(
      args.signature,
      message,
      program,
      pdaKeys,
      usersKey
    );

    const tx = new Transaction();
    tx.add(edInstruction);
    tx.add(instruction);
    return await program.provider.send(tx, []);
  } catch (err) {
    throw err;
  }
};

const transferTokensV1 = async (transferArgs: TransferTokensApiArgs) => {
  try {
    const program = getTokenDistributorProgram(
      transferArgs.connection,
      transferArgs.wallet
    );

    const usersKey = transferArgs.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const args: TransferTokensArgs = {
      amount: new anchor.BN(transferArgs.amount),
    };

    const instruction = await getTransferTokensInstruction(
      args,
      transferArgs.recipientAuthority,
      program,
      pdaKeys,
      usersKey
    );

    const tx = new Transaction();
    tx.add(instruction);
    return await program.provider.send(tx, []);
  } catch (err) {
    throw err;
  }
};

const delegateTokensV1 = async (args: DelegateTokensApiArgs) => {
  try {
    const program = getTokenDistributorProgram(args.connection, args.wallet);

    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const delArgs: DelegateTokensArgs = {
      amount: new anchor.BN(args.amount),
    };

    const instruction = await getDelegateTokensInstruction(
      delArgs,
      args.delegateAuthority,
      program,
      pdaKeys,
      usersKey
    );

    const tx = new Transaction();
    tx.add(instruction);
    return await program.provider.send(tx, []);
  } catch (err) {
    throw err;
  }
};

const updateDistributorV1 = async (args: UpdateDistributorApiArgs) => {
  try {
    const program = getTokenDistributorProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const pdaKeys: PdaKeys = await getPdaKeys(usersKey);

    const updateArgs: UpdateDistributorArgs = {
      totalTokenAmount:
        args.totalTokenAmount == null
          ? null
          : new anchor.BN(args.totalTokenAmount),
      userClaimAmount:
        args.userClaimAmount == null ? null : args.userClaimAmount,
      tokenExpiryDate:
        args.tokenExpiryDate == null
          ? null
          : new anchor.BN(args.tokenExpiryDate),
    };

    const instruction = await getUpdateDistributorInstruction(
      updateArgs,
      program,
      pdaKeys,
      usersKey
    );

    const tx = new Transaction();
    tx.add(instruction);
    return await program.provider.send(tx, []);
  } catch (err) {
    throw err;
  }
};

export {
  initTokenDistributorV1,
  claimV1,
  transferTokensV1,
  delegateTokensV1,
  updateDistributorV1,
};
