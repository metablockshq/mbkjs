import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';

import * as anchor from '@project-serum/anchor';
import fs from 'fs';
import { Program, web3 } from '@project-serum/anchor';
import log from 'loglevel';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  CANDY_MACHINE,
  CANDY_MACHINE_PROGRAM_V2_ID,
  CIVIC,
  CONFIG_ARRAY_START_V2,
  CONFIG_LINE_SIZE_V2,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  WRAPPED_SOL_MINT,
} from './constants';
import { CandyMachineData } from './types';

export function uuidFromConfigPubkey(configAccount: PublicKey) {
  return configAccount.toBase58().slice(0, 6);
}

export const getTokenWallet = async function (
  wallet: PublicKey,
  mint: PublicKey
) {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
};

export const deriveCandyMachineV2ProgramAddress = async (
  candyMachineId: anchor.web3.PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), candyMachineId.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID
  );
};

export const getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID
  );
};

export const getAtaForMint = async (
  mint: anchor.web3.PublicKey,
  buyer: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

export const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getCollectionPDA = async (
  candyMachineAddress: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('collection'), candyMachineAddress.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID
  );
};

export const getCollectionAuthorityRecordPDA = async (
  mint: anchor.web3.PublicKey,
  newAuthority: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('collection_authority'),
        newAuthority.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getMasterEdition = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getEditionMarkPda = async (
  mint: anchor.web3.PublicKey,
  edition: number
): Promise<anchor.web3.PublicKey> => {
  const editionNumber = Math.floor(edition / 248);
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
        Buffer.from(editionNumber.toString()),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export function loadWalletKey(keypair: any): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!');
  }
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString()))
  );
  log.info(`wallet public key: ${loaded.publicKey}`);
  return loaded;
}

export async function loadCandyProgramV2(
  walletKeyPair: Keypair,
  env: string,
  customRpcUrl?: string
) {
  if (customRpcUrl) log.info('USING CUSTOM URL', customRpcUrl);

  // @ts-ignore
  const solConnection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || getCluster(env)
  );

  const walletWrapper = new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(
    CANDY_MACHINE_PROGRAM_V2_ID,
    provider
  );

  if (idl == null) {
    throw new Error('Could not fetch the program');
  }
  const program = new anchor.Program(
    idl,
    CANDY_MACHINE_PROGRAM_V2_ID,
    provider
  );
  log.debug('program id from anchor', program.programId.toBase58());
  return program;
}

export async function getTokenAmount(
  anchorProgram: anchor.Program,
  account: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
): Promise<number> {
  let amount = 0;
  if (!mint.equals(WRAPPED_SOL_MINT)) {
    try {
      const token =
        await anchorProgram.provider.connection.getTokenAccountBalance(account);
      // @ts-ignore
      amount = token.value.uiAmount * Math.pow(10, token.value.decimals);
    } catch (e) {
      log.error(e);
      log.info(
        'Account ',
        account.toBase58(),
        'didnt return value. Assuming 0 tokens.'
      );
    }
  } else {
    amount = await anchorProgram.provider.connection.getBalance(account);
  }
  return amount;
}

export const getBalance = async (
  account: anchor.web3.PublicKey,
  env: string,
  customRpcUrl?: string
): Promise<number> => {
  if (customRpcUrl) log.info('USING CUSTOM URL', customRpcUrl);
  const connection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || getCluster(env)
  );
  return await connection.getBalance(account);
};

export async function createCandyMachineV2Account(
  anchorProgram: Program,
  candyData: CandyMachineData,
  payerWallet: any,
  candyAccount: PublicKey
) {
  const size =
    CONFIG_ARRAY_START_V2 +
    4 +
    candyData.itemsAvailable.toNumber() * CONFIG_LINE_SIZE_V2 +
    8 +
    2 * (Math.floor(candyData.itemsAvailable.toNumber() / 8) + 1);

  return anchor.web3.SystemProgram.createAccount({
    fromPubkey: payerWallet,
    newAccountPubkey: candyAccount,
    space: size,
    lamports:
      await anchorProgram.provider.connection.getMinimumBalanceForRentExemption(
        size
      ),
    programId: CANDY_MACHINE_PROGRAM_V2_ID,
  });
}

export function createAssociatedTokenAccountInstruction(
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) {
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  });
}

export const getNetworkToken = async (
  wallet: anchor.web3.PublicKey,
  gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      wallet.toBuffer(),
      Buffer.from('gateway'),
      Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
      gatekeeperNetwork.toBuffer(),
    ],
    CIVIC
  );
};

export const getNetworkExpire = async (
  gatekeeperNetwork: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [gatekeeperNetwork.toBuffer(), Buffer.from('expire')],
    CIVIC
  );
};
