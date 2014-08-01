﻿(function () {
    'use strict';

    var serviceId = 'questionnaireService';

    angular.module('FHIRStarter').factory(serviceId, ['common', 'dataCache', 'fhirClient', questionnaireService]);

    function questionnaireService(common, dataCache, fhirClient) {
        var getLogFn = common.logger.getLogFn;
        var cacheKey = 'foundQuestionnaires';
        var isLoaded = false;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var $q = common.$q;


        var service = {
            addQuestionnaire: addQuestionnaire,
            deleteQuestionnaire: deleteQuestionnaire,
            getCachedQuestionnaire: getCachedQuestionnaire,
            getFilteredCount: getFilteredCount,
            getRemoteQuestionnaire: getRemoteQuestionnaire,
            getQuestionnairesCount: getQuestionnairesCount,
            getQuestionnaires: getQuestionnaires,
            updateQuestionnaire: updateQuestionnaire
        };

        return service;

        function addQuestionnaire(baseUrl) {
            var deferred = $q.defer();
            var id = common.generateUUID();

            fhirClient.addResource(baseUrl + '/Questionnaire/' + id)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function deleteQuestionnaire(resourceId) {
            var deferred = $q.defer();
            fhirClient.deleteResource(resourceId)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getFilteredCount(filter) {
            var deferred = $q.defer();
            var filterCount = 0;
            _getAllLocal().then(function (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (filter(data[i])) {
                        filterCount = (filterCount + 1);
                    }
                }
                deferred.resolve(filterCount);
            });
            return deferred.promise;
        }

        function getRemoteQuestionnaire(resourceId) {
            var deferred = $q.defer();
            fhirClient.getResource(resourceId)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function getCachedQuestionnaire(hashKey) {
            var deferred = $q.defer();
            _getAllLocal()
                .then(getQuestionnaire,
                function () {
                    deferred.reject('Questionnaire search results not found in cache.');
                });
            return deferred.promise;

            function getQuestionnaire(cachedEntries) {
                var cachedQuestionnaire;
                for (var i = 0, len = cachedEntries.length; i < len; i++) {
                    if (cachedEntries[i].$$hashKey === hashKey) {
                        cachedQuestionnaire = cachedEntries[i];
                        break;
                    }
                }
                if (cachedQuestionnaire) {
                    deferred.resolve(cachedQuestionnaire)
                } else {
                    deferred.reject('Questionnaire not found in cache: ' + hashKey);
                }
            }
        }

        function getQuestionnairesCount() {
            var deferred = $q.defer();
            if (_areQuestionnairesLoaded()) {
                _getAllLocal().then(function (data) {
                    deferred.resolve(data.length);
                });
            } else {
                return deferred.resolve(0);
            }
            return deferred.promise;
        }

        function getQuestionnaires(forceRemote, baseUrl, page, size, filter) {
            var deferred = $q.defer();
            var take = size || 20;
            var skip = page ? (page - 1) * take : 0;

            if (_areQuestionnairesLoaded() && !forceRemote) {
                _getAllLocal().then(getByPage);
            } else {
                fhirClient.getResource(baseUrl + '/Questionnaire')
                    .then(querySucceeded,
                    function (outcome) {
                        deferred.reject(outcome);
                    }).then(getByPage);
            }

            function getByPage(entries) {
                var pagedQuestionnaires;
                var filteredEntries = [];

                if (filter) {
                    for (var i = 0, len = entries.length; i < len; i++) {
                        if (filter(entries[i])) {
                            filteredEntries.push(entries[i]);
                        }
                    }
                } else {
                    filteredEntries = entries;
                }

                if (filteredEntries.length < size) {
                    pagedQuestionnaires = filteredEntries;
                } else {
                    var start = (skip < filteredEntries.length) ? skip : (filteredEntries - size);
                    var items = ((start + size) >= filteredEntries.length) ? (filteredEntries.length) : (start + size);
                    pagedQuestionnaires = filteredEntries.slice(start, items);
                }
                deferred.resolve(pagedQuestionnaires);
            }

            function querySucceeded(data) {
                _areQuestionnairesLoaded(true);
                log('Retrieved [Questionnaires] from remote FHIR server', data.entry.length)
                dataCache.addToCache(cacheKey, data.entry);
                return data.entry;
            }

            return deferred.promise;
        }

        function updateQuestionnaire(resourceId, resource) {
            var deferred = $q.defer();

            fhirClient.addResource(resourceId, resource)
                .then(function (data) {
                    deferred.resolve(data);
                },
                function (outcome) {
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function _getAllLocal() {
            var cachedQuestionnaires = dataCache.readFromCache(cacheKey);
            return $q.when(cachedQuestionnaires);
        }

        function _areQuestionnairesLoaded(value) {
            if (value === undefined) {
                return isLoaded;
            }
            return isLoaded = true;
        }
    }
})();