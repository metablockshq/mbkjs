import {
  computeDepositNftParams,
  computeInitDepositNftParams,
  computeInitReceiptMintParams,
  computeTransferReceiptNftParams,
  computeWithdrawNftParams,
} from "./paramsBuilder";

const getInitReceiptMintInstruction = async ({
  program,
  usersKey,
  mintKey,
  universeKey,
}) => {
  const { initReceiptMintArgs, initReceiptMintAccounts } =
    await computeInitReceiptMintParams({ usersKey, mintKey, universeKey });

  return program.instruction.initReceiptMintV1(initReceiptMintArgs, {
    accounts: initReceiptMintAccounts,
  });
};

const getInitDepositNftInstruction = async ({
  program,
  usersKey,
  mintKey,
  universeKey,
}) => {
  const { initDepositArgs, initDepositAccounts } =
    await computeInitDepositNftParams({ usersKey, mintKey, universeKey });

  return program.instruction.initDepositNftV1(initDepositArgs, {
    accounts: initDepositAccounts,
  });
};

const getDepositNftInstruction = async ({
  program,
  usersKey,
  mintKey,
  universeKey,
}) => {
  const { depositNftArgs, depositNftAccounts } = await computeDepositNftParams({
    usersKey,
    mintKey,
    universeKey,
  });
  return program.instruction.depositNftV1(depositNftArgs, {
    accounts: depositNftAccounts,
  });
};

const getTransferReceiptNftToUserInstruction = async ({
  program,
  usersKey,
  mintKey,
  universeKey,
  url,
  isReceiptMasterEdition,
}) => {
  const { transferReceiptArgs, transferReceiptNftAccounts } =
    await computeTransferReceiptNftParams({
      usersKey,
      mintKey,
      universeKey,
      url,
      isReceiptMasterEdition,
    });
  return program.instruction.transferReceiptNftToUserV1(transferReceiptArgs, {
    accounts: transferReceiptNftAccounts,
  });
};

const getWithdrawNftInstruction = async ({
  program,
  usersKey,
  mintKey,
  universeKey,
}) => {
  const { withdrawNftArgs, withdrawNftAccounts } =
    await computeWithdrawNftParams({ usersKey, mintKey, universeKey });

  return program.instruction.withdrawNftV1(
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
