import { PublicKey } from '@solana/web3.js';
import TokenDistributor from './idl/token_distributor.json';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const TOKEN_DISTRIBUTOR = new PublicKey(TokenDistributor.metadata.address);

// token-distributor account
export const findDistributor = async () => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('token-distributor')],

    TOKEN_DISTRIBUTOR
  );
};

export const findClaimCount = async (payer: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('claim-count'), payer.toBuffer()],
    TOKEN_DISTRIBUTOR
  );
};

export const findTokenWhitelistMint = async (distributorAddress: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('token-whitelist-mint'), distributorAddress.toBuffer()],
    TOKEN_DISTRIBUTOR
  );
};

export const findAssociatedAddress = async (
  tokenRecipient: PublicKey,
  mintKey: PublicKey,
  tokenProgramID: PublicKey = new PublicKey(TOKEN_PROGRAM_ID),
  associatedProgramID: PublicKey = new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID)
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [tokenRecipient.toBuffer(), tokenProgramID.toBuffer(), mintKey.toBuffer()],
    associatedProgramID
  );
};

export interface PdaKeys {
  distributorAddress: PublicKey;
  tokenWhiteListMintAddress: PublicKey;
  tokenWhitelistAta: PublicKey;
  authorityWhitelistAta: PublicKey;
}

export const getPdaKeys = async (authority: PublicKey): Promise<PdaKeys> => {
  const [distributor, _] = await findDistributor();

  const [tokenWhiteListMintAddress, _twl] = await findTokenWhitelistMint(
    distributor
  );

  const [tokenWhitelistAta, _tkata] = await findAssociatedAddress(
    distributor,
    tokenWhiteListMintAddress
  );

  const [authorityWhitelistAta, _aata] = await findAssociatedAddress(
    authority,
    tokenWhiteListMintAddress
  );

  return {
    distributorAddress: distributor,
    tokenWhiteListMintAddress: tokenWhiteListMintAddress,
    tokenWhitelistAta: tokenWhitelistAta,
    authorityWhitelistAta: authorityWhitelistAta,
  };
};
