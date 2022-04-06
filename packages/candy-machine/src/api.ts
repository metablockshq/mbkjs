import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { createCandyMachineV2Account, uuidFromConfigPubkey } from './accounts';
import { sendTransactions } from './connection';
import { getCandyMachineProgram } from './factory';
import { getMintNftInstructionAndSigners } from './instructions';
import {
  CandyMachineAccount,
  CandyMachineApiArgs,
  CreateCandyMachineApiArgs,
  MintNftApiArgs,
  SequenceType,
} from './types';

export const getCandyMachineState = async ({
  wallet,
  candyMachineId,
  connection,
}: CandyMachineApiArgs): Promise<CandyMachineAccount> => {
  const program = await getCandyMachineProgram(connection, wallet);

  const state: any = await program.account.candyMachine.fetch(candyMachineId);
  const itemsAvailable = state.data.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;

  return {
    id: candyMachineId,
    program,
    state: {
      authority: state.authority,
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      isSoldOut: itemsRemaining === 0,
      isActive: false,
      isPresale: false,
      isWhitelistOnly: false,
      goLiveDate: state.data.goLiveDate,
      treasury: state.wallet,
      tokenMint: state.tokenMint,
      gatekeeper: state.data.gatekeeper,
      endSettings: state.data.endSettings,
      whitelistMintSettings: state.data.whitelistMintSettings,
      hiddenSettings: state.data.hiddenSettings,
      price: state.data.price,
      retainAuthority: state.data.retainAuthority,
    },
  };
};

export const createCandyMachineV2 = async ({
  connection,
  wallet,
  treasuryWallet,
  splToken,
  candyData,
}: CreateCandyMachineApiArgs): Promise<{
  candyMachine: PublicKey;
  uuid: string;
  txId: string;
}> => {
  const anchorProgram = await getCandyMachineProgram(connection, wallet);

  const candyAccount = Keypair.generate();
  candyData.uuid = uuidFromConfigPubkey(candyAccount.publicKey);

  if (!candyData.symbol) {
    throw new Error(`Invalid config, there must be a symbol.`);
  }

  if (!candyData.creators || candyData.creators.length === 0) {
    throw new Error(`Invalid config, there must be at least one creator.`);
  }

  const totalShare = (candyData.creators || []).reduce(
    (acc, curr) => acc + curr.share,
    0
  );

  if (totalShare !== 100) {
    throw new Error(`Invalid config, creators shares must add up to 100`);
  }

  const remainingAccounts = [];
  if (splToken) {
    remainingAccounts.push({
      pubkey: splToken,
      isSigner: false,
      isWritable: false,
    });
  }

  const buildInitializeCandyMachine = anchorProgram.methods
    .initializeCandyMachine(candyData)
    .accounts({
      candyMachine: candyAccount.publicKey,
      wallet: treasuryWallet,
      authority: wallet.publicKey,
      payer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .preInstructions([
      await createCandyMachineV2Account(
        anchorProgram,
        candyData,
        wallet.publicKey,
        candyAccount.publicKey
      ),
    ])
    .signers([candyAccount]);

  if (remainingAccounts.length > 0) {
    buildInitializeCandyMachine.remainingAccounts(remainingAccounts);
  }

  return {
    candyMachine: candyAccount.publicKey,
    uuid: candyData.uuid,
    txId: await buildInitializeCandyMachine.rpc(),
  };
};

export const mintOneNft = async ({
  connection,
  wallet,
  candyMachine,
}: MintNftApiArgs) => {
  const beforeTransactions: Transaction[] = [];
  const afterTransactions: Transaction[] = [];

  const { instructionsMatrix, signersMatrix } =
    await getMintNftInstructionAndSigners(candyMachine, wallet.publicKey);

  try {
    return (
      await sendTransactions(
        connection,
        wallet,
        instructionsMatrix,
        signersMatrix,
        SequenceType.StopOnFailure,
        'singleGossip',
        () => {},
        () => false,
        undefined,
        beforeTransactions,
        afterTransactions
      )
    ).txs.map((t: any) => t.txid);
  } catch (err) {
    throw err;
  }
};
