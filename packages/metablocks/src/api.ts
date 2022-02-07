import { getMetaBlocksProgram } from './factory';
import {
  computeCreateUniverseParams,
  computeGroupedDepositNftParams,
  computeUpdateUniverseParams,
} from './paramsBuilder';
import { Transaction } from '@solana/web3.js';
import {
  getDepositNftInstruction,
  getInitDepositNftInstruction,
  getInitReceiptMintInstruction,
  getTransferReceiptNftToUserInstruction,
  getWithdrawNftInstruction,
} from './instructions';
import {
  DepositNftApiArgs,
  FetchAccountArgs,
  GroupedDepositNftApiArgs,
  InitDepositNftApiArgs,
  InitReceiptMintApiArgs,
  SendTxRequest,
  TransferReceiptNftApiArgs,
  UniverseApiArgs,
  WithdrawNftApiArgs,
} from './types/types';
import { accounts_api } from '.';

const createUniverse = async (args: UniverseApiArgs) => {
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

const updateUniverse = async (args: UniverseApiArgs) => {
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

const initReceiptMint = async (args: InitReceiptMintApiArgs) => {
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

const initDepositNft = async (args: InitDepositNftApiArgs) => {
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

const depositNft = async (args: DepositNftApiArgs) => {
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

const transferReceiptNftToUser = async (args: TransferReceiptNftApiArgs) => {
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

const groupedDepositNft = async (args: GroupedDepositNftApiArgs) => {
  try {
    const sendTxRequests: Array<SendTxRequest> = [];

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

    // transaction 1
    sendTxRequests.push({
      tx: transaction1,
      signers: [],
    });

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

    transaction2;
    sendTxRequests.push({
      tx: transaction2,
      signers: [],
    });

    const [tx1, tx2] = await program.provider.sendAll(sendTxRequests);

    return { tx1, tx2 };
  } catch (e) {
    throw e;
  }
};

const withdrawNft = async (args: WithdrawNftApiArgs) => {
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

// Get all Universes
const getAllUniverses = async (args: FetchAccountArgs) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  return await accounts_api.getAllUniverses(program);
};
// Get All user nfts
const getAllUserNfts = async (args: FetchAccountArgs) => {
  const program = getMetaBlocksProgram(args.connection, args.wallet);
  return await accounts_api.getAllUserNfts(program);
};

export {
  createUniverse,
  updateUniverse,
  initReceiptMint,
  initDepositNft,
  depositNft,
  transferReceiptNftToUser,
  groupedDepositNft,
  withdrawNft,
  getAllUniverses,
  getAllUserNfts,
};
