# Commands

Use the below commands for updating parent and collection nfts

## Update regular NFT

ts-node nft-minter-cli/src/nft-minter-cli.ts update_regular_nft \
-k ./nft-composer-cli/wallet/test-wallet.json \
--mintAddress "9Y2wkZeSoLKs9njbj9EYcEbVSS47KHiNkMMeFa3PyWA" \
--mintName "3moji Accessories Collection" \
--mintSymbol "3moji-Acc" \
--mintUri "https://fmp5kk7vrux4w2imtk4j7t4wkvcozm6eekkne3y4qllnx6u62rsq.arweave.net/Kx_VK_WNL8tpDJq4n8-WVUTss8QilNJvHILW2_qe1GU" \
--sellerBasisPoint 100

## Update Collection NFT

ts-node nft-minter-cli/src/nft-minter-cli.ts update_collection_nft \
-k ./nft-minter-cli/wallet/admin-keypair.json \
--oldParentMintAddress "9Y2wkZeSoLKs9njbj9EYcEbVSS47KHiNkMMeFa3PyWA" \
--newParentMintAddress "9dCuPNJCAfHNFibbaEyrv9ASZVtPRbUECgMLHaLGpTrm" \
--collectionMintAddress "8tCBFqVX3Pk6Dvcxz2CKa4aXtcLh4iKaVNK5SCNgMkv1" \
--mintName "Acc3ssory #2" \
--mintSymbol "3moji-Acc" \
--mintUri "https://arweave.net/dR_aJ64Q1Ld46wDCqmF-WGEcbDDvLioes5M7dqEZcjw" \
--sellerBasisPoint 500
--env "mainnet-beta"
