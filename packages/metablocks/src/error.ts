class KyraaError {
  private _message: string | undefined = '';
  private _errorCode: number = 0;
  private _originalError: Error | null = null;

  get message(): any {
    return this._message;
  }

  get errorCode(): number {
    return this._errorCode;
  }

  get originalError(): any {
    return this._originalError;
  }

  public constructor(err?: any, errorCode?: number, message?: string) {
    if (err) {
      try {
        let message = err.toString().split('/n');

        if (message.length > 0) {
          let extractedMessage = message[0].split(':')[5];
          let logs = err.logs;
          if (hexToDecimal(extractedMessage) == 0 && logs.length > 0) {
            this._message = logs[3];
            this._errorCode = hexToDecimal(extractedMessage);
          } else {
            this._errorCode = hexToDecimal(extractedMessage);
            this._message = LangErrorMessage.get(this._errorCode);
          }
        }
      } catch (err) {}
      this._originalError = err;
    }

    if (message && errorCode) {
      this._errorCode = errorCode;
      this._message = message;
    }
  }

  set parse(err: any) {
    try {
      let message = err.toString().split('/n');

      if (message.length > 0) {
        let extractedMessage = message[0].split(':')[5];
        let logs = err.logs;
        if (hexToDecimal(extractedMessage) == 0 && logs.length > 0) {
          this._message = logs[3];
          this._errorCode = hexToDecimal(extractedMessage);
        } else {
          this._errorCode = hexToDecimal(extractedMessage);
          this._message = LangErrorMessage.get(this._errorCode);
        }
      }
    } catch (err) {}
    this._originalError = err;
  }
}

const LangErrorCode = {
  // Instructions.
  InstructionMissing: 100,
  InstructionFallbackNotFound: 101,
  InstructionDidNotDeserialize: 102,
  InstructionDidNotSerialize: 103,

  // IDL instructions.
  IdlInstructionStub: 1000,
  IdlInstructionInvalidProgram: 1001,

  // Constraints.
  ConstraintMut: 2000,
  ConstraintHasOne: 2001,
  ConstraintSigner: 2002,
  ConstraintRaw: 2003,
  ConstraintOwner: 2004,
  ConstraintRentExempt: 2005,
  ConstraintSeeds: 2006,
  ConstraintExecutable: 2007,
  ConstraintState: 2008,
  ConstraintAssociated: 2009,
  ConstraintAssociatedInit: 2010,
  ConstraintClose: 2011,
  ConstraintAddress: 2012,
  ConstraintZero: 2013,
  ConstraintTokenMint: 2014,
  ConstraintTokenOwner: 2015,
  ConstraintMintMintAuthority: 2016,
  ConstraintMintFreezeAuthority: 2017,
  ConstraintMintDecimals: 2018,
  ConstraintSpace: 2019,

  // Accounts.
  AccountDiscriminatorAlreadySet: 3000,
  AccountDiscriminatorNotFound: 3001,
  AccountDiscriminatorMismatch: 3002,
  AccountDidNotDeserialize: 3003,
  AccountDidNotSerialize: 3004,
  AccountNotEnoughKeys: 3005,
  AccountNotMutable: 3006,
  AccountNotProgramOwned: 3007,
  InvalidProgramId: 3008,
  InvalidProgramExecutable: 3009,
  AccountNotSigner: 3010,
  AccountNotSystemOwned: 3011,
  AccountNotInitialized: 3012,
  AccountNotProgramData: 3013,
  // State.
  StateInvalidAddress: 4000,

  // Used for APIs that shouldn't be used anymore.
  Deprecated: 5000,

  //Kyraa
  KyraaUserNftAccount: 6000,
  // Metablocks errors
  IndexAdditionError: 6001,
  InvalidUniverseAuthority: 6002,
  InvalidSigner: 6003,
  Unauthorized: 6004,
  NoMetadata: 6005,
  InvalidTreasury: 6006,
};

const LangErrorMessage = new Map([
  // Instructions.
  [
    LangErrorCode.InstructionMissing,
    '8 byte instruction identifier not provided',
  ],
  [
    LangErrorCode.InstructionFallbackNotFound,
    'Fallback functions are not supported',
  ],
  [
    LangErrorCode.InstructionDidNotDeserialize,
    'The program could not deserialize the given instruction',
  ],
  [
    LangErrorCode.InstructionDidNotSerialize,
    'The program could not serialize the given instruction',
  ],

  // Idl instructions.
  [
    LangErrorCode.IdlInstructionStub,
    'The program was compiled without idl instructions',
  ],
  [
    LangErrorCode.IdlInstructionInvalidProgram,
    'The transaction was given an invalid program for the IDL instruction',
  ],

  // Constraints.
  [LangErrorCode.ConstraintMut, 'A mut constraint was violated'],
  [LangErrorCode.ConstraintHasOne, 'A has_one constraint was violated'],
  [LangErrorCode.ConstraintSigner, 'A signer constraint was violated'],
  [LangErrorCode.ConstraintRaw, 'A raw constraint was violated'],
  [LangErrorCode.ConstraintOwner, 'An owner constraint was violated'],
  [LangErrorCode.ConstraintRentExempt, 'A rent exempt constraint was violated'],
  [LangErrorCode.ConstraintSeeds, 'A seeds constraint was violated'],
  [LangErrorCode.ConstraintExecutable, 'An executable constraint was violated'],
  [LangErrorCode.ConstraintState, 'A state constraint was violated'],
  [LangErrorCode.ConstraintAssociated, 'An associated constraint was violated'],
  [
    LangErrorCode.ConstraintAssociatedInit,
    'An associated init constraint was violated',
  ],
  [LangErrorCode.ConstraintClose, 'A close constraint was violated'],
  [LangErrorCode.ConstraintAddress, 'An address constraint was violated'],
  [LangErrorCode.ConstraintZero, 'Expected zero account discriminant'],
  [LangErrorCode.ConstraintTokenMint, 'A token mint constraint was violated'],
  [LangErrorCode.ConstraintTokenOwner, 'A token owner constraint was violated'],
  [
    LangErrorCode.ConstraintMintMintAuthority,
    'A mint mint authority constraint was violated',
  ],
  [
    LangErrorCode.ConstraintMintFreezeAuthority,
    'A mint freeze authority constraint was violated',
  ],
  [
    LangErrorCode.ConstraintMintDecimals,
    'A mint decimals constraint was violated',
  ],
  [LangErrorCode.ConstraintSpace, 'A space constraint was violated'],

  // Accounts.
  [
    LangErrorCode.AccountDiscriminatorAlreadySet,
    'The account discriminator was already set on this account',
  ],
  [
    LangErrorCode.AccountDiscriminatorNotFound,
    'No 8 byte discriminator was found on the account',
  ],
  [
    LangErrorCode.AccountDiscriminatorMismatch,
    '8 byte discriminator did not match what was expected',
  ],
  [LangErrorCode.AccountDidNotDeserialize, 'Failed to deserialize the account'],
  [LangErrorCode.AccountDidNotSerialize, 'Failed to serialize the account'],
  [
    LangErrorCode.AccountNotEnoughKeys,
    'Not enough account keys given to the instruction',
  ],
  [LangErrorCode.AccountNotMutable, 'The given account is not mutable'],
  [
    LangErrorCode.AccountNotProgramOwned,
    'The given account is not owned by the executing program',
  ],
  [LangErrorCode.InvalidProgramId, 'Program ID was not as expected'],
  [LangErrorCode.InvalidProgramExecutable, 'Program account is not executable'],
  [LangErrorCode.AccountNotSigner, 'The given account did not sign'],
  [
    LangErrorCode.AccountNotSystemOwned,
    'The given account is not owned by the system program',
  ],
  [
    LangErrorCode.AccountNotInitialized,
    'The program expected this account to be already initialized',
  ],
  [
    LangErrorCode.AccountNotProgramData,
    'The given account is not a program data account',
  ],

  // State.
  [
    LangErrorCode.StateInvalidAddress,
    'The given state account does not have the correct address',
  ],

  // Misc.
  [
    LangErrorCode.Deprecated,
    'The API being used is deprecated and should no longer be used',
  ],

  [
    LangErrorCode.KyraaUserNftAccount,
    'User Nft Account failure, either token mint or universe is undefined',
  ],
]);

const hexToDecimal = (str: string) => {
  return parseInt(str, 16);
};

export { KyraaError, LangErrorCode, LangErrorMessage };
