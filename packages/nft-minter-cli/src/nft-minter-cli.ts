/**
 * Use this to call the commands
 */
import log from 'loglevel';
import { program } from 'commander';
import { Connection } from '@solana/web3.js';
import { getConnection, loadWallet } from './utils';
import { api } from '@mbkjs/nft-minter';
import { InitializeNftMinterApiArgs } from '@mbkjs/nft-minter/dist/types/types';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

program
  .configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(errorColor(str)),
  })
  .parse(process.argv);
