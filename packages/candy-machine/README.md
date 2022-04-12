# Candy Machine client bindings

This is a candy-machine V2 client bindings. For more details on the candy-machine V2 take a look at [here](https://docs.metaplex.com/candy-machine-v2/introduction)

## APIs

These are the APIs that have been added for Candy-Machine V2 version.

### Initialize the candy-machine from API

1. Create the config data like for instance

   ```typescript
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
   ```

2. Create the arguments for passing

   ```typescript
   const args: CreateCandyMachineApiArgs = {
     connection: connection,
     wallet: dummyWallet,
     treasuryWallet: dummyWallet.publicKey,
     candyData: data,
     splToken: null,
   };
   ```

3. Pass the arguments into the API

   ```typescript
   const { candyMachineId, uuid, txId } = await api.createCandyMachineV2(args);
   ```

### Get Candy-Machine state

For getting the candy-machine state, use the following API. Here is the example

1. Prepare the argument

   ```typescript
   const args: CandyMachineApiArgs = {
     connection: connection,
     wallet: dummyWallet,
     candyMachineId:
       candyMachineID != null
         ? new PublicKey(candyMachineID)
         : dummyKeypair.publicKey,
   };
   ```

2. Pass the argument to the api to fetch the data

   ```typescript
   const result = await api.getCandyMachineV2State(args);
   ```

### Mint NFT using candy-machine V2

To mint an NFT you could use the following API. This API is using the whitelist settings described in [this](https://docs.metaplex.com/candy-machine-v2/configuration#whitelist-settings) section. Note the user who is trying to mint the NFT should have atleast one-whitelist token for this example to work. But that said, this API can also be used with any settings that you have made when you first initialized the candy-machine

1. Prepare the arguments

   ```typescript
   const args: MintNftApiArgs = {
     wallet: dummyWallet, //payer wallet
     connection: connection,
     candyMachineId:
       candyMachineID != null
         ? new PublicKey(candyMachineID)
         : dummyKeypair.publicKey, // admin public key
   };
   ```

2. Now mint the NFT like below

   ```typescript
   const tx = await api.mintOneCandyMachineV2Nft(args);
   ```

## Further Details

For more details on using the api, refer the `api.spec.ts` under **tests** folder in this repo.

## Further improvements and contributing

If you want more APIs please let us know by creating an _issue_ or create a PR if you want add more APIs related to **Candy-Machine-V2**
