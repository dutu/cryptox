
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
                        "type": "string"
                    },
                    "rate": {
                        "type": "string"
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
                        "type": "string"
                    },
                    "last": {
                        "type": "string"
                    },
                    "bid": {
                        "type": "string"
                    },
                    "ask": {
                        "type": "string"
                    },
                    "volume": {
                        "type": "string"
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
                        "type": "string"
                    },
                    "asks": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                            "type": "object",
                            "required": ["price", "volume"],
                            "properties": {
                                "price": {
                                    "type": "string"
                                },
                                "volume": {
                                    "type": "string"
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
                                    "type": "string"
                                },
                                "volume": {
                                    "type": "string"
                                }
                            }
                        }
                    }
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
                        "type": "string"
                    },
                    "maker_fee": {
                        "type": "string"
                    },
                    "taker_fee": {
                        "type": "string"
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
                        "minLength": 3,
                        "maxLength": 6
                    },
                    "amount_base": {
                        "type": "string"
                    },
                    "amount_counter": {
                        "type": "string"
                    },
                    "rate": {
                        "type": "string"
                    },
                    "fee_base": {
                        "type": "string"
                    },
                    "fee_counter": {
                        "type": "string"
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
                                    "type": "string"
                                },
                                "amount": {
                                    "type": "string"
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
                                    "type": "string"
                                },
                                "amount": {
                                    "type": "string"
                                }
                            }
                        }
                    }
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
                        "type": "string"
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
						"type": "string"
					},
					"asks": {
						"type": "array",
						"items": {
							"type": "object",
							"required": ["rate", "amount", "period", "created_at", "frr"],
							"properties": {
								"rate": {
									"type": "string"
								},
								"amount": {
									"type": "string"
								},
								"period": {
									"type": "number"
								},
								"created_at": {
									"type": "string"
								},
								"frr": {
									"type": "string"
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
									"type": "string"
								},
								"amount": {
									"type": "string"
								},
								"period": {
									"type": "number"
								},
								"created_at": {
									"type": "string"
								},
								"frr": {
									"type": "string"
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
