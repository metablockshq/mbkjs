export type MetaNft = {
  "version": "0.1.0",
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
          "name": "metaNftMintAta",
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
          "name": "universe",
          "isMut": false,
          "isSigner": false
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
          "name": "universe",
          "isMut": false,
          "isSigner": false
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
          "name": "metaNftMintAta",
          "isMut": true,
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
      "name": "metaNftCountArgs",
      "type": {
        "kind": "struct",
        "fields": []
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
  ]
};

export const IDL: MetaNft = {
  "version": "0.1.0",
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
          "name": "metaNftMintAta",
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
          "name": "universe",
          "isMut": false,
          "isSigner": false
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
          "name": "universe",
          "isMut": false,
          "isSigner": false
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
          "name": "metaNftMintAta",
          "isMut": true,
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
      "name": "metaNftCountArgs",
      "type": {
        "kind": "struct",
        "fields": []
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
  ]
};
