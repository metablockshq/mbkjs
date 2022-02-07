import * as anchor from "@project-serum/anchor";
import { MetaBlocks } from "../types/meta_blocks";
import { UserNft } from "../types/types";
import { camelToSnakeCaseArrayObject, setBlockMetadata } from "./utils";

const getRawUserNfts = async (program: anchor.Program<MetaBlocks>) => {
  return await program.account.userNft.all();
};

const getAllUserNfts = async (
  program: anchor.Program<MetaBlocks>
): Promise<Array<UserNft>> => {
  const userNftAccounts = await getRawUserNfts(program);

  const userNfts: Array<UserNft> = [];

  for (const userNftAccount of userNftAccounts) {
    const metadata = await setBlockMetadata(userNftAccount.publicKey, program);

    const userNft: UserNft = {
      publicKey: userNftAccount.publicKey.toString(),
      userNftBump: userNftAccount.account.userNftBump,
      vaultBump: userNftAccount.account.vaultBump,
      associatedVaultBump: userNftAccount.account.vaultBump,
      nftAuthority: userNftAccount.account.nftAuthority.toString(),
      universe: userNftAccount.account.universe.toString(),
      vaultAuthority: userNftAccount.account.vaultAuthority.toString(),
      receiptMintBump: userNftAccount.account.receiptMintBump,
      userReceiptAtaBump: userNftAccount.account.userReceiptAtaBump,
      receiptMint: userNftAccount.account.receiptMint.toString(),
      userReceiptAta: userNftAccount.account.userReceiptAta.toString(),
      vaultReceiptAta: userNftAccount.account.vaultReceiptAta.toString(),
      tokenMint: userNftAccount.account.tokenMint.toString(),
      receiptMasterEdition:
        userNftAccount.account.receiptMasterEdition.toString(),
      isReceiptMasterEdition: userNftAccount.account
        .isReceiptMasterEdition as boolean,
      isUserNftVerified: userNftAccount.account.isUserNftVerified as boolean,
      isUserNftMetaplex: userNftAccount.account.isUserNftMetaplex as boolean,
      slot: metadata.slot,
      signature: metadata.signature,
      blockTime: metadata.blockTime,
    };

    userNfts.push(userNft);
  }

  return camelToSnakeCaseArrayObject(userNfts);
};

export { getAllUserNfts };
