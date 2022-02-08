import {
  computeDepositNftParams,
  computeInitDepositNftParams,
  computeInitReceiptMintParams,
  computeTransferReceiptNftParams,
  computeWithdrawNftParams,
} from './paramsBuilder';
import {
  DepositNftInstructionArgs,
  InitDepositNftInstructionArgs,
  InitReceiptMintInstructionArgs,
  TransferReceiptNftInstructionArgs,
  WithdrawNftInstructionArgs,
} from './types/types';

const getInitReceiptMintInstruction = async (
  args: InitReceiptMintInstructionArgs
) => {
  const { initReceiptMintArgs, initReceiptMintAccounts } =
    await computeInitReceiptMintParams({
      usersKey: args.usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });

  return args.program.instruction.initReceiptMintV1(initReceiptMintArgs, {
    accounts: initReceiptMintAccounts,
  });
};

const getInitDepositNftInstruction = async (
  args: InitDepositNftInstructionArgs
) => {
  const { initDepositArgs, initDepositAccounts } =
    await computeInitDepositNftParams({
      usersKey: args.usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });

  return args.program.instruction.initDepositNftV1(initDepositArgs, {
    accounts: initDepositAccounts,
  });
};

const getDepositNftInstruction = async (args: DepositNftInstructionArgs) => {
  const { depositNftArgs, depositNftAccounts } = await computeDepositNftParams({
    usersKey: args.usersKey,
    mintKey: args.mintKey,
    universeKey: args.universeKey,
  });
  return args.program.instruction.depositNftV1(depositNftArgs, {
    accounts: depositNftAccounts,
  });
};

const getTransferReceiptNftToUserInstruction = async (
  args: TransferReceiptNftInstructionArgs
) => {
  const { transferReceiptNftArgs, transferReceiptNftAccounts } =
    await computeTransferReceiptNftParams({
      usersKey: args.usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
      url: args.url,
      isReceiptMasterEdition: args.isReceiptMasterEdition,
    });
  return args.program.instruction.transferReceiptNftToUserV1(
    transferReceiptNftArgs,
    {
      accounts: transferReceiptNftAccounts,
    }
  );
};

const getWithdrawNftInstruction = async (args: WithdrawNftInstructionArgs) => {
  const { withdrawNftArgs, withdrawNftAccounts } =
    await computeWithdrawNftParams({
      usersKey: args.usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });

  return args.program.instruction.withdrawNftV1(withdrawNftArgs, {
    accounts: withdrawNftAccounts,
  });
};

export {
  getInitReceiptMintInstruction,
  getInitDepositNftInstruction,
  getDepositNftInstruction,
  getTransferReceiptNftToUserInstruction,
  getWithdrawNftInstruction,
};
