"use strict";
const helper = require("../../../helper");
const assert = require("assert");
const sinon = require('sinon');

const service = helper.requireModule('./infra/azure/index.js');

let dD = require('../../../schemas/azure/cluster.js');
let info = {};
let options = {};
describe("testing /lib/azure/index.js", function () {
	process.env.SOAJS_CLOOSTRO_TEST = true;
	
	describe("calling getExtras", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		let expectedRes =  {technologies: ['vm'], templates: 'local', drivers: ['Native']};
		
		it("Success", function (done) {
			service.getExtras(options, function (error, response) {
				assert.ifError(error);
				assert.ok(response);
				assert.deepEqual(response, expectedRes);
				done();
			});
		});
	});
	
	describe("calling getRegions", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling deployCluster", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling getDeployClusterStatus", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling getDNSInfo", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling scaleCluster", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling getCluster", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling updateCluster", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling deleteCluster", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling publishPorts", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling deployExternalLb", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling updateExternalLB", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling deleteExternalLB", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
	
	describe("calling executeDriver", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			done();
		});
	});
});