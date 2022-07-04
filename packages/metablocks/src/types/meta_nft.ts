export type MetaNft = {
  "version": "0.3.0",
  "name": "meta_nft",
  "instructions": [
    {
      "name": "initMetaNftV1",
      "accounts": [
        {
          "name": "metaNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "treasuryAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "universe",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitMetaNftArgs"
          }
        }
      ]
    },
    {
      "name": "createMetaNftV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metaNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMetaNftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
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
        },
        {
          "name": "metaNftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metaNftMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateMetaNftArgs"
          }
        }
      ]
    },
    {
      "name": "addMetaNftCountV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MetaNftCountArgs"
          }
        }
      ]
    },
    {
      "name": "subMetaNftCountV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MetaNftCountArgs"
          }
        }
      ]
    },
    {
      "name": "closeMetaNftV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "metaNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMetaNftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAuthority",
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
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "metaNftCountArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "createMetaNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "creators",
            "type": {
              "vec": {
                "defined": "Creator"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "sellerFeeBasisPoints",
            "type": "u16"
          },
          {
            "name": "isMutable",
            "type": "bool"
          },
          {
            "name": "isMetaNftMasterEdition",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "isMetaDataInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "initMetaNftArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "metaNft",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftCounts",
            "type": "u8"
          },
          {
            "name": "metaNftBump",
            "type": "u8"
          },
          {
            "name": "metaNftMintBump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "payer",
            "type": "publicKey"
          },
          {
            "name": "universe",
            "type": "publicKey"
          },
          {
            "name": "treasuryAuthority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Creator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "share",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AddCountError",
      "msg": "Could not add the nft count"
    },
    {
      "code": 6001,
      "name": "SubCountError",
      "msg": "Could not sub the nft count"
    },
    {
      "code": 6002,
      "name": "InvalidSigner",
      "msg": "Invalid Signer"
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Unauthorized to access this instruction"
    },
    {
      "code": 6004,
      "name": "NoMetadata",
      "msg": "No Metadata provided for the nft"
    },
    {
      "code": 6005,
      "name": "InvalidTreasury",
      "msg": "Invalid treasury account"
    }
  ]
};

export const IDL: MetaNft = {
  "version": "0.3.0",
  "name": "meta_nft",
  "instructions": [
    {
      "name": "initMetaNftV1",
      "accounts": [
        {
          "name": "metaNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "treasuryAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "universe",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitMetaNftArgs"
          }
        }
      ]
    },
    {
      "name": "createMetaNftV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metaNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMetaNftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
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
        },
        {
          "name": "metaNftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metaNftMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateMetaNftArgs"
          }
        }
      ]
    },
    {
      "name": "addMetaNftCountV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MetaNftCountArgs"
          }
        }
      ]
    },
    {
      "name": "subMetaNftCountV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MetaNftCountArgs"
          }
        }
      ]
    },
    {
      "name": "closeMetaNftV1",
      "accounts": [
        {
          "name": "metaNft",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "metaNftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMetaNftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAuthority",
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
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "metaNftCountArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "createMetaNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "creators",
            "type": {
              "vec": {
                "defined": "Creator"
              }
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "sellerFeeBasisPoints",
            "type": "u16"
          },
          {
            "name": "isMutable",
            "type": "bool"
          },
          {
            "name": "isMetaNftMasterEdition",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "isMetaDataInitialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "initMetaNftArgs",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "metaNft",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftCounts",
            "type": "u8"
          },
          {
            "name": "metaNftBump",
            "type": "u8"
          },
          {
            "name": "metaNftMintBump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "payer",
            "type": "publicKey"
          },
          {
            "name": "universe",
            "type": "publicKey"
          },
          {
            "name": "treasuryAuthority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Creator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "share",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AddCountError",
      "msg": "Could not add the nft count"
    },
    {
      "code": 6001,
      "name": "SubCountError",
      "msg": "Could not sub the nft count"
    },
    {
      "code": 6002,
      "name": "InvalidSigner",
      "msg": "Invalid Signer"
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Unauthorized to access this instruction"
    },
    {
      "code": 6004,
      "name": "NoMetadata",
      "msg": "No Metadata provided for the nft"
    },
    {
      "code": 6005,
      "name": "InvalidTreasury",
      "msg": "Invalid treasury account"
    }
  ]
};
