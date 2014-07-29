﻿(function () {
    'use strict';

    var serviceId = 'organizationService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', organizationService]);

    function organizationService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;

        var service = {
            addOrganization: addOrganization,
            updateOrganization: updateOrganization,
            getOrganization: getOrganization,
            deleteOrganization: deleteOrganization,
            getOrganizations: getOrganizations
        };

        return service;


        function addOrganization(resource) {

        }

        function deleteOrganization(resourceId) {

        }

        function getOrganization(resourceId) {

        }

        function getOrganizations(baseUrl, nameFilter, page, size) {
            var deferred = $q.defer();
            var params = '';
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (angular.isUndefined(nameFilter)) {
                deferred.reject('Invalid search input');
            }
            params = nameFilter + '&search-offset=' + skip + '&_count=' + take;

            fhirClient.getResource(baseUrl + '/Organization/_search?name=' + params)
                .then(function (data) {
                    dataCache.addToCache('organizations', data.entry);
                    deferred.resolve(data);
                }, function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function updateOrganization(resourceId, resource) {

        }
    }
})();