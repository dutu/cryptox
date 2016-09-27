
// if you need to test the modules with realy apiKeys, rename this file to private_keys.js and add the necessary keys

var apiKeys = {};

apiKeys.bitfinex = {
    key: "dummy",
    secret: "dummy",
    key_noPermission: "dummy",          // enter valid keys but which have with no permissions
    secret_noPermission: "dummy"
};
apiKeys.bitstamp = {
    key: "dummy",
    secret: "dummy",
    username: "dummy",
    key_noPermission: "dummy",
    secret_noPermission: "dummy",
    username_noPermission: "dummy"

};
apiKeys.bitx = {
    key: "dummy",
    secret: "dummy",
    key_noPermission: "dummy",
    secret_noPermission: "dummy"
};
apiKeys.btce = {
    key: "dummy",
    secret: "dummy",
    key_noPermission: "dummy",
    secret_noPermission: "dummy"
};
module.exports = apiKeys;
