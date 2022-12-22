# Commands

## Update regular NFT

ts-node nft-minter-cli/src/nft-minter-cli.ts update_regular_nft \
-k ./nft-composer-cli/wallet/test-wallet.json \
--mintAddress "1234" \
--mintName "Name" \
--mintSymbol "SYMBOL" \
--mintUri "Uri" \
--sellerBasisPoint 100

## Update Collection NFT

ts-node nft-minter-cli/src/nft-minter-cli.ts update_collection_nft \
-k ./nft-composer-cli/wallet/test-wallet.json \
--parentMintAddress "1234" \
--collectionMintAddress "1234" \
--mintName "Name" \
--mintSymbol "SYMBOL" \
--mintUri "Uri" \
--sellerBasisPoint 100
