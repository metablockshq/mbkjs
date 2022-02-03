import { Program, Provider } from "@kyraa/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "./mbIdl";
const programId = new PublicKey(idl.metadata.address);

const programIds = {
  token: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  associatedToken: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  metaBlocks: "9pNcm4DmZJgHYynuvhSbZ3m4bqBSKeuXqZ2cCZKbcLJc",
  metaplex: "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98",
  metadata: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
};

const opts = {
  preflightCommitment: "processed",
};

const getProvider = (conn, wallet) => {
  return new Provider(conn, wallet, opts.preflightCommitment);
};

const getMetaBlocksProgram = (conn, wallet) => {
  console.log("-> naya hai");
  const provider = getProvider(conn, wallet);
  const program = new Program(idl, programId, provider);
  return program;
};

export { getMetaBlocksProgram, getProvider, programIds };
