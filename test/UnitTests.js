'use strict';

const Cryptox = require("../lib/index.js");
const https = require("https");
const sinon = require("sinon");
const chai = require("chai");
const nock = require("nock");

const config = require("./helpers/config.js");

const expect = chai.expect;

const allMethods = [
    'getRate',
    'getTicker',
    'getOrderBook',
    'getTrades',
    'getFee',
    'getTransactions',
    'getBalance',
    'getMarginPositions',
    'getOpenOrders',
    'postSellOrder',
    'postBuyOrder',
    'cancelOrder'
];

let cryptox, options;

let eachConstructor = function (slug) {
    describe("Constructor", function () {

        it('should create a new instance', function () {
            cryptox = new Cryptox(slug);
            expect(cryptox).to.be.an.instanceOf(Cryptox);
        });

        it('should create a new instance without the new keyword', function () {
            cryptox = Cryptox(slug);
            expect(cryptox).to.be.an.instanceOf(Cryptox);
        });

        it('should have default options', function () {
            cryptox = new Cryptox(slug);
            expect(cryptox.options.lang).to.equal("en");
        });

        it('should accept options', function () {
            options = {
                lang: "de",
                key: "my_key",
                secret: "my_secret"
            };
            cryptox = new Cryptox(slug, options);
            expect(cryptox.options.lang).to.equal("de");
            expect(cryptox.options.key).to.equal("my_key");
            expect(cryptox.options.secret).to.equal("my_secret");
        });

        it('should have correct properties', function () {
            cryptox = new Cryptox(slug);
            expect(cryptox).to.have.deep.property("properties.name");
            expect(cryptox.properties.name).to.be.a("string");
            expect(cryptox).to.have.deep.property("properties.slug", slug);
            expect(cryptox).to.have.deep.property("properties.instruments");
            expect(cryptox.properties.instruments).to.be.a("array");
            expect(cryptox).to.have.deep.property("properties.methods.implemented");
            expect(cryptox.properties.methods.implemented).to.be.a("array");
            expect(cryptox).to.have.deep.property("properties.methods.notSupported");
            expect(cryptox.properties.methods.notSupported).to.be.a("array");
        });
    });
};

let eachMethod = function (slug, method) {
    let mock;

    let callback = function() {};

    before(function() {
        cryptox = new Cryptox(slug);
    });

    beforeEach(function() {
        mock = sinon.mock(cryptox);
    });

    afterEach(function() {
        mock.restore();
    });

    describe(method, function () {
        it('should respond when called', function () {
            expect(cryptox).to.respondTo(method);
        });
        let isNotImplemented = cryptox.properties.methods.implemented.indexOf(method) === -1 && cryptox.properties.methods.notSupported.indexOf(method) === -1 ;
        if (isNotImplemented) {
            it('should respond "Method not implemented"', function () {
                cryptox[method]({}, function (err, result) {
                    expect(err.message).to.be.eql("Method not implemented");
                });
            });
        }
        let isNotSupported = cryptox.properties.methods.notSupported.indexOf(method) > -1;
        if (isNotSupported) {
            it('should respond "Method not supported"', function () {
                cryptox[method]({}, function (err, result) {
                    expect(err.message).to.be.eql("Method not supported");
                });
            });
        }
        let isImplemented = cryptox.properties.methods.implemented.indexOf(method) > -1;
        if (isImplemented)
            it('should call ' + slug + '.' + method + ' with the correct parameters', function() {
                mock.expects(method).once().withArgs(options, callback);
                cryptox[method](options, callback);
                mock.verify();
            });
    });
};


config.slug.forEach(function (slug) {
    describe("Unit Test " + slug + ":", function () {
        let implemented;
        eachConstructor(slug);
        cryptox = new Cryptox(slug);
        allMethods.forEach(function (method) {
            eachMethod(slug, method);
        });
    });
});

