import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Wallet } from '@project-serum/anchor';
import log from 'loglevel';

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

export const loadWallet = (keypairPath: string) => {
  if (!keypairPath || keypairPath == '') {
    throw new Error('Keypair is required!');
  }
  const loaded = new NodeWallet(
    Keypair.fromSecretKey(
      Buffer.from(JSON.parse(require('fs').readFileSync(keypairPath, 'utf-8')))
    )
  );

  log.info(`wallet public key: ${loaded.publicKey}`);

  return loaded;
};

export function getConnection(env: string) {
  const endpoint = getRpcUrl(env);
  return new Connection(endpoint, 'confirmed');
}

export const getRpcUrl = (env: string) => {
  if (env === 'devnet') {
    return 'https://api.devnet.solana.com';
  } else if (env === 'testnet') {
    return 'https://api.testnet.solana.com';
  } else if (env === 'mainnet-beta') {
    return 'https://api.mainnet-beta.solana.com';
  }

  return 'http://localhost:8899';
};

export const isNumeric = (number: string) => {
  return !isNaN(Number(number));
};

export const isBoolean = (val: any) => 'boolean' === typeof val;
