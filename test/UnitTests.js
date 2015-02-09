'use strict';

var Cryptox = require("../index.js");
var https = require("https");
var sinon = require("sinon");
var chai = require("chai");
//  FakeRequest = require('./helpers/FakeRequest');

var config = require("./config.js");

var expect = chai.expect;
var cryptox, options;

var eachConstructor = function (slug) {
    describe(slug + ' -> Constructor', function () {

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
        });



    });
}

var eachMethod = function (slug, method) {

    describe(slug + ' -> ' + method, function () {

        it('should respond to method', function () {
            cryptox = new Cryptox(slug);
            expect(cryptox).to.respondTo(method);
        });
    });
}

config.slug.forEach(function (slug) {
    eachConstructor (slug);
    config.methods.forEach(function (method) {
        eachMethod(slug, method);
    });
});


