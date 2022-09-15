export type NftMinter = {
  "version": "0.2.0",
  "name": "nft_minter",
  "instructions": [
    {
      "name": "initializeNftMinter",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createMint",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
            "defined": "CreateMintArgs"
          }
        }
      ]
    },
    {
      "name": "mintUnsignedNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMinterAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
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
            "defined": "MintUnsignedNftArgs"
          }
        }
      ]
    },
    {
      "name": "mintUnsignedCollectionNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftCollectionMasterEdition",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MintUnsignedCollectionNftArgs"
          }
        }
      ]
    },
    {
      "name": "mintSignedNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MintSignedNftArgs"
          }
        },
        {
          "name": "claimArgs",
          "type": {
            "defined": "ClaimArgs"
          }
        }
      ]
    },
    {
      "name": "mintSignedCollectionNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftCollectionMasterEdition",
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MintSignedCollectionNftArgs"
          }
        },
        {
          "name": "claimArgs",
          "type": {
            "defined": "ClaimArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "mintSignedCollectionNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "mintUri",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          },
          {
            "name": "nftCollectionMetadataBump",
            "type": "u8"
          },
          {
            "name": "nftCollectionMasterEditionBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "mintSignedNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "mintUri",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          }
        ]
      }
    },
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
          }
        ]
      }
    },
    {
      "name": "createMintArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "mintUnsignedCollectionNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          },
          {
            "name": "nftCollectionMetadataBump",
            "type": "u8"
          },
          {
            "name": "nftCollectionMasterEditionBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "mintUnsignedNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "claim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "claimBump",
            "type": "u8"
          },
          {
            "name": "claimant",
            "type": "publicKey"
          },
          {
            "name": "mintBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nftMinter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nftMinterBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CreateMetadataAccountsV3Error",
      "msg": "Create metadata accounts V3 error "
    },
    {
      "code": 6001,
      "name": "CreateMasterEditionV3Error",
      "msg": "Create master Edition V3 error "
    },
    {
      "code": 6002,
      "name": "VerifyCollectionV3Error",
      "msg": "Verify Collection v3 error "
    },
    {
      "code": 6003,
      "name": "SetAndVerifyCollectionV3Error",
      "msg": "Set and Verify Collection v3 error "
    },
    {
      "code": 6004,
      "name": "UpdateMetadataV2Error",
      "msg": "Update metadat v2 error"
    },
    {
      "code": 6005,
      "name": "UnauthorizedError",
      "msg": "Unauthorized minting of nft"
    }
  ]
};

export const IDL: NftMinter = {
  "version": "0.2.0",
  "name": "nft_minter",
  "instructions": [
    {
      "name": "initializeNftMinter",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createMint",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
            "defined": "CreateMintArgs"
          }
        }
      ]
    },
    {
      "name": "mintUnsignedNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMinterAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
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
            "defined": "MintUnsignedNftArgs"
          }
        }
      ]
    },
    {
      "name": "mintUnsignedCollectionNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftCollectionMasterEdition",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MintUnsignedCollectionNftArgs"
          }
        }
      ]
    },
    {
      "name": "mintSignedNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MintSignedNftArgs"
          }
        },
        {
          "name": "claimArgs",
          "type": {
            "defined": "ClaimArgs"
          }
        }
      ]
    },
    {
      "name": "mintSignedCollectionNft",
      "accounts": [
        {
          "name": "claimant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMinter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "claim",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "claimantMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMasterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftCollectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftCollectionMasterEdition",
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "MintSignedCollectionNftArgs"
          }
        },
        {
          "name": "claimArgs",
          "type": {
            "defined": "ClaimArgs"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "mintSignedCollectionNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "mintUri",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          },
          {
            "name": "nftCollectionMetadataBump",
            "type": "u8"
          },
          {
            "name": "nftCollectionMasterEditionBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "mintSignedNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "mintUri",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          }
        ]
      }
    },
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
          }
        ]
      }
    },
    {
      "name": "createMintArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "mintUnsignedCollectionNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          },
          {
            "name": "nftCollectionMetadataBump",
            "type": "u8"
          },
          {
            "name": "nftCollectionMasterEditionBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "mintUnsignedNftArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mintMetadataBump",
            "type": "u8"
          },
          {
            "name": "mintMasterEditionBump",
            "type": "u8"
          },
          {
            "name": "mintName",
            "type": "string"
          },
          {
            "name": "mintSymbol",
            "type": "string"
          },
          {
            "name": "isMasterEdition",
            "type": "bool"
          },
          {
            "name": "isParentNft",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "claim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "claimBump",
            "type": "u8"
          },
          {
            "name": "claimant",
            "type": "publicKey"
          },
          {
            "name": "mintBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nftMinter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nftMinterBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CreateMetadataAccountsV3Error",
      "msg": "Create metadata accounts V3 error "
    },
    {
      "code": 6001,
      "name": "CreateMasterEditionV3Error",
      "msg": "Create master Edition V3 error "
    },
    {
      "code": 6002,
      "name": "VerifyCollectionV3Error",
      "msg": "Verify Collection v3 error "
    },
    {
      "code": 6003,
      "name": "SetAndVerifyCollectionV3Error",
      "msg": "Set and Verify Collection v3 error "
    },
    {
      "code": 6004,
      "name": "UpdateMetadataV2Error",
      "msg": "Update metadat v2 error"
    },
    {
      "code": 6005,
      "name": "UnauthorizedError",
      "msg": "Unauthorized minting of nft"
    }
  ]
};
