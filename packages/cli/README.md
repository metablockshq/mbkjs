# Commands

## Universe

### Get all universe accounts

Get all the universes deposited in the metablocks program

```bash
ts-node cli/src/crank-cli.ts get_all_universes -k cli/wallet/test-wallet.json -e "devnet"
```

### Create universe

Call this command for creating the universe

```bash
ts-node cli/src/crank-cli.ts create_universe -k cli/wallet/test-wallet.json \
-e "devnet" \
-n "First Universe" \
-w "http://localhost:88" \
-d "Universe description"
```

### Update universe

Update the universe

```bash
ts-node cli/src/crank-cli.ts update_universe -k cli/wallet/test-wallet.json \
-e "devnet" \
-n "Updated first Universe" \
-w "http://localhost:88" \
-d "Updated Universe description"
```

## Wrapped User Nfts

### Get Wrapped user nft accounts

Get all wrapped user nfts accounts of all the universes

```bash
ts-node cli/src/crank-cli.ts get_wrapped_user_nft_accounts  \
-k cli/wallet/test-wallet.json \
-e "devnet" \
--universes "3" "2" \
--vault-authorities "8" "5" \
--authorities "43" "12"
```

### Get a wrapped user nft account

Get a wrapped user nft account with a receipt mint

```bash
ts-node cli/src/crank-cli.ts get_wrapped_user_nft_accounts  \
-k cli/wallet/test-wallet.json \
-e "devnet" \
--receipt-mint-key "receiptMintKey"
```

### Get Metadata for Mint

Get metadata for the mint (uses metaplex library)

```bash
ts-node cli/src/crank-cli.ts get_wrapped_user_nft_accounts  \
-k cli/wallet/test-wallet.json \
-e "devnet" \
--mint-key "mintKey"
```

### Deposit NFT into an universe

```bash
ts-node cli/src/crank-cli.ts get_wrapped_user_nft_accounts  \
-k cli/wallet/test-wallet.json \
-e "devnet" \
--universe-key "universeKey" \
--nft-mint-key "mintKey" \
--receipt-name "Any Receipt Name" \
--receipt-url "http://localhost:89" \
--receipt-master-edition false \
--meta-nft-name "meta nft name" \
--meta-nft-url "http://local:90" \
--meta-nft-master-edition false
```

### Withdraw nft with Receipt

```bash
ts-node cli/src/crank-cli.ts get_wrapped_user_nft_accounts  \
-k cli/wallet/test-wallet.json \
-e "devnet" \
--universe-key "universeKey" \
--receipt-mint-key "receiptMintKey"
```

### Withdraw Nft

```bash
ts-node cli/src/crank-cli.ts get_wrapped_user_nft_accounts  \
-k cli/wallet/test-wallet.json \
-e "devnet" \
--universe-key "universeKey" \
--nft-mint-key "nftMintKey"
```
