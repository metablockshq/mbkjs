/**
 * Use this to call the commands
 */
import log from 'loglevel';
import { program } from 'commander';
import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection, loadWallet } from './utils';
import { api } from '@mbkjs/nft-minter';
import {
  InitializeNftMinterApiArgs,
  NftCreator,
  UpdateCollectionNftApiArgs,
  UpdateRegularNftApiArgs,
} from '@mbkjs/nft-minter/dist/types/types';

program.version('0.0.1');
log.setLevel(log.levels.INFO);

export function programCommand(name: string) {
  return program
    .command(name)
    .option(
      '-e, --env <string>',
      'Solana cluster env name',
      'devnet' //mainnet-beta, testnet, devnet
    )
    .requiredOption('-k, --keypair <path>', `Solana wallet location`)
    .option('-l, --log-level <string>', 'log level', setLogLevel);
}

function setLogLevel(value: any, _prev: any) {
  if (value == null) {
    return;
  }
  log.info('setting the log value to: ' + value);
  log.setLevel(value);
}

function errorColor(str: string) {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}

programCommand('initialize_nft_minter').action(async (_options, cmd) => {
  log.info('Executing the command initialize_nft_minter');
  const { env, keypair, logLevel, _ } = cmd.opts();

  const connection: Connection = getConnection(env);
  const wallet = loadWallet(keypair);

  const args: InitializeNftMinterApiArgs = {
    wallet: wallet,
    connection: connection,
    uri: 'Not required',
  };

  try {
    const tx = await api.initializeNftMinter(args);
    log.info('The transaction is ', tx);
  } catch (err) {
    log.error(err);
    return;
  }
});

programCommand('update_regular_nft')
  .requiredOption('-m --mintAddress <string>', 'Regular nft mint address')
  .requiredOption('-n --mintName <string>', 'Regular nft mint name')
  .requiredOption('-s --mintSymbol <string>', 'Regular nft mint symbol')
  .requiredOption('-u --mintUri <string>', 'Regular nft mint Uri')
  .requiredOption(
    '-sb --sellerBasisPoint <number>',
    'Regular nft Seller basis points'
  )
  .action(async (_options, cmd) => {
    log.info('Executing the command update_regular_nft');
    const {
      env,
      keypair,
      logLevel,
      mintAddress,
      mintName,
      mintSymbol,
      mintUri,
      sellerBasisPoint,
    } = cmd.opts();

    console.log(mintAddress, mintName, mintSymbol, mintUri, sellerBasisPoint);

    const connection: Connection = getConnection(env);
    const wallet = loadWallet(keypair);

    try {
      const nftCreator: NftCreator = {
        address: wallet.publicKey,
        share: 100,
      };
      const creators: Array<NftCreator> = [];
      creators.push(nftCreator);

      const args: UpdateRegularNftApiArgs = {
        connection: connection,
        wallet: wallet,
        mintName: mintName,
        mintSymbol: mintSymbol,
        mintUri: mintUri,
        creators: creators,
        sellerBasisPoints: sellerBasisPoint,
        isMutable: true,
        isPrimarySaleHappened: null,
        mintAddress: new PublicKey(mintAddress),
      };

      const tx = await api.updateRegularNft(args);
      log.info('The transaction is ', tx);
    } catch (err) {
      log.error(err);
      return;
    }
  });

programCommand('update_collection_nft')
  .requiredOption(
    '-pm --parentMintAddress <string>',
    'Collection nft parent mint address'
  )
  .requiredOption(
    '-cm --collectionMintAddress <string>',
    'Collection nft collection mint address'
  )
  .requiredOption('-n --mintName <string>', 'Collection nft mint name')
  .requiredOption('-s --mintSymbol <string>', 'Collection nft mint symbol')
  .requiredOption('-u --mintUri <string>', 'Collection nft mint Uri')
  .requiredOption(
    '-sb --sellerBasisPoint <number>',
    'Collection nft Seller basis points'
  )
  .action(async (_options, cmd) => {
    log.info('Executing the command update_collection_nft');
    const {
      env,
      keypair,
      logLevel,
      parentMintAddress,
      collectionMintAddress,
      mintName,
      mintSymbol,
      mintUri,
      sellerBasisPoint,
    } = cmd.opts();

    console.log(
      parentMintAddress,
      collectionMintAddress,
      mintName,
      mintSymbol,
      mintUri,
      sellerBasisPoint
    );

    const connection: Connection = getConnection(env);
    const wallet = loadWallet(keypair);

    try {
      const nftCreator: NftCreator = {
        address: wallet.publicKey,
        share: 100,
      };
      const creators: Array<NftCreator> = [];
      creators.push(nftCreator);

      const args: UpdateCollectionNftApiArgs = {
        connection: connection,
        wallet: wallet,
        mintName: mintName,
        mintSymbol: mintSymbol,
        mintUri: mintUri,
        creators: creators,
        sellerBasisPoints: sellerBasisPoint,
        isMutable: true,
        isPrimarySaleHappened: null,
        parentNftMintAddress: new PublicKey(parentMintAddress),
        parentNftAdminAddress: wallet.publicKey,
        collectionMintAddress: new PublicKey(collectionMintAddress),
      };

      const tx = await api.updateCollectionNft(args);
      log.info('The transaction is ', tx);
    } catch (err) {
      log.error(err);
      return;
    }
  });

program
  .configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(errorColor(str)),
  })
  .parse(process.argv);
