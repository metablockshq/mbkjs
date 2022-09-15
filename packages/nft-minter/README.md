# NFT MINTER SDK

This package contains `nft-minter` program bindings. Use this to connect with `nft-minter` program. The program `nft-minter` can be used for minting nfts.


## Why use NFT-minter SDK ?

You can mint two categories of NFTs with nft-minter SDK. T

1. Mint Unsigned NFTs
2. Mint Signed NFTs

Let us look at these in greater details below.

### Mint Unsigned NFTs

Anyone can mint NFTs using the SDK. The restriction is that only one NFT can be minted per wallet

In this category, you can mint 

* Mint Unsigned Regular NFT - Use the SDK API to mint a normal NFT on Solana Blockchain 
* Mint Unsigned Collection NFT - Use this method from SDK to mint a collection NFT on Solana Blockcahin.


We will discuss more on how to use the APIs in greater detail below.


### Mint Signed NFTs

Only users with right authorised signature from admins who deployed the `nft-minter` program to onchain can use methods described below.

In this category , you can mint

* Mint Signed Regular NFT - Mint an authorised regular NFT
* Mint Signed Collection NFT - Mint an authorised Collection NFT.


In the below section we will see examples of how to use the various APIs of `nft-minter` program using the `@mbkjs/nft-minter` SDK.



## Connection and Wallet

For interacting with any program in Solana blockchain, first we need a wallet and connection to the blockchain.
Here is the sample code for establishing connection with Metablocks and solana network

First import the dependencies

```typescript
import { getNftMinterProgram } from '../src/factory';
import * as anchor from '@project-serum/anchor';

```

Then create the connection and program as below.


```typescript
const connection = new anchor.web3.Connection(CLUSTER_URL, 'confirmed');
const program = getNftMinterProgram(connection, wallet);
```

## Mint Unsigned NFTs

Minting an NFT using unsigned NFT is straight forward. 

First add the dependencies 

```typescript
import { api } from '../src';
import { MintUnsignedNftApiArgs } from '../src/types/types';
import { getNftMinterProgram } from '../src/factory';

```

Then call the api as shown below

```typescript
const args: MintUnsignedNftApiArgs = {
    connection: connection, // connection that we have established in the above example snippet
    wallet: claimantWallet, // wallet of the claimant
    mintName: 'Test Mint', // This could be any mint name 
    mintSymbol: 'TEST', // this could be any mint symbol
    isMasterEdition: true, // This can be true or false, It is recommended to create a masterEdition if you are creating a NFT
    isParentForNfts: false, // Keep this false if you do not want this NFT to be a parent NFT collection mint for other NFTs
    mintUri: 'http://mint.uri.com', // this can be any valid uri pointing towards a valid JSON metadata
};

const tx = await api.mintUnsignedNft(args);

```


## Mint Unsinged Collection NFT

If you want to create a collection NFT, then you should pass a `nft collection mint address` . This can be mint address is normal mint address which has a metadata attached to it

In the below example we will first create a `nft Collection Mint` and then create a collection NFT.

Import the depenencies first

```typescript
import { api, pda } from '../src';
import { MintUnsignedCollectionNftApiArgs, MintUnsignedNftApiArgs} from '../src/types/types'; 
```

Make a note of the `mintAddress` . So we will find a mintAddress as below.


```typescript
const [mintAddress, _2] = await pda.findMintAddress(
    authorityWallet.publicKey
);
```

Then we will create a parent NFT collection 

```typescript
const args1: MintUnsignedNftApiArgs = {
    connection: connection, 
    wallet: authorityWallet, // we need to pass the wallet of claimant, here we have passed `authorityWallet`
    mintName: 'Test Mint',
    mintSymbol: 'TEST',
    isMasterEdition: true,
    isParentForNfts: true, // Here make this to true so this NFT will be a parent mint for the one we want to create below
    mintUri: 'http://mint.uri.com',
};

const tx1 = await api.mintUnsignedNft(args1);

```

Afterwards, we will create a collection NFT.

```typescript
const args2: MintUnsignedCollectionNftApiArgs = {
    connection: connection,
    wallet: claimantWallet,
    mintName: 'Test Mint',
    mintSymbol: 'TEST',
    isMasterEdition: true,
    isParentForNfts: false,
    mintUri: 'http://child.mint.uri.com',
    collectionMintAddress: mintAddress, // here we passing the mintAddress of the NFT that we created above
};

const tx2 = await api.mintUnsignedCollectionNft(args2);
```


## Mint Signed NFT

To create a signed NFT, we need a valid signature first from the authority of the one who deployed the `nft-minter` program.

First let us import dependencies

```typescript
import { getNftMinterProgram } from '../src/factory';
import { api } from '../src';
import { MintSignedNftApiArgs } from '../src/types/types';
import nacl from 'tweetnacl';

```

Then we will create a dummy signature for authorising a claimant wallet address

```typescript
const testMessage = claimantWallet.publicKey.toBytes();
const signature = nacl.sign.detached(testMessage, authority.secretKey); // we are passing the claimant's public address and authority secret key to create a signature
```

We create the signed NFT with the following API

```typescript
const args: MintSignedNftApiArgs = {
    authorityAddress: authorityWallet.publicKey, // we also need to pass the authority wallet public key
    signature: signature, // signature that we created above
    message: testMessage, // message that we created above
    connection: connection,
    wallet: claimantWallet,
    mintName: 'Test Mint',
    mintSymbol: 'TEST',
    isMasterEdition: true,
    isParentForNfts: false,
    mintUri: 'http://mint.uri.com',
};

const tx = await api.mintSignedNft(args);
```


## Mint Signed Collection NFT

It is similar to `mint unsigned collection nft` as we described above, only difference is that we have to pass a valid `signature`  and `message` to the api

First import the dependencies

```typescript
import { api, pda } from '../src';
import { MintSignedCollectionNftApiArgs, MintUnsignedNftApiArgs } from '../src/types/types';
import nacl from 'tweetnacl';
```


Let us mint a parent nft so that we can make this a parent nft for collection nft

```typescript
const [mintAddress, _2] = await pda.findMintAddress(
    authorityWallet.publicKey
);
```

Then we create a `unsigned regular nft` as an example

```typescript
const args1: MintUnsignedNftApiArgs = {
    connection: connection,
    wallet: authorityWallet,
    mintName: 'Test Mint',
    mintSymbol: 'TEST',
    isMasterEdition: true,
    isParentForNfts: true, // is this nft mint a parent mint for other mints ?
    mintUri: 'http://mint.uri.com',
};

const tx1 = await api.mintUnsignedNft(args1);
```

Let us create a mock `signature` and `message` for creating a singed collection NFT

```typescript
const testMessage = claimantWallet.publicKey.toBytes();
const signature = nacl.sign.detached(testMessage, authority.secretKey);
```

Then we call the below api to create a signed collection nft

```typescript
const args2: MintSignedCollectionNftApiArgs = {
    authorityAddress: authorityWallet.publicKey, // we need to pass the authority wallet public key
    connection: connection,
    wallet: claimantWallet,
    signature: signature,
    message: testMessage,
    mintName: 'Test Mint',
    mintSymbol: 'TEST',
    isMasterEdition: true,
    isParentForNfts: false,
    mintUri: 'http://child.mint.uri.com',
    collectionMintAddress: mintAddress,
};

const tx2 = await api.mintSignedCollectionNft(args2);
```

These are the 4 ways in which you can create NFTs.

