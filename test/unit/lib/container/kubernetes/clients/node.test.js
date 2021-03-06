'use strict';
const assert = require("assert");
const helper = require("../../../../../helper.js");
const service = helper.requireModule('./lib/container/kubernetes/clients/node.js');
let deployer = {};
describe("testing /lib/container/kubernetes/clients/node.js", function () {
	describe("calling service", function () {
		before((done) => {
			done();
		});
		
		it("Success get wih name", function (done) {
			deployer = {
				api: {
					v1: {
						nodes: () => {
							return {
								get: () => {
									return new Promise((resolve, reject) => {
										resolve({
											body: true
										});
										reject(true);
									});
								}
							};
						}
					}
				}
			};
			let opts = {
				name: "soajs",
			};
			service.get(deployer, opts, function (error, res) {
				assert.ok(res);
				done();
			});
		});
		
		it("Success get", function (done) {
			deployer = {
				api: {
					v1: {
						nodes: {
							get: () => {
								return new Promise((resolve, reject) => {
									resolve({
										body: true
									});
									reject(true);
								});
							}
						}
					}
				}
			};
			let opts = {};
			service.get(deployer, opts, function (error, res) {
				assert.ok(res);
				done();
			});
		});
		
		it("fail get", function (done) {
			deployer = {
				api: {
					v1: {
						nodes: {
							get: () => {
								return new Promise((resolve, reject) => {
									reject(true);
								});
							}
						}
					}
				}
			};
			let opts = {
			};
			service.get(deployer, opts, function (error, res) {
				assert.ok(error);
				done();
			});
		});
		
		it("Success put", function (done) {
			let opts = {
				name: "soajs",
				body: {}
			};
			deployer = {
				api: {
					v1: {
						nodes: () => {
							return {
								put: () => {
									return new Promise((resolve, reject) => {
										resolve({
											body: true
										});
										reject(true);
									});
								}
							};
						}
					}
				}
			};
			service.put(deployer, opts, function (error, res) {
				assert.ok(res);
				done();
			});
		});
		it("Fail put", function (done) {
			let opts = {
				name: "soajs",
				body: {}
			};
			deployer = {
				api: {
					v1: {
						nodes: () => {
							return {
								put: () => {
									return new Promise((resolve, reject) => {
										reject(true);
									});
								}
							};
						}
					}
				}
			};
			service.put(deployer, opts, function (error, res) {
				assert.ok(error);
				done();
			});
		});
		it("Success delete", function (done) {
			deployer = {
				api: {
					v1: {
						nodes: () => {
							return {
								delete: () => {
									return new Promise((resolve, reject) => {
										resolve({
											body: true
										});
										reject(true);
									});
								}
							};
						}
					}
				}
			};
			let opts = {
				name: "serviceName",
				qs: {}
			};
			service.delete(deployer, opts, function (error, res) {
				assert.ok(res);
				done();
			});
		});
		it("Fail delete", function (done) {
			deployer = {
				api: {
					v1: {
						nodes: () => {
							return {
								delete: () => {
									return new Promise((resolve, reject) => {
										resolve({
											body: true
										});
										reject(true);
									});
								}
							};
						}
					}
				}
			};
			let opts = {
				name: "serviceName",
			};
			service.delete(deployer, opts, function (error, res) {
				assert.ok(error);
				done();
			});
		});
	});
	
});