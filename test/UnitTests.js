'use strict';

var Cryptox = require("../index.js");
var https = require("https");
var sinon = require("sinon");
var chai = require("chai");
var nock = require("nock");

var config = require("./helpers/config.js");

var expect = chai.expect;
var cryptox, options;

var eachConstructor = function (slug) {
    describe("Unit " + slug + " -> Constructor", function () {

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
                secret: "my_secret",
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
            expect(cryptox).to.have.deep.property("properties.methods.notImplemented");
            expect(cryptox.properties.methods.notImplemented).to.be.a("array");
            expect(cryptox).to.have.deep.property("properties.methods.notSupported");
            expect(cryptox.properties.methods.notSupported).to.be.a("array");
        });
    });
}

var eachMethod = function (slug, method) {
    var notImplemented, notSupported, mock;

    var callback = function() {};

    before(function() {
        cryptox = new Cryptox(slug);
    });

    beforeEach(function() {
        mock = sinon.mock(cryptox);
    });

    afterEach(function() {
        mock.restore();
    });

    describe("Unit " + slug + " -> " + method, function () {
        it('should respond when called', function () {
            expect(cryptox).to.respondTo(method);
        });
        notImplemented = cryptox.properties.methods.notImplemented.indexOf(method);
        if (notImplemented > -1) {
            it('should respond "Method not implemented"', function () {
                cryptox[method]({}, function (err, result) {
                    expect(err.message).to.be.eql("Method not implemented");
                });
            });
        }
        notSupported = cryptox.properties.methods.notSupported.indexOf(method);
        if (notSupported > -1) {
            it('should respond "Method not supported"', function () {
                cryptox[method]({}, function (err, result) {
                    expect(err.message).to.be.eql("Method not supported");
                });
            });
        }
        if (notImplemented === -1 && notSupported === -1)
            it('should call ' + slug + '.' + method + ' with the correct parameters', function() {
                mock.expects(method).once().withArgs(options, callback);
                cryptox[method](options, callback);
                mock.verify();
            });
    });
}


config.slug.forEach(function (slug) {
    var implemented;
    eachConstructor(slug);
    cryptox = new Cryptox(slug);
    config.methods.forEach(function (method) {
        eachMethod(slug, method);
    });
});

