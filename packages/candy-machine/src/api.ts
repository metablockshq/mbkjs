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
  CandyMachineState,
  CreateCandyMachineApiArgs,
  MintNftApiArgs,
  SequenceType,
} from './types';

const getCandyMachineV2State = async ({
  wallet,
  candyMachineId,
  connection,
}: CandyMachineApiArgs): Promise<CandyMachineAccount> => {
  try {
    const program = await getCandyMachineProgram(connection, wallet);

    const state: any = await program.account.candyMachine.fetch(candyMachineId);
    const itemsAvailable = state.data.itemsAvailable.toNumber();
    const itemsRedeemed = state.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;

    const isWhitelistOnly =
      state.data.whitelistMintSettings &&
      state.data.whitelistMintSettings.presale == false;

    return {
      id: candyMachineId,
      program,
      state: {
        authority: state.authority,
        itemsAvailable,
        itemsRedeemed,
        itemsRemaining,
        isSoldOut: itemsRemaining === 0,
        isActive:
          itemsRemaining > 0 || state.goLiveDate <= new Date().getTime() / 1000,
        isPresale:
          state.data.whitelistMintSettings != null
            ? state.data.whitelistMintSettings.presale
            : null,
        isWhitelistOnly: isWhitelistOnly,
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
  } catch (err) {
    throw err;
  }
};

const createCandyMachineV2 = async ({
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
  try {
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
  } catch (err) {
    throw err;
  }
};

const mintOneCandyMachineV2Nft = async ({
  connection,
  wallet,
  candyMachineId,
}: MintNftApiArgs) => {
  try {
    const beforeTransactions: Transaction[] = [];
    const afterTransactions: Transaction[] = [];

    const rawCandyMachineState = await getCandyMachineV2State({
      wallet,
      candyMachineId,
      connection,
    });

    const candyMachineState: CandyMachineState = {
      authority: rawCandyMachineState.state.authority,
      itemsAvailable: rawCandyMachineState.state.itemsAvailable,
      itemsRedeemed: rawCandyMachineState.state.itemsRedeemed,
      itemsRemaining: rawCandyMachineState.state.itemsRemaining,
      treasury: rawCandyMachineState.state.treasury,
      tokenMint: rawCandyMachineState.state.tokenMint,
      isSoldOut: rawCandyMachineState.state.isSoldOut,
      isActive: rawCandyMachineState.state.isActive,
      isPresale: rawCandyMachineState.state.isPresale,
      isWhitelistOnly: rawCandyMachineState.state.isWhitelistOnly,
      goLiveDate: rawCandyMachineState.state.goLiveDate,
      price: rawCandyMachineState.state.price,
      gatekeeper: rawCandyMachineState.state.gatekeeper,
      endSettings: rawCandyMachineState.state.endSettings,
      whitelistMintSettings: rawCandyMachineState.state.whitelistMintSettings,
      hiddenSettings: rawCandyMachineState.state.hiddenSettings,
      retainAuthority: rawCandyMachineState.state.retainAuthority,
    };

    const program = await getCandyMachineProgram(connection, wallet);

    const candyMachine: CandyMachineAccount = {
      id: candyMachineId,
      program: program,
      state: candyMachineState,
    };

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
  } catch (err) {
    throw err;
  }
};

export {
  mintOneCandyMachineV2Nft,
  createCandyMachineV2,
  getCandyMachineV2State,
};
