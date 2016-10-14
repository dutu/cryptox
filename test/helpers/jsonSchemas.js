'use strict';

let schema = {};

schema.errorResult = {
    "title": "errorResult schema",
    "description": "Schema for results containing an error",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "minLength": 1
        },
        "data": {
            "type": "array"
        }
    }
};

schema.getRate = {
    "title": "getRate schema",
    "description": "Schema for getRate() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["pair", "rate"],
                "properties": {
                    "pair": {
                        "type": "string",
                        "pattern": "[A-Z0-9]{3,4}_[A-Z0-9]{3,4}",
                    },
                    "rate": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    }
                }
            }
        }
    }
};

schema.getTicker = {
    "title": "getTicker schema",
    "description": "Schema for getTicker() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["pair", "last", "bid", "ask", "volume"],
                "properties": {
                    "pair": {
                        "type": "string",
                        "pattern": "[A-Z0-9]{3,4}_[A-Z0-9]{3,4}",
                    },
                    "last": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "bid": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "ask": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "volume": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    }
                }
            }
        }
    }
};

schema.getOrderBook = {
    "title": "getOrderBook schema",
    "description": "Schema for getOrderBook() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["pair", "asks", "bids"],
                "properties": {
                    "pair": {
                        "type": "string",
                        "pattern": "[A-Z0-9]{3,4}_[A-Z0-9]{3,4}",
                    },
                    "asks": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                            "type": "object",
                            "required": ["price", "volume"],
                            "properties": {
                                "price": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                },
                                "volume": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                }
                            }
                        }
                    },
                    "bids": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                            "type": "object",
                            "required": ["price", "volume"],
                            "properties": {
                                "price": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                },
                                "volume": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

schema.getTrades = {
    "title": "getTrades schema",
    "description": "Schema for getTrades() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["pair", "trades"],
                "properties": {
                    "pair": {
                        "type": "string",
                        "pattern": "[A-Z0-9]{3,4}_[A-Z0-9]{3,4}",
                    },
                    "trades": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                            "type": "object",
                            "required": ["timestamp", "trade_id", "price", "amount", "type"],
                            "properties": {
                                "timestamp": {
                                    "type": "string",
                                },
                                "trade_id": {
                                    "type": "string",
                                },
                                "price": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                },
                                "amount": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                },
                                "type" : {
                                    "enum": ["buy", "sell"],
                                }
                            }
                        }
                    },
                }
            }
        }
    }
};

schema.getFee = {
    "title": "getFee schema",
    "description": "Schema for getFee() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["pair", "maker_fee", "taker_fee"],
                "properties": {
                    "pair": {
                        "type": "string",
                        "pattern": "[A-Z0-9]{3,4}_[A-Z0-9]{3,4}",
                    },
                    "maker_fee": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "taker_fee": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    }
                }
            }
        }
    }
};

schema.getTransactions = {
    "title": "getTransactions schema",
    "description": "Schema for getTransactions() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["tx_id", "datetime", "type", "symbol", "amount_base", "amount_counter", "rate", "fee_base", "fee_counter", "order_id", "add_info"],
                "properties": {
                    "tx_id": {
                        "type": "string"
                    },
                    "datetime": {
                        "type": "string",
                        "minLength": 1
                    },
                    "type": {
                        "type": "string",
                        "minLength": 1
                    },
                    "symbol": {
                        "type": "string",
                        "pattern": "^([A-Z0-9]{3,4}(_[A-Z0-9]{3,4})?)$",
                    },
                    "amount_base": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "amount_counter": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "rate": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "fee_base": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "fee_counter": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "order_id": {
                        "type": "string"
                    },
                    "add_info": {
                        "type": "string"
                    }
                }
            }
        }
    }
};

schema.getBalance = {
    "title": "getBalance schema",
    "description": "Schema for getBalance() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["total", "available"],
                "properties": {
                    "total": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["currency", "amount"],
                            "properties": {
                                "currency": {
                                    "type": "string",
                                    "pattern": "[A-Z0-9]{3,4}",
                                },
                                "amount": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                }
                            }
                        }
                    },
                    "available": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["currency", "amount"],
                            "properties": {
                                "currency": {
                                    "type": "string",
                                    "pattern": "[A-Z0-9]{3,4}",
                                },
                                "amount": {
                                    "type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

schema.getMarginPositions = {
    "title": "getMarginPositions schema",
    "description": "Schema for getMarginPositions() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "minItems": 0,
            "items": {
                "type": "object",
                "required": ["pair", "type", "contract_type", "base_price", "amount", "pl"],
                "properties": {
                    "pair": {
                        "type": "string",
                        "pattern": "[A-Z0-9]{3,4}_[A-Z0-9]{3,4}",
                    },
                    "type": {
                        "enum": ["none", "long", "short"],
                    },
                    "contract_type": {
                        "type": "string",
                    },
                    "base_price": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                    },
                    "amount": {
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?",
                        },
                    "pl": {
                        "type": "string",
                        "pattern": "[-+]?[0-9]+(\.[0-9]+)?",
                    },
                }
            }
        }
    }
};

schema.getOpenOrders = {
    "title": "getOpenOrders schema",
    "description": "Schema for getOpenOrders() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["order_id", "pair", "type", "amount", "rate", "created_at"],
                "properties": {
                    "order_id": {
                        "type": "string"
                    },
                    "pair": {
                        "type": "string",
                        "pattern": "[A-Z0-9]{3,4}_[A-Z0-9]{3,4}",
                    },
                    "type": {
                        "type": "string"
                    },
                    "amount": {
                        "type": "string"
                    },
                    "rate": {
                        "type": "string"
                    },
                    "created_at": {
                        "type": "string"
                    }
                }
            }
        }
    }
};

schema.postSellOrder = {
    "title": "postSellOrder schema",
    "description": "Schema for postSellOrder() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["order_id", "created_at"],
                "properties": {
                    "order_id": {
                        "type": "string"
                    },
                    "created_at": {
                        "type": "string"
                    }
                }
            }
        }
    }
};

schema.postBuyOrder = {
    "title": "postBuyOrder schema",
    "description": "Schema for postBuyOrder() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string",
            "maxLength": 0
        },
        "data": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["order_id", "created_at"],
                "properties": {
                    "order_id": {
                        "type": "string"
                    },
                    "created_at": {
                        "type": "string"
                    }
                }
            }
        }
    }
};

schema.getLendBook = {
	"title": "getLendBook schema",
	"description": "Schema for getLendBook() results",
	"type": "object",
	"required": ["timestamp", "error", "data"],
	"properties": {
		"timestamp": {
			"type": "string",
			"minLength": 1
		},
		"error": {
			"type": "string",
			"maxLength": 0
		},
		"data": {
			"type": "array",
			"minItems": 1,
			"items": {
				"type": "object",
				"required": ["currency", "asks", "bids"],
				"properties": {
					"currency": {
						"type": "string",
                        "pattern": "[A-Z0-9]{3,4}",
					},
					"asks": {
						"type": "array",
						"items": {
							"type": "object",
							"required": ["rate", "amount", "period", "created_at", "frr"],
							"properties": {
								"rate": {
									"type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
								},
								"amount": {
									"type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
								},
								"period": {
									"type": "number",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
								},
								"created_at": {
									"type": "string"
								},
								"frr": {
                                    "enum": ["yes", "no"],
								}
							}
						}
					},
					"bids": {
						"type": "array",
						"minItems": 1,
						"items": {
							"type": "object",
							"required": ["rate", "amount", "period", "created_at", "frr"],
							"properties": {
								"rate": {
									"type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
								},
								"amount": {
									"type": "string",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
								},
								"period": {
									"type": "number",
                                    "pattern": "[0-9]+(\.[0-9]+)?",
								},
								"created_at": {
									"type": "string"
								},
								"frr": {
                                    "enum": ["yes", "no"],
								}
							}
						}
					}
				}
			}
		}
	}
};

module.exports = schema;
