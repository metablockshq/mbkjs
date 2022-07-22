export type MetaTreasury = {
  "version": "1.0.0",
  "name": "meta_treasury",
  "instructions": [
    {
      "name": "initTreasury",
      "accounts": [
        {
          "name": "treasury",
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
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitTreasuryArgs"
          }
        }
      ]
    },
    {
      "name": "updateTreasury",
      "accounts": [
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newAuthority",
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
            "defined": "UpdateTreasuryArgs"
          }
        }
      ]
    },
    {
      "name": "updateFixedFee",
      "accounts": [
        {
          "name": "treasury",
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
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateFixedFeeArgs"
          }
        }
      ]
    },
    {
      "name": "getTreasury",
      "accounts": [
        {
          "name": "treasury",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "Treasury"
      }
    }
  ],
  "accounts": [
    {
      "name": "treasury",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "treasuryBump",
            "type": "u8"
          },
          {
            "name": "fixedFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initTreasuryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fixedFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateTreasuryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fixedFee",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "updateFixedFeeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fixedFee",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const IDL: MetaTreasury = {
  "version": "1.0.0",
  "name": "meta_treasury",
  "instructions": [
    {
      "name": "initTreasury",
      "accounts": [
        {
          "name": "treasury",
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
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitTreasuryArgs"
          }
        }
      ]
    },
    {
      "name": "updateTreasury",
      "accounts": [
        {
          "name": "treasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newAuthority",
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
            "defined": "UpdateTreasuryArgs"
          }
        }
      ]
    },
    {
      "name": "updateFixedFee",
      "accounts": [
        {
          "name": "treasury",
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
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateFixedFeeArgs"
          }
        }
      ]
    },
    {
      "name": "getTreasury",
      "accounts": [
        {
          "name": "treasury",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "Treasury"
      }
    }
  ],
  "accounts": [
    {
      "name": "treasury",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "treasuryBump",
            "type": "u8"
          },
          {
            "name": "fixedFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initTreasuryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fixedFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateTreasuryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fixedFee",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "updateFixedFeeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fixedFee",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
