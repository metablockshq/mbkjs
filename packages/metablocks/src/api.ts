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
  getWithdrawNftInstruction,
} from "./instructions";
import {
  DepositNftArgs,
  GroupedDepositNftArgs,
  InitDepositNftArgs,
  InitReceiptMintArgs,
  TransferReceiptNftArgs,
  UniverseArgs,
  WithdrawNftArgs,
} from "./types/types";

const createUniverseV1 = async (args: UniverseArgs) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  const usersKey = args.wallet.publicKey;
  const { createUniverseArgs, accounts } = await computeCreateUniverseParams({
    usersKey: usersKey,
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  });

  try {
    const tx = await program.rpc.createUniverseV1(createUniverseArgs, {
      accounts,
      signers: [],
    });
    return tx;
  } catch (e) {
    throw e;
  }
};

const updateUniverseV1 = async (args: UniverseArgs) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  const usersKey = args.wallet.publicKey;
  const { accounts, updateUniverseArgs } = await computeUpdateUniverseParams({
    usersKey: usersKey,
    name: args.name,
    description: args.description,
    websiteUrl: args.websiteUrl,
  });

  try {
    const tx = await program.rpc.updateUniverseV1(updateUniverseArgs, {
      accounts,
      signers: [],
    });
    return tx;
  } catch (e) {
    throw e;
  }
};

const initReceiptMintV1 = async (args: InitReceiptMintArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;
    const initReceiptMintInstruction = await getInitReceiptMintInstruction({
      program: program,
      usersKey: usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });
    const transaction = new Transaction();
    transaction.add(initReceiptMintInstruction);

    const tx = await program.provider.send(transaction, []);
    return tx;
  } catch (e) {
    throw e;
  }
};

const initDepositNftV1 = async (args: InitDepositNftArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;
    const initDepositNftInstruction = await getInitDepositNftInstruction({
      program: program,
      usersKey: usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });
    const transaction = new Transaction();
    transaction.add(initDepositNftInstruction);

    return await program.provider.send(transaction, []);
  } catch (e) {
    throw e;
  }
};

const depositNftV1 = async (args: DepositNftArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;
    const depositNftInstruction = await getDepositNftInstruction({
      program: program,
      usersKey: usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });
    const transaction = new Transaction();
    transaction.add(depositNftInstruction);

    return await program.provider.send(transaction, []);
  } catch (e) {
    throw e;
  }
};

const transferReceiptNftToUserV1 = async (args: TransferReceiptNftArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;
    const transferReceiptNftToUserInstruction =
      await getTransferReceiptNftToUserInstruction({
        program: program,
        usersKey: usersKey,
        mintKey: args.mintKey,
        universeKey: args.universeKey,
        url: args.url,
        isReceiptMasterEdition: args.isReceiptMasterEdition,
      });
    const transaction = new Transaction();
    transaction.add(transferReceiptNftToUserInstruction);

    const tx = await program.provider.send(transaction, []);
    return tx;
  } catch (e) {
    throw e;
  }
};

const groupedDepositNftV1 = async (args: GroupedDepositNftArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;

    const {
      initReceiptMint: { initReceiptMintArgs, initReceiptMintAccounts },
      initDepositNft: { initDepositNftArgs, initDepositNftAccounts },
      depositNft: { depositNftArgs, depositNftAccounts },
      transferReceiptNft: {
        transferReceiptNftArgs,
        transferReceiptNftAccounts,
      },
    } = await computeGroupedDepositNftParams({
      usersKey: usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
      url: args.url,
      isReceiptMasterEdition: args.isReceiptMasterEdition,
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
    throw e;
  }
};

const withdrawNftV1 = async (args: WithdrawNftArgs) => {
  try {
    const program = getMetaBlocksProgram(args.connection, args.wallet);
    const usersKey = args.wallet.publicKey;
    const withdrawNftInstruction = await getWithdrawNftInstruction({
      program: program,
      usersKey: usersKey,
      mintKey: args.mintKey,
      universeKey: args.universeKey,
    });
    const transaction = new Transaction();
    transaction.add(withdrawNftInstruction);

    return await program.provider.send(transaction, []);
  } catch (e) {
    throw e;
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
