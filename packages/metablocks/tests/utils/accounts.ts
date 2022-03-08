import {
  Keypair,
  TransactionInstruction,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const createMint = (
  instructions: TransactionInstruction[],
  payer: PublicKey,
  mintRentExempt: number,
  decimals: number,
  owner: PublicKey,
  freezeAuthority: PublicKey,
  signers: Keypair[]
) => {
  const account = createUninitializedMint(
    instructions,
    payer,
    mintRentExempt,
    signers
  );

  instructions.push(
    Token.createInitMintInstruction(
      new PublicKey(TOKEN_PROGRAM_ID),
      account,
      decimals,
      owner,
      freezeAuthority
    )
  );

  return account;
};

export const createUninitializedMint = (
  instructions: TransactionInstruction[],
  payer: PublicKey,
  amount: number,
  signers: Keypair[]
) => {
  const account = Keypair.generate();
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: amount,
      space: MintLayout.span,
      programId: new PublicKey(TOKEN_PROGRAM_ID),
    })
  );

  signers.push(account);

  return account.publicKey;
};

export const createAssociatedTokenAccountInstruction = (
  instructions: TransactionInstruction[],
  associatedTokenAddress: PublicKey,
  walletAddress: PublicKey,
  payer: PublicKey,
  splTokenMintAddress: PublicKey
) => {
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
      pubkey: new PublicKey(TOKEN_PROGRAM_ID),
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID),
      data: Buffer.from([]),
    })
  );
};
