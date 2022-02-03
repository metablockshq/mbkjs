import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  computeDepositNftParams,
  computeInitDepositNftParams,
  computeInitReceiptMintParams,
  computeTransferReceiptNftParams,
  computeWithdrawNftParams,
} from "./paramsBuilder";

interface InstructionArgs {
  program: Program;
  usersKey: PublicKey;
  mintKey: PublicKey;
  universeKey: PublicKey;
  url?: string;
  isReceiptMasterEdition?: boolean;
}

const getInitReceiptMintInstruction = async (args: InstructionArgs) => {
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

const getInitDepositNftInstruction = async (args: InstructionArgs) => {
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

const getDepositNftInstruction = async (args: InstructionArgs) => {
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
  args: InstructionArgs
) => {
  const { transferReceiptArgs, transferReceiptNftAccounts } =
    await computeTransferReceiptNftParams({
      usersKey: args.usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
      url: args.url,
      isReceiptMasterEdition: args.isReceiptMasterEdition,
    });
  return args.program.instruction.transferReceiptNftToUserV1(
    transferReceiptArgs,
    {
      accounts: transferReceiptNftAccounts,
    }
  );
};

const getWithdrawNftInstruction = async (args: InstructionArgs) => {
  const { withdrawNftArgs, withdrawNftAccounts } =
    await computeWithdrawNftParams({
      usersKey: args.usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });

  return args.program.instruction.withdrawNftV1(
    withdrawNftArgs.userNftBump,
    withdrawNftArgs.vaultAuthorityBump,
    { accounts: withdrawNftAccounts }
  );
};

export {
  getInitReceiptMintInstruction,
  getInitDepositNftInstruction,
  getDepositNftInstruction,
  getTransferReceiptNftToUserInstruction,
  getWithdrawNftInstruction,
};
