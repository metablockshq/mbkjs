import { Program, Provider } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./mbIdl";
import { MetaBlocks } from "./types/meta_blocks";

const programId = new PublicKey(idl.metadata.address);
const programIds = {
  token: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  associatedToken: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  metaBlocks: "9pNcm4DmZJgHYynuvhSbZ3m4bqBSKeuXqZ2cCZKbcLJc",
  metaplex: "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98",
  metadata: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
};

const getProvider = (conn: Connection, wallet: any) => {
  return new Provider(conn, wallet, {
    preflightCommitment: "processed",
    skipPreflight: false,
  });
};

const getMetaBlocksProgram = (conn: Connection, wallet: any) => {
  const provider = getProvider(conn, wallet);
  const program = new Program<any>(
    idl,
    programId,
    provider
  ) as Program<MetaBlocks>;
  return program;
};

export { getMetaBlocksProgram, getProvider, programIds };
