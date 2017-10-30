/* jshint esversion: 6 */

'use strict';

const utils = require('./utils.js');

const Grid = require('gridfs-stream');
const async = require('async');
const Docker = require('dockerode');

const gridfsColl = 'fs.files';

const lib = {
    getDeployer (options, cb) {
        let protocol = 'https://',
            domain = `${options.soajs.registry.apiPrefix}.${options.soajs.registry.domain}`, //TODO: check if options.soajs.registry exits
            port = '2376'; //static for now

        if(options && options.params && options.params.targetHost) {
            domain = options.params.targetHost;
        }

        let host = `${protocol}${domain}`;

        if(!options.model || Object.keys(options.model).length === 0) {
            options.model = require('../models/mongo.js');
        }

        if(!options.env && (options.params && options.params.env)) {
            options.env = options.params.env;
        }

        findCerts(options, (error, certs) => {
            utils.checkError(error, 600, cb, () => {
                let deployer = new Docker(buildDockerConfig(host, port, certs));
                return cb(null, deployer);
            });
        });


        function findCerts(options, cb) {
            if (!options.env) {
                return cb(600);
            }

            let opts = {
                collection: gridfsColl,
                conditions: {
                    ['metadata.env.' + options.env.toUpperCase()]: options.driver
                }
            };

            options.model.findEntries(options.soajs, opts, (error, certs) => {
                utils.checkError(error, 600, cb, () => {
                    if (!certs || certs.length === 0) {
                        return cb(600);
                    }

                    options.model.getDb(options.soajs).getMongoDB((error, db) => {
                        utils.checkError(error, 600, cb, () => {
                            let gfs = Grid(db, options.model.getDb(options.soajs).mongodb);
                            return pullCerts(certs, gfs, db, cb);
                        });
                    });
                });
            });
        }

        function pullCerts(certs, gfs, db, cb) {
            var certBuffers = {};
            async.each(certs, (oneCert, callback) => {
                var gs = new gfs.mongo.GridStore(db, oneCert._id, 'r', { //TODO: update to support model injection
                    root: 'fs',
                    w: 1,
                    fsync: true
                });

                gs.open((error, gstore) => {
                    utils.checkError(error, 600, callback, () => {
                        gstore.read((error, filedata) => {
                            utils.checkError(error, 600, callback, () => {
                                gstore.close();

                                var certName = oneCert.filename.split('.')[0];
                                certBuffers[oneCert.metadata.certType] = filedata;
                                return callback(null, true);
                            });
                        });
                    });
                });
            }, (error, result) => {
                utils.checkError(error, 600, cb, () => {
                    return cb(null, certBuffers);
                });
            });
        }

        function buildDockerConfig(host, port, certs) {
            let dockerConfig = { host, port };

            let certKeys = Object.keys(certs);
            certKeys.forEach((oneCertKey) => {
                dockerConfig[oneCertKey] = certs[oneCertKey];
            });

            return dockerConfig;
        }
    },

    ping (options, cb) {
        options.deployer.ping(cb);
    },

    buildNodeRecord (options) {
        let record = {
            id: '',
            hostname: '',
            ip: '',
            version: '',
            state: '',
            spec: {
                role: '',
                availability: ''
            },
            resources: {
                cpus: '',
                memory: ''
            }
        };

        if (options && options.node) {
            if (options.node.ID) {
                record.id = options.node.ID;
            }

            if (options.node.Description) {
                if (options.node.Description.Hostname) {
                    record.hostname = options.node.Description.Hostname;
                }
                if (options.node.Description.Resources) {
                    if (options.node.Description.Resources && options.node.Description.Resources.NanoCPUs) {
                        record.resources.cpus = options.node.Description.Resources.NanoCPUs / 1000000000;
                    }
                    if (options.node.Description.Resources.MemoryBytes) {
                        record.resources.memory = options.node.Description.Resources.MemoryBytes;
                    }
                }
            }

            if (options.node.Status) {
                if (options.node.Status.Addr) {
                    record.ip = options.node.Status.Addr;
                }
                if (options.node.Status.State) {
                    record.state = options.node.Status.State;
                }
            }

            if (options.node.Version && options.node.Version.Index) {
                record.version = options.node.Version.Index;
            }

            if (options.node.Spec) {
                if (options.node.Spec.Role) {
                    record.spec.role = options.node.Spec.Role;
                }
                if (options.node.Spec.Availability) {
                    record.spec.availability = options.node.Spec.Availability;
                }
            }

            if (record.spec.role === 'manager') {
                record.managerStatus = {
                    leader: '',
                    reachability: '',
                    address: ''
                };

                if (options.node.ManagerStatus) {
                    if (options.node.ManagerStatus.Leader) {
                        record.managerStatus.leader = options.node.ManagerStatus.Leader;
                    }
                    if (options.node.ManagerStatus.Reachability) {
                        record.managerStatus.reachability = options.node.ManagerStatus.Reachability;
                    }
                    if (options.node.ManagerStatus.Addr) {
                        record.managerStatus.address = options.node.ManagerStatus.Addr;
                    }
                }
            }
        }


        return record;
    },

    buildServiceRecord (options) {
        let record = {
            id: '',
            version: '',
            name: '',
            labels: {},
            env: [],
            ports: [],
            tasks: []
        };

        if (options && options.service) {
            if (options.service.ID) {
                record.id = options.service.ID;
            }
            if (options.service.Version && options.service.Version.Index) {
                record.version = options.service.Version.Index;
            }

            if (options.service.Spec) {
                if (options.service.Spec.Name) {
                    record.name = options.service.Spec.Name;
                }
                if (options.service.Spec.Labels) {
                    record.labels = options.service.Spec.Labels;
                }
                if (options.service.Spec.TaskTemplate && options.service.Spec.TaskTemplate.ContainerSpec && options.service.Spec.TaskTemplate.ContainerSpec.Env) {
                    record.env = options.service.Spec.TaskTemplate.ContainerSpec.Env;
                }
            }

            if (options.service.Endpoint && options.service.Endpoint.Ports && options.service.Endpoint.Ports.length > 0) {
                options.service.Endpoint.Ports.forEach((onePortConfig) => {
                    let port = {
                        protocol: onePortConfig.Protocol,
                        target: onePortConfig.TargetPort,
                        published: onePortConfig.PublishedPort
                    };

                    if(onePortConfig.PublishMode && onePortConfig.PublishMode === 'host') {
                        port.preserveClientIP = true;
                    }

                    record.ports.push(port);
                });
            }
        }

        return record;
    },

    buildTaskRecord (options) {
        let record = {
            id: '',
            version: '',
            name: '',
            ref: {
                slot: '',
                service: {
                    name: '',
                    id: ''
                },
                node: {
                    id: ''
                },
                container: {
                    id: ''
                }
            },
            status: {
                ts: '',
                state: '',
                desiredState: '',
                message: ''
            }
        };

        if (options) {
            if (options.serviceName) {
                record.ref.service.name = options.serviceName;
            }
            if (options.task) {
                if (options.task.ID) {
                    record.id = options.task.ID;
                }
                if (options.task.Version && options.task.Version.Index) {
                    record.version = options.task.Version.Index;
                }

                if (options.serviceName) {
                    record.name = options.serviceName + ((options.task.Slot) ? '.' + options.task.Slot : ''); //might add extra value later
                }
                if (options.task.Slot) {
                    record.ref.slot = options.task.Slot;
                }
                if (options.task.ServiceID) {
                    record.ref.service.id = options.task.ServiceID;
                }
                if (options.task.NodeID) {
                    record.ref.node.id = options.task.NodeID;
                }

                if (options.task.Status) {
                    if (options.task.Status.ContainerStatus && options.task.Status.ContainerStatus.ContainerID) {
                        record.ref.container.id = options.task.Status.ContainerStatus.ContainerID;
                    }

                    if (options.task.Status.Timestamp) {
                        record.status.ts = options.task.Status.Timestamp; //timestamp of the last status update
                    }
                    if (options.task.Status.State) {
                        record.status.state = options.task.Status.State; //current state of the task, example: running
                    }
                    if (options.task.Status.Message) {
                        record.status.message = options.task.Status.Message; //current message of the task, example: started or error,
                    }
                }

                if (options.task.DesiredState) {
                    record.status.desiredState = options.task.DesiredState; //desired state of the task, example: running
                }
            }
        }

        return record;
    }
};

module.exports = lib;
