import * as anchor from '@project-serum/anchor';
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram, SYSVAR_SLOT_HASHES_PUBKEY } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  getAtaForMint,
  getCandyMachineCreator,
  getCollectionAuthorityRecordPDA,
  getCollectionPDA,
  getMasterEdition,
  getMetadata,
  getNetworkExpire,
  getNetworkToken,
} from './accounts';
import { CIVIC, TOKEN_METADATA_PROGRAM_ID } from './constants';
import { CandyMachineAccount, CollectionData } from './types';

import log from 'loglevel';

export const getMintNftInstructionAndSigners = async (
  candyMachine: CandyMachineAccount,
  payer: anchor.web3.PublicKey
): Promise<{
  instructionsMatrix: anchor.web3.TransactionInstruction[][];
  signersMatrix: anchor.web3.Keypair[][];
}> => {
  const mint = anchor.web3.Keypair.generate();

  const userTokenAccountAddress = (
    await getAtaForMint(mint.publicKey, payer)
  )[0];

  const userPayingAccountAddress = candyMachine.state.tokenMint
    ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0]
    : payer;

  const candyMachineAddress = candyMachine.id;

  const remainingAccounts = [];
  const signers: anchor.web3.Keypair[] = [mint];
  const cleanupInstructions = [];
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports:
        await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
          MintLayout.span
        ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      payer,
      payer
    ),
    createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      payer,
      payer,
      mint.publicKey
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      payer,
      [],
      1
    ),
  ];

  if (candyMachine.state.gatekeeper) {
    remainingAccounts.push({
      pubkey: (
        await getNetworkToken(
          payer,
          candyMachine.state.gatekeeper.gatekeeperNetwork
        )
      )[0],
      isWritable: true,
      isSigner: false,
    });

    if (candyMachine.state.gatekeeper.expireOnUse) {
      remainingAccounts.push({
        pubkey: CIVIC,
        isWritable: false,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: (
          await getNetworkExpire(
            candyMachine.state.gatekeeper.gatekeeperNetwork
          )
        )[0],
        isWritable: false,
        isSigner: false,
      });
    }
  }
  if (candyMachine.state.whitelistMintSettings) {
    const mint = new anchor.web3.PublicKey(
      candyMachine.state.whitelistMintSettings.mint
    );

    const whitelistToken = (await getAtaForMint(mint, payer))[0];
    remainingAccounts.push({
      pubkey: whitelistToken,
      isWritable: true,
      isSigner: false,
    });

    if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
      const whitelistBurnAuthority = anchor.web3.Keypair.generate();

      remainingAccounts.push({
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: whitelistBurnAuthority.publicKey,
        isWritable: false,
        isSigner: true,
      });
      signers.push(whitelistBurnAuthority);
      const exists =
        await candyMachine.program.provider.connection.getAccountInfo(
          whitelistToken
        );
      if (exists) {
        instructions.push(
          Token.createApproveInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            whitelistBurnAuthority.publicKey,
            payer,
            [],
            1
          )
        );
        cleanupInstructions.push(
          Token.createRevokeInstruction(
            TOKEN_PROGRAM_ID,
            whitelistToken,
            payer,
            []
          )
        );
      }
    }
  }

  if (candyMachine.state.tokenMint) {
    const transferAuthority = anchor.web3.Keypair.generate();

    signers.push(transferAuthority);
    remainingAccounts.push({
      pubkey: userPayingAccountAddress,
      isWritable: true,
      isSigner: false,
    });
    remainingAccounts.push({
      pubkey: transferAuthority.publicKey,
      isWritable: false,
      isSigner: true,
    });

    instructions.push(
      Token.createApproveInstruction(
        TOKEN_PROGRAM_ID,
        userPayingAccountAddress,
        transferAuthority.publicKey,
        payer,
        [],
        candyMachine.state.price.toNumber()
      )
    );
    cleanupInstructions.push(
      Token.createRevokeInstruction(
        TOKEN_PROGRAM_ID,
        userPayingAccountAddress,
        payer,
        []
      )
    );
  }
  const metadataAddress = await getMetadata(mint.publicKey);
  const masterEdition = await getMasterEdition(mint.publicKey);

  const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
    candyMachineAddress
  );

  log.info(remainingAccounts.map((rm) => rm.pubkey.toBase58()));

  const buildMintNftInstruction = candyMachine.program.methods
    .mintNft(creatorBump)
    .accounts({
      candyMachine: candyMachineAddress,
      candyMachineCreator,
      payer: payer,
      wallet: candyMachine.state.treasury,
      mint: mint.publicKey,
      metadata: metadataAddress,
      masterEdition,
      mintAuthority: payer,
      updateAuthority: payer,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      recentBlockhashes: SYSVAR_SLOT_HASHES_PUBKEY,
      instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
    });

  if (remainingAccounts.length > 0) {
    buildMintNftInstruction.remainingAccounts(remainingAccounts);
  }

  const mintNftInstruction = await buildMintNftInstruction.instruction();

  instructions.push(mintNftInstruction);

  const [collectionPDA] = await getCollectionPDA(candyMachineAddress);
  const collectionPDAAccount =
    await candyMachine.program.provider.connection.getAccountInfo(
      collectionPDA
    );

  if (collectionPDAAccount && candyMachine.state.retainAuthority) {
    try {
      const collectionData =
        (await candyMachine.program.account.collectionPda.fetch(
          collectionPDA
        )) as CollectionData;
      log.info(collectionData);
      const collectionMint = collectionData.mint;
      const collectionAuthorityRecord = await getCollectionAuthorityRecordPDA(
        collectionMint,
        collectionPDA
      );
      log.info(collectionMint);
      if (collectionMint) {
        const collectionMetadata = await getMetadata(collectionMint);
        const collectionMasterEdition = await getMasterEdition(collectionMint);
        log.info('Collection PDA: ', collectionPDA.toBase58());
        log.info('Authority: ', candyMachine.state.authority.toBase58());
        instructions.push(
          await candyMachine.program.methods
            .setCollectionDuringMint()
            .accounts({
              candyMachine: candyMachineAddress,
              metadata: metadataAddress,
              payer: payer,
              collectionPda: collectionPDA,
              tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
              instructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
              collectionMint,
              collectionMetadata,
              collectionMasterEdition,
              authority: candyMachine.state.authority,
              collectionAuthorityRecord,
            })
            .instruction()
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  const instructionsMatrix: anchor.web3.TransactionInstruction[][] = [];
  const signersMatrix: anchor.web3.Keypair[][] = [];

  const state = candyMachine.state;
  const txnEstimate =
    892 +
    (collectionPDAAccount && state.retainAuthority ? 182 : 0) +
    (state.tokenMint ? 177 : 0) +
    (state.whitelistMintSettings ? 33 : 0) +
    (state.whitelistMintSettings?.mode?.burnEveryTime ? 145 : 0) +
    (state.gatekeeper ? 33 : 0) +
    (state.gatekeeper?.expireOnUse ? 66 : 0);

  const INIT_INSTRUCTIONS_LENGTH = 4;
  const INIT_SIGNERS_LENGTH = 1;

  log.info('Transaction estimate: ', txnEstimate);
  if (txnEstimate > 1230) {
    const initInstructions = instructions.splice(0, INIT_INSTRUCTIONS_LENGTH);
    log.info(initInstructions);
    instructionsMatrix.push(initInstructions);
    const initSigners = signers.splice(0, INIT_SIGNERS_LENGTH);
    signersMatrix.push(initSigners);
  }

  instructionsMatrix.push(instructions);
  signersMatrix.push(signers);

  if (cleanupInstructions.length > 0) {
    instructionsMatrix.push(cleanupInstructions);
    signersMatrix.push([]);
  }

  return {
    instructionsMatrix,
    signersMatrix,
  };
};
