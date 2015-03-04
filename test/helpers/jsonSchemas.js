
var schema = {};

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
                        "type": "number"
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
                        "type": "number"
                    },
                    "bid": {
                        "type": "number"
                    },
                    "ask": {
                        "type": "number"
                    },
                    "volume": {
                        "type": "number"
                    }
                }
            }
        }
    }
};

schema.getOrderBook = {
    "title": "getOrderBook schema",
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
                                    "type": "number"
                                },
                                "volume": {
                                    "type": "number"
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
                                    "type": "number"
                                },
                                "volume": {
                                    "type": "number"
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
                        "type": "number"
                    },
                    "taker_fee": {
                        "type": "number"
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
                        "type": "number"
                    },
                    "amount_counter": {
                        "type": "number"
                    },
                    "rate": {
                        "type": "number"
                    },
                    "fee_base": {
                        "type": "number"
                    },
                    "fee_counter": {
                        "type": "number"
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
                                    "type": "number"
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
                                    "type": "number"
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
            "minItems": 1,
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
                        "type": "number"
                    },
                    "rate": {
                        "type": "number"
                    },
                    "created_at": {
                        "type": "string"
                    }
                }
            }
        }
    }
};

module.exports = schema;
