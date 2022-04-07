import {
  addSols,
  CLUSTER_URL,
  getTestKeypair,
  getTestWallet,
} from './utils/sdk';
import * as anchor from '@project-serum/anchor';
import { getCandyMachineProgram } from '../src/factory';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
  api,
  CandyMachineApiArgs,
  CandyMachineData,
  CreateCandyMachineApiArgs,
  MintNftApiArgs,
} from '../src';

describe('Candy Machine Test cases', () => {
  const dummyKeypair = getTestKeypair();
  const dummyWallet = getTestWallet(dummyKeypair);
  let candyMachineID: anchor.web3.PublicKeyData | null = null;
  const deployedTokenWlMintAddress = new PublicKey(
    '7cfMFUxSb87BDS4dwsinRW9TGvHfUuF8JG8NKGhAYR8H'
  );

  const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
  let program;

  beforeAll(async () => {
    program = await getCandyMachineProgram(connection, dummyWallet);
    await addSols(
      program.provider,
      dummyWallet.publicKey,
      4 * LAMPORTS_PER_SOL
    );
  });

  it('should initialize the candy machine', async () => {
    const data: CandyMachineData = {
      itemsAvailable: new anchor.BN(1000),
      uuid: null,
      symbol: 'MBKR',
      sellerFeeBasisPoints: 10,
      isMutable: true,
      maxSupply: new anchor.BN(2000),
      price: new anchor.BN(0.01),
      retainAuthority: true,
      gatekeeper: null,
      goLiveDate: new anchor.BN(1680888721),
      endSettings: null,
      whitelistMintSettings: {
        mode: { burnEveryTime: true, neverBurn: false },
        mint: deployedTokenWlMintAddress,
        presale: true,
        discountPrice: null,
      },
      hiddenSettings: null,
      creators: [
        {
          address: dummyKeypair.publicKey,
          verified: true,
          share: 100,
        },
      ],
    };

    const args: CreateCandyMachineApiArgs = {
      connection: connection,
      wallet: dummyWallet,
      treasuryWallet: dummyWallet.publicKey,
      candyData: data,
      splToken: null,
    };

    const { candyMachine, uuid, txId } = await api.createCandyMachineV2(args);
    // console.log('CandyMacchine ID', candyMachine.toString());
    candyMachineID = candyMachine.toString();
  });

  it('should get candy machine state', async () => {
    const args: CandyMachineApiArgs = {
      connection: connection,
      wallet: dummyWallet,
      candyMachineId:
        candyMachineID != null
          ? new PublicKey(candyMachineID)
          : dummyKeypair.publicKey,
    };

    const result = await api.getCandyMachineV2State(args);

    // console.log(result);
  });

  it('should mint one token', async () => {
    const args: MintNftApiArgs = {
      wallet: dummyWallet,
      connection: connection,
      candyMachineId:
        candyMachineID != null
          ? new PublicKey(candyMachineID)
          : dummyKeypair.publicKey,
    };

    const tx = await api.mintOneCandyMachineV2Nft(args);
  });
});
