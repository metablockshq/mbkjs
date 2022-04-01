export type TokenDistributor = {
  "version": "0.1.0",
  "name": "token_distributor",
  "instructions": [
    {
      "name": "initDistributor",
      "accounts": [
        {
          "name": "distributor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitDistributorArgs"
          }
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "distributor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "claimCount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "ClaimArgs"
          }
        }
      ]
    },
    {
      "name": "transferWlTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "distributor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recipientWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "TransferTokensArgs"
          }
        }
      ]
    },
    {
      "name": "delegateWlTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "distributor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "delegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "DelegateTokensArgs"
          }
        }
      ]
    },
    {
      "name": "updateDistributor",
      "accounts": [
        {
          "name": "distributor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateDistributorArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "claimArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signature",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "message",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "claimBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "claimCount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "claimant",
            "type": "publicKey"
          },
          {
            "name": "tokenWhitelistMint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "delegateTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "distributor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "distributorBump",
            "type": "u8"
          },
          {
            "name": "tokenWhitelistMintBump",
            "type": "u8"
          },
          {
            "name": "tokenWhitelistMint",
            "type": "publicKey"
          },
          {
            "name": "config",
            "type": {
              "defined": "Config"
            }
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "initDistributorArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalTokenAmount",
            "type": "u64"
          },
          {
            "name": "initialAuthorityTokens",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "userClaimAmount",
            "type": "u8"
          },
          {
            "name": "tokenExpiryDate",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "transferTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateDistributorArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenExpiryDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "userClaimAmount",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "totalTokenAmount",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userClaimAmount",
            "type": "u8"
          },
          {
            "name": "tokenExpiryDate",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidSigner",
      "msg": "Invalid Signer"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "Failed to validate the signature"
    },
    {
      "code": 6002,
      "name": "InvalidBump",
      "msg": "Seeds constraint violated"
    },
    {
      "code": 6003,
      "name": "InvalidClaimant",
      "msg": "Invalid claimant"
    },
    {
      "code": 6004,
      "name": "OwnerMismatch",
      "msg": "Owner mismatch"
    },
    {
      "code": 6005,
      "name": "MintMismatch",
      "msg": "Mint should match"
    },
    {
      "code": 6006,
      "name": "ClaimAmountError",
      "msg": "Whitelist claim amount should be less than allowed"
    },
    {
      "code": 6007,
      "name": "ClaimExpiryError",
      "msg": "Token whitelist claim time expired"
    }
  ]
};

export const IDL: TokenDistributor = {
  "version": "0.1.0",
  "name": "token_distributor",
  "instructions": [
    {
      "name": "initDistributor",
      "accounts": [
        {
          "name": "distributor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitDistributorArgs"
          }
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "distributor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "claimCount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "ClaimArgs"
          }
        }
      ]
    },
    {
      "name": "transferWlTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "distributor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recipientWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "TransferTokensArgs"
          }
        }
      ]
    },
    {
      "name": "delegateWlTokens",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "distributor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "delegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "DelegateTokensArgs"
          }
        }
      ]
    },
    {
      "name": "updateDistributor",
      "accounts": [
        {
          "name": "distributor",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenWhitelistAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateDistributorArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "claimArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signature",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "message",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "claimBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "claimCount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "claimant",
            "type": "publicKey"
          },
          {
            "name": "tokenWhitelistMint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "delegateTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "distributor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "distributorBump",
            "type": "u8"
          },
          {
            "name": "tokenWhitelistMintBump",
            "type": "u8"
          },
          {
            "name": "tokenWhitelistMint",
            "type": "publicKey"
          },
          {
            "name": "config",
            "type": {
              "defined": "Config"
            }
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "initDistributorArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalTokenAmount",
            "type": "u64"
          },
          {
            "name": "initialAuthorityTokens",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "userClaimAmount",
            "type": "u8"
          },
          {
            "name": "tokenExpiryDate",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "transferTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateDistributorArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenExpiryDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "userClaimAmount",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "totalTokenAmount",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userClaimAmount",
            "type": "u8"
          },
          {
            "name": "tokenExpiryDate",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidSigner",
      "msg": "Invalid Signer"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "Failed to validate the signature"
    },
    {
      "code": 6002,
      "name": "InvalidBump",
      "msg": "Seeds constraint violated"
    },
    {
      "code": 6003,
      "name": "InvalidClaimant",
      "msg": "Invalid claimant"
    },
    {
      "code": 6004,
      "name": "OwnerMismatch",
      "msg": "Owner mismatch"
    },
    {
      "code": 6005,
      "name": "MintMismatch",
      "msg": "Mint should match"
    },
    {
      "code": 6006,
      "name": "ClaimAmountError",
      "msg": "Whitelist claim amount should be less than allowed"
    },
    {
      "code": 6007,
      "name": "ClaimExpiryError",
      "msg": "Token whitelist claim time expired"
    }
  ]
};
