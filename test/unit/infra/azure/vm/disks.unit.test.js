"use strict";
const helper = require("../../../../helper");
const assert = require("assert");
const sinon = require('sinon');

const service = helper.requireModule('./infra/azure/index.js');
const serviceUtils = helper.requireModule("./infra/azure/utils/index.js");

let dD = require('../../../../schemas/azure/cluster.js');
let info = {};
let options = {};

describe("testing /lib/azure/index.js", function () {
	process.env.SOAJS_CLOOSTRO_TEST = true;
	
	describe("calling executeDriver - listDisks", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success no type", function (done) {
			sinon
				.stub(serviceUtils, 'authenticate')
				.yields(null, {
					credentials: {},
				});
			sinon
				.stub(serviceUtils, 'getConnector')
				.returns({
					disks: {
						list: (resourceGroupName, cb) => {
							return cb(null, info.Disks)
						}
					},
				});
			info = dD();
			options = info.deployCluster;
			options.params = {
				resourceGroupName: "dynamic-template",
			};
			let expected = [
				{
					"name": "mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/SOAJS/providers/Microsoft.Compute/disks/mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
					"location": "centralus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "mysql_OsDisk_1_42ef3a000aff4269988d134e376e0160",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/SOAJS/providers/Microsoft.Compute/disks/mysql_OsDisk_1_42ef3a000aff4269988d134e376e0160",
					"location": "centralus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "testcase-vm_OsDisk_1_cc20c9245fdd4bf9961aa239d435b9b7",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/TESTCASE/providers/Microsoft.Compute/disks/testcase-vm_OsDisk_1_cc20c9245fdd4bf9961aa239d435b9b7",
					"location": "centralus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "charles-test3-osDisk-0",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/CHARLES/providers/Microsoft.Compute/disks/charles-test3-osDisk-0",
					"location": "eastus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "test-data-disk-for-ragheb",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/TESTCASE/providers/Microsoft.Compute/disks/test-data-disk-for-ragheb",
					"location": "eastus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "tester-vm_OsDisk_1_a26c7c89f50e4ccd8cb600324eae5100",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/TESTER/providers/Microsoft.Compute/disks/tester-vm_OsDisk_1_a26c7c89f50e4ccd8cb600324eae5100",
					"location": "eastus",
					"type": "Microsoft.Compute/disks"
				}
			];
			service.executeDriver('listDisks', options, function (error, response) {
				assert.ifError(error);
				assert.ok(response);
				assert.deepEqual(expected, response);
				done();
			});
		});
		
		it("Success wit type os", function (done) {
			sinon
				.stub(serviceUtils, 'authenticate')
				.yields(null, {
					credentials: {},
				});
			sinon
				.stub(serviceUtils, 'getConnector')
				.returns({
					disks: {
						list: (resourceGroupName, cb) => {
							return cb(null, info.Disks)
						}
					},
				});
			
			info = dD();
			options = info.deployCluster;
			options.params = {
				resourceGroupName: "testcase",
				type: "os",
			};
			let expected = [
				{
					"name": "mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/SOAJS/providers/Microsoft.Compute/disks/mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
					"location": "centralus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "mysql_OsDisk_1_42ef3a000aff4269988d134e376e0160",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/SOAJS/providers/Microsoft.Compute/disks/mysql_OsDisk_1_42ef3a000aff4269988d134e376e0160",
					"location": "centralus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "testcase-vm_OsDisk_1_cc20c9245fdd4bf9961aa239d435b9b7",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/TESTCASE/providers/Microsoft.Compute/disks/testcase-vm_OsDisk_1_cc20c9245fdd4bf9961aa239d435b9b7",
					"location": "centralus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "charles-test3-osDisk-0",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/CHARLES/providers/Microsoft.Compute/disks/charles-test3-osDisk-0",
					"location": "eastus",
					"type": "Microsoft.Compute/disks"
				},
				{
					"name": "tester-vm_OsDisk_1_a26c7c89f50e4ccd8cb600324eae5100",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/TESTER/providers/Microsoft.Compute/disks/tester-vm_OsDisk_1_a26c7c89f50e4ccd8cb600324eae5100",
					"location": "eastus",
					"type": "Microsoft.Compute/disks"
				}
			];
			service.executeDriver('listDisks', options, function (error, response) {
				assert.ifError(error);
				assert.ok(response);
				assert.deepEqual(expected, response);
				done();
			});
		});
		
		it("Success wit type data", function (done) {
			sinon
				.stub(serviceUtils, 'authenticate')
				.yields(null, {
					credentials: {},
				});
			sinon
				.stub(serviceUtils, 'getConnector')
				.returns({
					disks: {
						list: (resourceGroupName, cb) => {
							return cb(null, [{
								"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/SOAJS/providers/Microsoft.Compute/disks/mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
								"name": "mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
								"type": "Microsoft.Compute/disks",
								"location": "centralus",
								"managedBy": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/soajs/providers/Microsoft.Compute/virtualMachines/mongo",
								"sku": {
									"name": "Standard_LRS",
									"tier": "Standard"
								},
								"timeCreated": "2018-06-08T08:43:58.918Z",
								"creationData": {
									"createOption": "FromImage",
									"imageReference": {
										"id": "/Subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/Providers/Microsoft.Compute/Locations/centralus/Publishers/Canonical/ArtifactTypes/VMImage/Offers/UbuntuServer/Skus/17.10/Versions/17.10.201805220"
									}
								},
								"diskSizeGB": 30,
								"provisioningState": "Succeeded"
							}])
						}
					},
				});
			
			info = dD();
			options = info.deployCluster;
			options.params = {
				resourceGroupName: "dynamic-template",
				type: "data"
			};
			let expected = [
				{
					"name": "mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
					"id": "/subscriptions/d159e994-8b44-42f7-b100-78c4508c34a6/resourceGroups/SOAJS/providers/Microsoft.Compute/disks/mongo_OsDisk_1_5aa8030cb6044037b5c8f4d6c75a391a",
					"location": "centralus",
					"type": "Microsoft.Compute/disks"
				}
			];
			service.executeDriver('listDisks', options, function (error, response) {
				assert.ifError(error);
				assert.ok(response);
				assert.deepEqual(expected, response);
				done();
			});
		});
	});
	
	describe("calling executeDriver - updateDisks", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			service.executeDriver('updateDisks', options, function (error, response) {
				assert.ifError(error);
				assert.ok(response);
				done();
			});
		});
	});
	
	describe("calling executeDriver - createDisks", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			service.executeDriver('createDisks', options, function (error, response) {
				assert.ifError(error);
				assert.ok(response);
				done();
			});
		});
	});
	
	describe("calling executeDriver - deleteDisks", function () {
		afterEach((done) => {
			sinon.restore();
			done();
		});
		it("Success", function (done) {
			service.executeDriver('deleteDisks', options, function (error, response) {
				assert.ifError(error);
				assert.ok(response);
				done();
			});
		});
	});
	
});
