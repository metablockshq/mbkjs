![NPM Version](https://img.shields.io/npm/v/@mbkjs/nft-composer)

# SDK bindings for Solana MetaBlocks Program

This repo contains the API bindings for interacting with MetaBlocks program for more info refer this [link](https://metablocks.world/guides/protocol/thinking-in-meta-blocks)

## Connection and Wallet

For interacting with any program in Solana blockchain, first we need a wallet and connection to the blockchain.
Here is the sample code for establishing connection with Metablocks and solana network

```typescript
const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
const program = getMetaBlocksProgram(connection, wallet);
```

## Universe

Universes allow you to use the protocol without caring about on-chain deployments. All you need is a wallet. You can create only one universe per wallet. For more info, refer the [Official Docs](https://metablocks.world/guides/protocol/creating-a-universe)

Below is a how you initialize/update an universe in your code.

### Create an universe

Import Dependencies

```typescript
import { createUniverse } from '@mbkjs/nft-composer';
```

To create an universe, all you need is below argument to be passed to the `createUniverse` method

```typescript
const args = {
  name: 'sample name',
  description: ' sample description',
  websiteUrl: 'http://your-sample.website.url',
  connection: connection,
  wallet: dummyWallet,
};

const tx = await createUniverse(args);
```

### Update an universe

Import dependencies

```typescript
import { updateUniverse } from '@mbkjs/nft-composer';
```

Similar to the above create universe, update universe is as simple as below `updateUniverse` call

```typescript
const args = {
  name: 'sample name',
  description: ' sample description',
  websiteUrl: 'http://your-sample.website.url',
  connection: connection,
  wallet: dummyWallet,
};

const tx = await updateUniverse(args);
```

## Deposit NFT

Import dependencies

```typescript
import { depositNft, NftComposerCluster } from '@mbkjs/nft-composer';
```

Users can deposit their NFTs for upgrading their NFTs, it could be done with `depositNft`.

1. Once the user deposit's the NFT, in-return the User gets a receiptNFT as an acknowledgement for depositing the NFT.

2. A Meta NFT is generated. This NFT is the final combined NFT of the NFTs that you have deposited into the Metablocks program.

```typescript
const args: GroupedDepositNftApiArgs = {
  connection: connection,
  isReceiptMasterEdition: false, // // You can mint a master-edition of the Receipt NFT, you can keep this a default
  arweaveUrl: 'http://localhost:8090', // arweave url of the  NFT
  receiptName: 'receiptName', // receipt NFT name
  metaNftName: 'metaNftName', // Generated meta NFT name
  cluster: NftComposerCluster.Devnet, // This is the cluster, we have chosen devnet as the cluster
  isMetaNftMasterEdition: false, // You can mint a master-edition of the Meta NFT, you can keep this a default
  wallet: dummyWallet,
  mintKey: userNftMint, // this is the token mint of the User's NFT that needs to be deposited
  universeKey: universeKey, // this is the public key where users wants to deposit the nft
};

await depositNft(args);
```

## Withdraw NFT

Import the API

```typescript
import { depositNft } from '@mbkjs/nft-composer';
```

User could withdraw NFT anytime. The API to withdraw NFT is as simple as the following sample code.

```typescript
const args: WithdrawNftApiArgs = {
  connection: connection,
  wallet: dummyWallet,
  mintKey: userNftMint, // original mint public key of the user
  universeKey: universeKey, // public key of the universe where the User deposited the NFT
};

await withdrawNft(args);
```

## Withdraw NFT with Receipt NFT

Import the API

```typescript
import { depositNft } from '@mbkjs/nft-composer';
```

NFTs could also be withdraw from MetaBlocks Program using `receiptMint` Publickey

```typescript
const args: WithdrawNftWithReceiptApiArgs = {
  connection: connection,
  receiptMint: pdaKeys.receiptMint, // public key of the receipt mint NFT
  wallet: dummyWallet,
  universeKey: universeKey, // public key of the universe where user deposited NFT
};

await withdrawNftWithReceipt(args);
```

## For More Details

For more details refer the `tests` folder of this package to get an idea on using the APIs

# Contributions

You could contribute to this package by creating a PR. Feel free to open issues if you face any problems while using this package.
