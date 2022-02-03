import { getMetaBlocksProgram } from "./factory";
import { computeCreateUniverseParams } from "./paramsBuilder";

const createUniverse = async ({
  connection,
  wallet,
  name,
  description,
  websiteUrl,
}) => {
  const program = getMetaBlocksProgram(connection, wallet);

  const { universeKey, universeBump, accounts } =
    await computeCreateUniverseParams({ usersKey: wallet.publicKey });

  try {
    const tx = await program.rpc.createUniverse(
      universeBump,
      name,
      description,
      websiteUrl,
      { accounts, signers: [] }
    );
    return tx;
  } catch (e) {
    console.log("from api", e);
    throw e;
  } finally {
  }
};

export { createUniverse };
