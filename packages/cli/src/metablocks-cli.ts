import log from "loglevel";
import { program } from "commander";

import { Connection, PublicKey } from "@solana/web3.js";
import { getRpcUrl, isBoolean, loadWallet } from "./utils";

import {
  api,
  FetchAccountArgs,
  GroupedDepositNftApiArgs,
  UniverseApiArgs,
  UserNftFilterArgs,
  WithdrawNftApiArgs,
  WithdrawNftWithReceiptApiArgs,
  WrappedUserNftArgs,
} from "@kyraa/metablocks";

program.version("0.0.1");
log.setLevel(log.levels.INFO);

export function programCommand(name: string) {
  return program
    .command(name)
    .option(
      "-e, --env <string>",
      "Solana cluster env name",
      "devnet" //mainnet-beta, testnet, devnet
    )
    .requiredOption("-k, --keypair <path>", `Solana wallet location`)
    .option("-l, --log-level <string>", "log level", setLogLevel);
}

function setLogLevel(value: any, _prev: any) {
  if (value == null) {
    return;
  }
  log.info("setting the log value to: " + value);
  log.setLevel(value);
}

function errorColor(str: string) {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}

function getConnection(env: string) {
  const endpoint = getRpcUrl(env);
  return new Connection(endpoint, "confirmed");
}

/********************* universe commands **********************/

// create universe
programCommand("create_universe")
  .option(
    "-n --name <string>",
    "Name of the universe -defaults to universe-name ",
    "universe-name"
  )
  .option(
    "-d --description <string>",
    "Description of the universe -defaults to universe-description ",
    "universe-description"
  )
  .option(
    "-w --website-url <string>",
    "Description of the universe -defaults to universe-website-url ",
    "universe-description-url"
  )
  .action(async (_options, cmd) => {
    log.info("Executing the command create_universe");
    const { env, keypair, logLevel, name, description, websiteUrl } =
      cmd.opts();

    const endpoint = getRpcUrl(env);
    const connection = new Connection(endpoint, "recent");
    const wallet = loadWallet(keypair);

    let argName = "name";
    if (name) {
      argName = name;
    }

    let argDescription = "description";
    if (description) {
      argDescription = description;
    }

    let argWebsiteUrl = "websiteUrl";
    if (websiteUrl) {
      argWebsiteUrl = websiteUrl;
    }

    const args: UniverseApiArgs = {
      wallet: wallet,
      connection: connection,
      name: argName,
      description: argDescription,
      websiteUrl: argWebsiteUrl,
    };

    try {
      const tx = await api.createUniverse(args);
      log.info("The transaction is ", tx);
    } catch (err) {
      log.error(err);
      return;
    }
  });

//update universe command
programCommand("update_universe")
  .option(
    "-n --name <string>",
    "Name of the universe -defaults to universe-name ",
    "universe-name"
  )
  .option(
    "-d --description <string>",
    "Description of the universe -defaults to universe-description ",
    "universe-description"
  )
  .option(
    "-w --website-url <string>",
    "Description of the universe -defaults to universe-website-url ",
    "universe-description-url"
  )
  .action(async (_options, cmd) => {
    log.info("Executing the command update_universe");
    const { env, keypair, logLevel, name, description, websiteUrl } =
      cmd.opts();

    const connection: Connection = getConnection(env);
    const wallet = loadWallet(keypair);

    let argName = "name";
    if (name) {
      argName = name;
    }

    let argDescription = "description";
    if (description) {
      argDescription = description;
    }

    let argWebsiteUrl = "websiteUrl";
    if (websiteUrl) {
      argWebsiteUrl = websiteUrl;
    }

    const args: UniverseApiArgs = {
      wallet: wallet,
      connection: connection,
      name: argName,
      description: argDescription,
      websiteUrl: argWebsiteUrl,
    };

    try {
      const tx = await api.updateUniverse(args);
      log.info("The transaction is ", tx);
    } catch (err) {
      log.error(err);
      return;
    }
  });

//update universe command
programCommand("get_all_universes").action(async (_options, cmd) => {
  log.info("Executing the command get_all_universes");
  const { env, keypair, logLevel } = cmd.opts();

  const connection: Connection = getConnection(env);
  const wallet = loadWallet(keypair);

  const args: FetchAccountArgs = {
    wallet: wallet,
    connection: connection,
  };

  try {
    const result = await api.getAllUniverseAccounts(args);
    log.info("The result is - ");
    log.info(result);
  } catch (err) {
    log.error(err);
    return;
  }
});

/***************** universe commands ******************************/

/********************* Wrapped user NFTs Commands ************/
// deposit NFT
programCommand("deposit_nft")
  .requiredOption(
    "-u --universe-key <string>",
    "Universe key where you want to deposit nft"
  )
  .requiredOption(
    "-n --nft-mint-key <string>",
    "Mint key of the nft that is being deposited"
  )
  .option(
    "-rn --receipt-name <string>",
    "Receipt name, -defaults to receipt-name ",
    "receipt-name"
  )
  .option(
    "-r --receipt-url <string>",
    "Receipt URL, -defaults to http://localhost ",
    "http://localhost"
  )
  .option(
    "-rme --receipt-master-edition <boolean>",
    "Is receipt master edition, -defaults to false ",
    "false"
  )
  .option(
    "-mu --meta-nft-name <string>",
    "Meta nft name, -defaults to meta-nft-name ",
    "meta-nft-name"
  )
  .option(
    "-mu --meta-nft-url <string>",
    "MetaNFT URL, -defaults to http://localhost ",
    "http://localhost"
  )

  .option(
    "-mme --meta-nft-master-edition <boolean>",
    "Is meta nft master edition, -defaults to false ",
    "false"
  )

  .action(async (_options, cmd) => {
    log.info("Executing the command deposit_nft");
    const {
      env,
      keypair,
      logLevel,
      universeKey,
      nftMintKey,
      receiptName,
      receiptUrl,
      receiptMasterEdition,
      metaNftName,
      metaNftUrl,
      metaNftMasterEdition,
    } = cmd.opts();

    const connection: Connection = getConnection(env);
    const wallet = loadWallet(keypair);

    let argUniverseKey = null;
    if (universeKey) {
      argUniverseKey = universeKey;
    } else {
      throw new Error("Universe Key empty");
    }

    let argNftMintKey = null;
    if (nftMintKey) {
      argNftMintKey = nftMintKey;
    } else {
      throw new Error("Nft mint key is not provided");
    }

    let argReceiptName = "receipt-name";
    if (receiptName) {
      argReceiptName = receiptName;
    }

    let argReceiptUrl = "http://localhost";
    if (receiptUrl) {
      argReceiptUrl = receiptUrl;
    }
    let argIsReceiptMasterEdition = false;
    if (receiptMasterEdition && isBoolean(receiptMasterEdition)) {
      argIsReceiptMasterEdition = receiptMasterEdition;
    }

    let argMetaNftName = "meta-nft-name";
    if (metaNftName) {
      argMetaNftName = metaNftName;
    }

    let argMetaNftUrl = "http://localhost";
    if (metaNftUrl) {
      argMetaNftUrl = metaNftUrl;
    }
    let argIsMetaNftMasterEdition = false;
    if (metaNftMasterEdition && isBoolean(metaNftMasterEdition)) {
      argIsMetaNftMasterEdition = metaNftMasterEdition;
    }

    const args: GroupedDepositNftApiArgs = {
      wallet: wallet,
      connection: connection,
      receiptName: argReceiptName,
      receiptUrl: argReceiptUrl,
      isReceiptMasterEdition: argIsReceiptMasterEdition,
      metaNftName: argMetaNftName,
      metaNftUrl: argMetaNftUrl,
      isMetaNftMasterEdition: argIsMetaNftMasterEdition,
      universeKey: new PublicKey(argUniverseKey),
      mintKey: new PublicKey(argNftMintKey),
    };

    try {
      const tx = await api.depositNft(args);
      log.info("The transaction is ", tx);
    } catch (err) {
      log.error(err);
      return;
    }
  });

//withdraw nft with receipt
programCommand("withdraw_nft_with_receipt")
  .requiredOption(
    "-u --universe-key <string>",
    "Universe key where you want to deposit nft"
  )
  .requiredOption(
    "-r --receipt-mint-key <string>",
    "Mint key of the nft that is being deposited"
  )

  .action(async (_options, cmd) => {
    log.info("Executing the command withdraw_nft_with_receipt");
    const { env, keypair, logLevel, universeKey, receiptMintKey } = cmd.opts();

    const connection: Connection = getConnection(env);
    const wallet = loadWallet(keypair);

    let argUniverseKey = null;
    if (universeKey) {
      argUniverseKey = universeKey;
    } else {
      throw new Error("Universe Key empty");
    }

    let argReceiptNftMintKey = null;
    if (receiptMintKey) {
      argReceiptNftMintKey = receiptMintKey;
    } else {
      throw new Error("Nft mint key is not provided");
    }

    const args: WithdrawNftWithReceiptApiArgs = {
      wallet: wallet,
      connection: connection,
      universeKey: new PublicKey(argUniverseKey),
      receiptMint: new PublicKey(argReceiptNftMintKey),
    };

    try {
      const tx = await api.withdrawNftWithReceipt(args);
      log.info("The transaction is ", tx);
    } catch (err) {
      log.error(err);
      return;
    }
  });

// with nft
programCommand("withdraw_nft")
  .requiredOption(
    "-u --universe-key <string>",
    "Universe key where you want to deposit nft"
  )
  .requiredOption(
    "-n --nft-mint-key <string>",
    "Mint key of the nft that is being deposited"
  )

  .action(async (_options, cmd) => {
    log.info("Executing the command withdraw_nft ");
    const { env, keypair, logLevel, universeKey, nftMintKey } = cmd.opts();

    const connection: Connection = getConnection(env);
    const wallet = loadWallet(keypair);

    let argUniverseKey = null;
    if (universeKey) {
      argUniverseKey = universeKey;
    } else {
      throw new Error("Universe Key empty");
    }

    let argNftMintKey = null;
    if (nftMintKey) {
      argNftMintKey = nftMintKey;
    } else {
      throw new Error("Nft mint key is not provided");
    }

    const args: WithdrawNftApiArgs = {
      wallet: wallet,
      connection: connection,
      universeKey: new PublicKey(argUniverseKey),
      mintKey: new PublicKey(argNftMintKey),
    };

    try {
      const tx = await api.withdrawNft(args);
      log.info("The transaction is ", tx);
    } catch (err) {
      log.error(err);
      return;
    }
  });

programCommand("get_wrapped_user_nft_accounts")
  .option("-u --universes <string...>", "Universes public key strings")
  .option(
    "-va --vault-authorities <string...>",
    "vault authorities public key strings"
  )
  .option(
    "-au --authorities <string...>",
    "authorities public key strings, this this the user wallet public keys"
  )

  .action(async (_options, cmd) => {
    log.info("Executing the command get_wrapped_user_nft_accounts ");
    const { env, keypair, logLevel, universes, vaultAuthorities, authorities } =
      cmd.opts();

    const connection: Connection = getConnection(env);
    const wallet = loadWallet(keypair);

    const filterArgs: UserNftFilterArgs = {
      universes: [],
      vaultAuthorities: [],
      authorities: [],
    };

    if (universes && universes.length > 0) {
      filterArgs.universes = universes;
    }

    if (vaultAuthorities && vaultAuthorities.length > 0) {
      filterArgs.vaultAuthorities = vaultAuthorities;
    }

    if (authorities && authorities.length > 0) {
      filterArgs.authorities = authorities;
    }

    const fetchAccountArgs: FetchAccountArgs = {
      wallet: wallet,
      connection: connection,
    };

    try {
      const result = await api.getWrappedUserNftAccounts(
        fetchAccountArgs,
        filterArgs
      );
      log.info("The result - ");
      log.info(result);
    } catch (err) {
      log.error(err);
      return;
    }
  });

programCommand("get_metadata_for_mint")
  .requiredOption("-m --mint-key <string>", "give the mint public of the nft")
  .action(async (_options, cmd) => {
    log.info("Executing the command get_metadata_for_mint ");
    const { env, keypair, logLevel, mintKey } = cmd.opts();

    try {
      const connection: Connection = getConnection(env);

      if (!mintKey) {
        throw Error("mintkey is empty");
      }

      const mint: PublicKey = new PublicKey(mintKey);

      const result = await api.getMetadataForMint(connection, mint);
      log.info("The Result - ");
      log.info(result);
    } catch (err) {
      log.error(err);
      return;
    }
  });

programCommand("get_wrapped_user_nft_account")
  .requiredOption(
    "-m --receipt-mint-key <string>",
    "give the mint public of the receipt mint nft"
  )
  .action(async (_options, cmd) => {
    log.info("Executing the command get_metadata_for_mint ");
    const { env, keypair, logLevel, receiptMintKey } = cmd.opts();

    try {
      const connection: Connection = getConnection(env);
      const wallet = loadWallet(keypair);

      if (!receiptMintKey) {
        throw Error("Receipt mint  is empty");
      }

      const receiptMint: PublicKey = new PublicKey(receiptMintKey);

      const args: WrappedUserNftArgs = {
        connection: connection,
        wallet: wallet,
        authority: wallet.publicKey,
        receiptMint: receiptMint,
      };

      const result = await api.getWrappedUserNftAccount(args);
      log.info("The Result - ");
      log.info(result);
    } catch (err) {
      log.error(err);
      return;
    }
  });
/****************** wrapped user nft commands ***********************/

program
  .configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(errorColor(str)),
  })
  .parse(process.argv);
