
var schema = {};

schema.errorResult = {
    "title": "Schema for results containing an error",
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
            "type": "array",
        }
    }
};

schema.getRate = {
    "title": "Schema for getRate() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string"
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
                        "type": "number",
                    }
                }
            }
        }
    }
};

schema.getTicker = {
    "title": "Schema for getTicker() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string"
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
                        "type": "number",
                    },
                    "bid": {
                        "type": "number",
                    },
                    "ask": {
                        "type": "number",
                    },
                    "volume": {
                        "type": "number",
                    },
                }
            }
        }
    }
};

schema.getOrderBook = {
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
            "type": "string"
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
                                    "type": "number",
                                },
                                "volume": {
                                    "type": "number",
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
                                    "type": "number",
                                },
                                "volume": {
                                    "type": "number",
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
    "title": "Schema for getFee() results",
    "type": "object",
    "required": ["timestamp", "error", "data"],
    "properties": {
        "timestamp": {
            "type": "string",
            "minLength": 1
        },
        "error": {
            "type": "string"
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
                        "type": "number",
                    },
                    "taker_fee": {
                        "type": "number",
                    }
                }
            }
        }
    }
};

module.exports = schema;
