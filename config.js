'use strict';

/**
 * @license
 * Copyright SOAJS All Rights Reserved.
 *
 * Use of this source code is governed by an Apache license that can be
 * found in the LICENSE file at the root of this repository
 */

module.exports = {
	
	//NOTE: this is not a variable, a kubernetes service will always be set in the default namespace
    kubernetes: {
        apiHost: 'https://kubernetes.default'
    },
	
	//docker hub url path to retrieve image information
	docker: {
		"url": "https://hub.docker.com/v2/repositories/%organization%/%imagename%/tags/"
	},
	
	dynamicCatalogVariables: ['$SOAJS_NX_CONTROLLER_IP_N'],
	
	//allowed exposed ports range
	exposedPorts: {
		"min": 0,
		"max": 2767
	}
};
