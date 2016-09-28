
// if you need to test the modules with realy apiKeys, rename this file to private_keys.js and add the necessary keys

let apiKeys = {};

apiKeys.bitfinex = {
    key: "a6IUDlWrpreQHquHT9hd0QyfQ9dR6jvaDLUprEdlcDY",
    secret: "WTpRmWhafRDOQAWlzyI4OODjBepbiLrtIrNxDzpoF3C",
    key_noPermission: "HnGWBRIzFtsTI4SdNxD6SMkHmhuCV79dK44nqJ7oTAx",          // enter valid keys but which have with no permissions
    secret_noPermission: "9vnzkksS4OlYyqhhygCVZe6rz4rsWPMzQrjoz5KDLDW"
};
apiKeys.bitstamp = {
    key: "3P71H2CzDDFUFkVK5IhIpg9moEAzsMRz",
    secret: "LX1RBS7m7eYAxQCJbpQiZSPnpRkQiZmj",
    username: "267347",
    key_noPermission: "YPfMIHaSwKjDpms30auAJmCNzmehiJDq",
    secret_noPermission: "0HfqHylYz9m4CFYKtAUfKh0QgBRR1TDo",
    username_noPermission: "267347"

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
