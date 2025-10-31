export const morpherOracleAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "AddressBlackListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "AddressWhiteListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_closeSharesAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_openMPHTokenAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "_tradeDirection",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_orderLeverage",
				"type": "uint256"
			}
		],
		"name": "AdminLiquidationOrderCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_oracleAddress",
				"type": "address"
			}
		],
		"name": "AdminOrderCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "CallBackCollectionAddressChange",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "CallbackAddressDisabled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "CallbackAddressEnabled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			}
		],
		"name": "DelistMarketComplete",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_processedUntilIndex",
				"type": "uint256"
			}
		],
		"name": "DelistMarketIncomplete",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "version",
				"type": "uint8"
			}
		],
		"name": "Initialized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "LinkMorpherState",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "LinkTradeEngine",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "LinkWMatic",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			}
		],
		"name": "LiquidationOrderCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "LockedPriceForClosingPositions",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "_paused",
				"type": "bool"
			}
		],
		"name": "OraclePaused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			}
		],
		"name": "OrderCancellationRequestedEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_oracleAddress",
				"type": "address"
			}
		],
		"name": "OrderCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_closeSharesAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_openMPHTokenAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "_tradeDirection",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_orderLeverage",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_onlyIfPriceBelow",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_onlyIfPriceAbove",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_goodFrom",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_goodUntil",
				"type": "uint256"
			}
		],
		"name": "OrderCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_closeSharesAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_openMPHTokenAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "_tradeDirection",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_orderLeverage",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_onlyIfPriceBelow",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_onlyIfPriceAbove",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_goodFrom",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_goodUntil",
				"type": "uint256"
			}
		],
		"name": "OrderFailed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_unadjustedMarketPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_spread",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_positionLiquidationTimestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_timeStamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_newLongShares",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_newShortShares",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_newMeanEntry",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_newMeanSprad",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_newMeanLeverage",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_liquidationPrice",
				"type": "uint256"
			}
		],
		"name": "OrderProcessed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_gasForCallback",
				"type": "uint256"
			}
		],
		"name": "SetGasForCallback",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "_useWhiteList",
				"type": "bool"
			}
		],
		"name": "SetUseWhiteList",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ADMINISTRATOR_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "ORACLEOPERATOR_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "PAUSER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "UNISWAP_ROUTER",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "_HASHED_NAME",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "_HASHED_VERSION",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "_PERMIT_TYPEHASH",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "_TYPE_HASH",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "callBackAddress",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "callBackCollectionAddress",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "gasForCallback",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "goodFrom",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "goodUntil",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "orderCancellationRequested",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "poolFee",
		"outputs": [
			{
				"internalType": "uint24",
				"name": "",
				"type": "uint24"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "priceAbove",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "priceBelow",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "useWhiteList",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "wMaticAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "whiteList",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_morpherState",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_gasCollectionAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_gasForCallback",
				"type": "uint256"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setStateAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setWmaticAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_gasForCallback",
				"type": "uint256"
			}
		],
		"name": "overrideGasForCallback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "setCallbackCollectionAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_closeSharesAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_openMPHTokenAmount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_tradeDirection",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_orderLeverage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_onlyIfPriceBelow",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_onlyIfPriceAbove",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_goodFrom",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_goodUntil",
				"type": "uint256"
			}
		],
		"name": "emitOrderFailed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "_marketId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "_closeSharesAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_openMPHTokenAmount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "_tradeDirection",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "_orderLeverage",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceAbove",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceBelow",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodUntil",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodFrom",
						"type": "uint256"
					}
				],
				"internalType": "struct MorpherOracle.CreateOrderStruct",
				"name": "createOrderParams",
				"type": "tuple"
			}
		],
		"name": "createOrder",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			}
		],
		"stateMutability": "payable",
		"type": "function",
		"payable": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_closeSharesAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_openMPHTokenAmount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_tradeDirection",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "_orderLeverage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_onlyIfPriceAbove",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_onlyIfPriceBelow",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_goodUntil",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_goodFrom",
				"type": "uint256"
			}
		],
		"name": "createOrder",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			}
		],
		"stateMutability": "payable",
		"type": "function",
		"payable": true
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "_marketId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "_closeSharesAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_openMPHTokenAmount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "_tradeDirection",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "_orderLeverage",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceAbove",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceBelow",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodUntil",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodFrom",
						"type": "uint256"
					}
				],
				"internalType": "struct MorpherOracle.CreateOrderStruct",
				"name": "createOrderParams",
				"type": "tuple"
			},
			{
				"internalType": "address",
				"name": "_addressPositionOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "createOrderPermittedBySignature",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "orderId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "_marketId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "_closeSharesAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_openMPHTokenAmount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "_tradeDirection",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "_orderLeverage",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceAbove",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceBelow",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodUntil",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodFrom",
						"type": "uint256"
					}
				],
				"internalType": "struct MorpherOracle.CreateOrderStruct",
				"name": "createOrderParams",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "tokenAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minOutValue",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "v",
						"type": "uint8"
					},
					{
						"internalType": "bytes32",
						"name": "r",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "s",
						"type": "bytes32"
					}
				],
				"internalType": "struct MorpherOracle.TokenPermitEIP712Struct",
				"name": "inputToken",
				"type": "tuple"
			}
		],
		"name": "createOrderFromToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "_marketId",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "_closeSharesAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_openMPHTokenAmount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "_tradeDirection",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "_orderLeverage",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceAbove",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_onlyIfPriceBelow",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodUntil",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_goodFrom",
						"type": "uint256"
					}
				],
				"internalType": "struct MorpherOracle.CreateOrderStruct",
				"name": "createOrderParams",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "tokenAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minOutValue",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deadline",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "v",
						"type": "uint8"
					},
					{
						"internalType": "bytes32",
						"name": "r",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "s",
						"type": "bytes32"
					}
				],
				"internalType": "struct MorpherOracle.TokenPermitEIP712Struct",
				"name": "inputToken",
				"type": "tuple"
			},
			{
				"internalType": "address",
				"name": "_addressPositionOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "createOrderFromToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "nonces",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "DOMAIN_SEPARATOR",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			}
		],
		"name": "initiateCancelOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			}
		],
		"name": "cancelOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			}
		],
		"name": "adminCancelOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "checkOrderConditions",
		"outputs": [
			{
				"internalType": "bool",
				"name": "_conditionsMet",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			}
		],
		"name": "createLiquidationOrder",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			}
		],
		"stateMutability": "payable",
		"type": "function",
		"payable": true
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_unadjustedMarketPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_spread",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_liquidationTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_timeStamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_gasForNextCallback",
				"type": "uint256"
			}
		],
		"name": "__callback",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "lastUpdated",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "longShares",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "shortShares",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "meanEntryPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "meanEntrySpread",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "meanEntryLeverage",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "liquidationPrice",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "positionHash",
						"type": "bytes32"
					}
				],
				"internalType": "struct MorpherTradeEngine.position",
				"name": "createdPosition",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			},
			{
				"internalType": "bool",
				"name": "_startFromScratch",
				"type": "bool"
			}
		],
		"name": "delistMarket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_marketId",
				"type": "bytes32"
			}
		],
		"name": "adminLiquidationOrder",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "_orderId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "orderId",
				"type": "bytes32"
			}
		],
		"name": "getTradeEngineFromOrderId",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	}
] as const;

export const morpherStakingABI = [
	{
	  "type": "function",
	  "name": "_STAKE_TYPEHASH",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "_UNSTAKE_TYPEHASH",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getStake",
	  "inputs": [
		{
		  "name": "_address",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "_poolShares",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getStakeValue",
	  "inputs": [
		{
		  "name": "_address",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "_value",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "_lastUpdate",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTotalPooledValue",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "_totalPooled",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "interestRate",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "lastReward",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "lockupPeriod",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "minimumStake",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "nonces",
	  "inputs": [
		{
		  "name": "owner",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "poolShareValue",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "poolShares",
	  "inputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "numPoolShares",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "lockedUntil",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "stake",
	  "inputs": [
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "_poolShares",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "stakeWithPermit",
	  "inputs": [
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "_owner",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "deadline",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "v",
		  "type": "uint8",
		  "internalType": "uint8"
		},
		{
		  "name": "r",
		  "type": "bytes32",
		  "internalType": "bytes32"
		},
		{
		  "name": "s",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "stakingAddress",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "totalShares",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "unstake",
	  "inputs": [
		{
		  "name": "_numOfShares",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "unstakeWithPermit",
	  "inputs": [
		{
		  "name": "_shares",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "_owner",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "deadline",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "v",
		  "type": "uint8",
		  "internalType": "uint8"
		},
		{
		  "name": "r",
		  "type": "bytes32",
		  "internalType": "bytes32"
		},
		{
		  "name": "s",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "event",
	  "name": "Staked",
	  "inputs": [
		{
		  "name": "userAddress",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": true,
		  "internalType": "uint256"
		},
		{
		  "name": "poolShares",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "lockedUntil",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Unstaked",
	  "inputs": [
		{
		  "name": "userAddress",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": true,
		  "internalType": "uint256"
		},
		{
		  "name": "poolShares",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	}
  ] as const;

export const morpherAirdropAbi = [
	{
	  "type": "constructor",
	  "inputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "fallback",
	  "stateMutability": "payable"
	},
	{
	  "type": "receive",
	  "stateMutability": "payable"
	},
	{
	  "type": "function",
	  "name": "adminAuthorizeAndSend",
	  "inputs": [
		{
		  "name": "_recipient",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "adminSendAirdrop",
	  "inputs": [
		{
		  "name": "_recipient",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "adminSendLockedRewards",
	  "inputs": [
		{
		  "name": "_recipient",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "adminSendSomeAirdrop",
	  "inputs": [
		{
		  "name": "_recipient",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "airdropAdmin",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "claimAirdrop",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "claimSomeAirdrop",
	  "inputs": [
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "getAirdrop",
	  "inputs": [
		{
		  "name": "_userAddress",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "_claimed",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "_authorized",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getAirdropAuthorized",
	  "inputs": [
		{
		  "name": "_userAddress",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "_balance",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getAirdropClaimed",
	  "inputs": [
		{
		  "name": "_userAddress",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "_amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "initialize",
	  "inputs": [
		{
		  "name": "_airdropAdminAddress",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_morpherToken",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_coldStorageOwnerAddress",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "morpherToken",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "owner",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "renounceOwnership",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setAirdropAdmin",
	  "inputs": [
		{
		  "name": "_address",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setAirdropAuthorized",
	  "inputs": [
		{
		  "name": "_userAddress",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_authorized",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setMorpherTokenAddress",
	  "inputs": [
		{
		  "name": "_address",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "totalAirdropAuthorized",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "totalAirdropClaimed",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "transferOwnership",
	  "inputs": [
		{
		  "name": "newOwner",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "event",
	  "name": "AirdropSent",
	  "inputs": [
		{
		  "name": "_operator",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "_recipient",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "_amountClaimed",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "_amountAuthorized",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Initialized",
	  "inputs": [
		{
		  "name": "version",
		  "type": "uint8",
		  "indexed": false,
		  "internalType": "uint8"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "OwnershipTransferred",
	  "inputs": [
		{
		  "name": "previousOwner",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "newOwner",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "SetAirdropAuthorized",
	  "inputs": [
		{
		  "name": "_recipient",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "_amountClaimed",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "_amountAuthorized",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	}
  ] as const;

export const morpherTokenAbi = [
	{
	  "type": "function",
	  "name": "allowance",
	  "inputs": [
		{
		  "name": "owner",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "spender",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "approve",
	  "inputs": [
		{
		  "name": "spender",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "value",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "bool",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "balanceOf",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "burn",
	  "inputs": [
		{
		  "name": "from",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "decimals",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint8",
		  "internalType": "uint8"
		}
	  ],
	  "stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "version",
		"outputs": [
		  {
			"name": "",
			"type": "string"
		  }
		],
		"payable": false,
		"type": "function"
	},
	{
	  "type": "function",
	  "name": "deposit",
	  "inputs": [
		{
		  "name": "user",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "depositData",
		  "type": "bytes",
		  "internalType": "bytes"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "getDailyMintedTransferLimit",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getDailyMintedTransfers",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getLockedRewards",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getRestrictTransfers",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "bool",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTimeLock",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "amount",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "lockedUntil",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTotalLockedRewards",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTotalTimeLocked",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTotalTokensInPositions",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTradeableBalanceOf",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "getTransferredInTokens",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "initialize",
	  "inputs": [
		{
		  "name": "_morpherAccessControlAddress",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_morpherStateAddress",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "_permitName",
		  "type": "string",
		  "internalType": "string"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "lockRewards",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "lockTokensForTime",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "lockDuration",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "mint",
	  "inputs": [
		{
		  "name": "to",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "morpherAccessControl",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "contract MorpherAccessControl"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "morpherState",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "address",
		  "internalType": "contract MorpherState"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "name",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "string",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "nonces",
	  "inputs": [
		{
		  "name": "owner",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "pause",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "paused",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "bool",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "permit",
	  "inputs": [
		{
		  "name": "owner",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "spender",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "value",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "deadline",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "v",
		  "type": "uint8",
		  "internalType": "uint8"
		},
		{
		  "name": "r",
		  "type": "bytes32",
		  "internalType": "bytes32"
		},
		{
		  "name": "s",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "proxiableUUID",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "setDailyMintedTransferLimit",
	  "inputs": [
		{
		  "name": "limit",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setMorpherStateAddress",
	  "inputs": [
		{
		  "name": "_morpherState",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setRestrictTransfers",
	  "inputs": [
		{
		  "name": "restrictTransfers",
		  "type": "bool",
		  "internalType": "bool"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "setTotalInPositions",
	  "inputs": [
		{
		  "name": "totalTokensInPositions",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "symbol",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "string",
		  "internalType": "string"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "totalSupply",
	  "inputs": [],
	  "outputs": [
		{
		  "name": "",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "stateMutability": "view"
	},
	{
	  "type": "function",
	  "name": "transfer",
	  "inputs": [
		{
		  "name": "to",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "value",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "bool",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "transferFrom",
	  "inputs": [
		{
		  "name": "from",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "to",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "value",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [
		{
		  "name": "",
		  "type": "bool",
		  "internalType": "bool"
		}
	  ],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "unlockExpiredTokens",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "unlockRewards",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "unpause",
	  "inputs": [],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "function",
	  "name": "upgradeToAndCall",
	  "inputs": [
		{
		  "name": "newImplementation",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "data",
		  "type": "bytes",
		  "internalType": "bytes"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "payable"
	},
	{
	  "type": "function",
	  "name": "withdraw",
	  "inputs": [
		{
		  "name": "amount",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ],
	  "outputs": [],
	  "stateMutability": "nonpayable"
	},
	{
	  "type": "event",
	  "name": "Approval",
	  "inputs": [
		{
		  "name": "owner",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "spender",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "value",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "DailyMintedTransferLimitUpdated",
	  "inputs": [
		{
		  "name": "oldLimit",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "newLimit",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "EIP712DomainChanged",
	  "inputs": [],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Initialized",
	  "inputs": [
		{
		  "name": "version",
		  "type": "uint64",
		  "indexed": false,
		  "internalType": "uint64"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "MigrationTokensLocked",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "lockedUntil",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "MintedTokensTransferred",
	  "inputs": [
		{
		  "name": "from",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "to",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Paused",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "indexed": false,
		  "internalType": "address"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "RewardsLocked",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "RewardsUnlocked",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "SetRestrictTransfers",
	  "inputs": [
		{
		  "name": "_oldValue",
		  "type": "bool",
		  "indexed": false,
		  "internalType": "bool"
		},
		{
		  "name": "_newValue",
		  "type": "bool",
		  "indexed": false,
		  "internalType": "bool"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "SetTotalTokensInPositions",
	  "inputs": [
		{
		  "name": "_oldValue",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "_newValue",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "SetTotalTokensOnOtherChain",
	  "inputs": [
		{
		  "name": "_oldValue",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "_newValue",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "TokensLocked",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		},
		{
		  "name": "lockedUntil",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "TokensTransferredIn",
	  "inputs": [
		{
		  "name": "to",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "TokensUnlocked",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "amount",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Transfer",
	  "inputs": [
		{
		  "name": "from",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "to",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		},
		{
		  "name": "value",
		  "type": "uint256",
		  "indexed": false,
		  "internalType": "uint256"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Unpaused",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "indexed": false,
		  "internalType": "address"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "event",
	  "name": "Upgraded",
	  "inputs": [
		{
		  "name": "implementation",
		  "type": "address",
		  "indexed": true,
		  "internalType": "address"
		}
	  ],
	  "anonymous": false
	},
	{
	  "type": "error",
	  "name": "AddressEmptyCode",
	  "inputs": [
		{
		  "name": "target",
		  "type": "address",
		  "internalType": "address"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ECDSAInvalidSignature",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "ECDSAInvalidSignatureLength",
	  "inputs": [
		{
		  "name": "length",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ECDSAInvalidSignatureS",
	  "inputs": [
		{
		  "name": "s",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC1967InvalidImplementation",
	  "inputs": [
		{
		  "name": "implementation",
		  "type": "address",
		  "internalType": "address"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC1967NonPayable",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "ERC20InsufficientAllowance",
	  "inputs": [
		{
		  "name": "spender",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "allowance",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "needed",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC20InsufficientBalance",
	  "inputs": [
		{
		  "name": "sender",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "balance",
		  "type": "uint256",
		  "internalType": "uint256"
		},
		{
		  "name": "needed",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC20InvalidApprover",
	  "inputs": [
		{
		  "name": "approver",
		  "type": "address",
		  "internalType": "address"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC20InvalidReceiver",
	  "inputs": [
		{
		  "name": "receiver",
		  "type": "address",
		  "internalType": "address"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC20InvalidSender",
	  "inputs": [
		{
		  "name": "sender",
		  "type": "address",
		  "internalType": "address"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC20InvalidSpender",
	  "inputs": [
		{
		  "name": "spender",
		  "type": "address",
		  "internalType": "address"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC2612ExpiredSignature",
	  "inputs": [
		{
		  "name": "deadline",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "ERC2612InvalidSigner",
	  "inputs": [
		{
		  "name": "signer",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "owner",
		  "type": "address",
		  "internalType": "address"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "EnforcedPause",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "ExpectedPause",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "FailedCall",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "InvalidAccountNonce",
	  "inputs": [
		{
		  "name": "account",
		  "type": "address",
		  "internalType": "address"
		},
		{
		  "name": "currentNonce",
		  "type": "uint256",
		  "internalType": "uint256"
		}
	  ]
	},
	{
	  "type": "error",
	  "name": "InvalidInitialization",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "NotInitializing",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "UUPSUnauthorizedCallContext",
	  "inputs": []
	},
	{
	  "type": "error",
	  "name": "UUPSUnsupportedProxiableUUID",
	  "inputs": [
		{
		  "name": "slot",
		  "type": "bytes32",
		  "internalType": "bytes32"
		}
	  ]
	}
  ] as const;