import { Provider, Wallet } from '@project-serum/anchor';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
} from '@solana/spl-token';
import {
  createAssociatedTokenAccountInstruction,
  createMint,
} from './accounts';

export default class NodeWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}

export const addSols = async (
  provider: Provider,
  wallet: anchor.web3.PublicKey,
  amount = anchor.web3.LAMPORTS_PER_SOL
) => {
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(wallet, amount),
    'confirmed'
  );
};

export const addSolsIfEmpty = async (
  provider: Provider,
  wallet: NodeWallet,
  amount: number
) => {
  const balance = await provider.connection.getBalance(wallet.publicKey);
  if (balance <= LAMPORTS_PER_SOL) {
    await addSols(provider, wallet.publicKey, amount);
  }
};

export const getTestWallet = () => {
  return new NodeWallet(
    Keypair.fromSecretKey(
      Buffer.from(
        JSON.parse(
          require('fs').readFileSync('./tests/wallet/test-signer.json', 'utf-8')
        )
      )
    )
  );
};

interface IMintNft {
  mintKey: PublicKey;
  nftAta: PublicKey;
}

export const mintNFT = async (
  payer: Keypair,
  provider: anchor.Provider
): Promise<IMintNft> => {
  const signers: Keypair[] = [];
  const instructions: TransactionInstruction[] = [];
  const mintRent = await provider.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );

  const mintKey = createMintForUserAddressInstruction(
    instructions,
    payer.publicKey,
    payer.publicKey,
    mintRent,
    signers
  );

  //console.log("Mint Address : ", mintKey.toString());
  const [recipientAta, _recipientBumpAta] = await findAssociatedAddressForKey(
    payer.publicKey,
    mintKey
  );

  createAssociatedAccountForRecipientInstruction(
    instructions,
    recipientAta,
    payer.publicKey,
    mintKey
  );

  ///TODO: Here --> add metaplex instructions for generating proper NFT

  instructions.push(
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mintKey,
      recipientAta,
      payer.publicKey,
      [],
      1
    )
  );

  const transaction = new anchor.web3.Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));

  signers.push(payer);

  await provider.send(transaction, signers);

  return {
    mintKey: mintKey,
    nftAta: recipientAta,
  };
};

export const createMintForUserAddressInstruction = (
  instructions: TransactionInstruction[],
  userPubkey: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  mintRent: number,
  signers: Keypair[]
): PublicKey => {
  return createMint(
    instructions,
    payer,
    mintRent,
    0,
    userPubkey,
    userPubkey,
    signers
  );
};

export const createAssociatedAccountForRecipientInstruction = (
  instructions: TransactionInstruction[],
  associatedRecipientKey: PublicKey,
  payer: PublicKey,
  mintKey: PublicKey
) => {
  return createAssociatedTokenAccountInstruction(
    instructions,
    associatedRecipientKey,
    payer,
    payer,
    mintKey
  );
};

export const findAssociatedAddressForKey = async (
  tokenRecipient: PublicKey,
  mintKey: PublicKey,
  tokenProgramID: PublicKey = new PublicKey(TOKEN_PROGRAM_ID),
  associatedProgramID: PublicKey = new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID)
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [tokenRecipient.toBuffer(), tokenProgramID.toBuffer(), mintKey.toBuffer()],
    associatedProgramID
  );
};
