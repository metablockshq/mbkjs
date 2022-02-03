import { getMetaBlocksProgram } from "./factory";
import {
  computeCreateUniverseParams,
  computeGroupedDepositNftParams,
  computeUpdateUniverseParams,
} from "./paramsBuilder";

import { Transaction } from "@solana/web3.js";
import {
  getDepositNftInstruction,
  getInitDepositNftInstruction,
  getInitReceiptMintInstruction,
  getTransferReceiptNftToUserInstruction,
} from "./instructions";

const createUniverseV1 = async ({
  connection,
  wallet,
  name,
  description,
  websiteUrl,
}) => {
  const program = getMetaBlocksProgram(connection, wallet);

  const { universeKey, universeBump, accounts } =
    await computeCreateUniverseParams({
      usersKey: wallet.publicKey,
    });

  try {
    const tx = await program.rpc.createUniverseV1(
      universeBump,
      name,
      description,
      websiteUrl,
      { accounts, signers: [] }
    );
    return tx;
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
    console.log(universeKey);
  }
};

const updateUniverseV1 = async ({
  connection,
  wallet,
  name,
  description,
  websiteUrl,
}) => {
  const program = getMetaBlocksProgram(connection, wallet);

  const { universeKey, accounts, updateUniverseArgs } =
    await computeUpdateUniverseParams({
      usersKey: wallet.publicKey,
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    });

  try {
    const tx = await program.rpc.updateUniverseV1(updateUniverseArgs, {
      accounts,
      signers: [],
    });
    return tx;
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
    console.log(universeKey);
  }
};

const initReceiptMintV1 = async ({
  connection,
  wallet,
  usersKey,
  mintKey,
  universeKey,
}) => {
  try {
    const program = getMetaBlocksProgram(connection, wallet);
    const initReceiptMintInstruction = await getInitReceiptMintInstruction({
      program,
      usersKey,
      mintKey,
      universeKey,
    });
    const transaction = new Transaction();
    transaction.add(initReceiptMintInstruction);

    const tx = await program.provider.send(transaction, []);
    return tx;
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
  }
};

const initDepositNftV1 = async ({
  connection,
  wallet,
  usersKey,
  mintKey,
  universeKey,
}) => {
  try {
    const program = getMetaBlocksProgram(connection, wallet);
    const initDepositNftInstruction = await getInitDepositNftInstruction({
      program,
      usersKey,
      mintKey,
      universeKey,
    });
    const transaction = new Transaction();
    transaction.add(initDepositNftInstruction);

    return await program.provider.send(transaction, []);
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
  }
};

const depositNftV1 = async ({
  connection,
  wallet,
  usersKey,
  mintKey,
  universeKey,
}) => {
  try {
    const program = getMetaBlocksProgram(connection, wallet);
    const depositNftInstruction = await getDepositNftInstruction({
      program,
      usersKey,
      mintKey,
      universeKey,
    });
    const transaction = new Transaction();
    transaction.add(depositNftInstruction);

    return await program.provider.send(transaction, []);
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
  }
};

const transferReceiptNftToUserV1 = async ({
  connection,
  wallet,
  usersKey,
  mintKey,
  universeKey,
  url,
  isReceiptMasterEdition,
}) => {
  try {
    const program = getMetaBlocksProgram(connection, wallet);
    const transferReceiptNftToUserInstruction =
      await getTransferReceiptNftToUserInstruction({
        program,
        usersKey,
        mintKey,
        universeKey,
        url,
        isReceiptMasterEdition,
      });
    const transaction = new Transaction();
    transaction.add(transferReceiptNftToUserInstruction);

    const tx = await program.provider.send(transaction, []);
    return tx;
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
  }
};

const groupedDepositNftV1 = async ({
  connection,
  wallet,
  usersKey,
  mintKey,
  universeKey,
  receiptNftUrl,
  isReceiptMasterEdition,
}) => {
  try {
    const program = getMetaBlocksProgram(connection, wallet);

    const {
      initReceiptMint: { initReceiptMintArgs, initReceiptMintAccounts },
      initDepositNft: { initDepositNftArgs, initDepositNftAccounts },
      depositNft: { depositNftArgs, depositNftAccounts },
      transferReceiptNft: {
        transferReceiptNftArgs,
        transferReceiptNftAccounts,
      },
    } = await computeGroupedDepositNftParams({
      usersKey,
      mintKey,
      universeKey,
      receiptNftUrl,
      isReceiptMasterEdition,
    });

    const initReceiptMintInstruction = program.instruction.initReceiptMintV1(
      initReceiptMintArgs,
      {
        accounts: initReceiptMintAccounts,
      }
    );

    const initDepositNftInstruction = program.instruction.initDepositNftV1(
      initDepositNftArgs,
      {
        accounts: initDepositNftAccounts,
      }
    );

    const transaction1 = new Transaction();
    transaction1.add(initReceiptMintInstruction);
    transaction1.add(initDepositNftInstruction);
    const tx1 = await program.provider.send(transaction1, []);

    const depositNftInstruction = program.instruction.depositNftV1(
      depositNftArgs,
      {
        accounts: depositNftAccounts,
      }
    );
    const transferReceiptNftToUserInstruction =
      program.instruction.transferReceiptNftToUserV1(transferReceiptNftArgs, {
        accounts: transferReceiptNftAccounts,
      });

    const transaction2 = new Transaction();
    transaction2.add(depositNftInstruction);
    transaction2.add(transferReceiptNftToUserInstruction);
    const tx2 = await program.provider.send(transaction2, []);

    return { tx1, tx2 };
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
  }
};

const withdrawNftV1 = async ({
  connection,
  wallet,
  usersKey,
  mintKey,
  universeKey,
}) => {
  try {
    const program = getMetaBlocksProgram(connection, wallet);
    const withdrawNftInstruction = await getWithdrawNftInstruction({
      program,
      usersKey,
      mintKey,
      universeKey,
    });
    const transaction = new Transaction();
    transaction.add(withdrawNftInstruction);

    return await program.provider.send(transaction, []);
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
  }
};

export {
  createUniverseV1,
  updateUniverseV1,
  initReceiptMintV1,
  initDepositNftV1,
  depositNftV1,
  transferReceiptNftToUserV1,
  groupedDepositNftV1,
  withdrawNftV1,
};
