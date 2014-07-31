﻿(function () {
    'use strict';

    var controllerId = 'patients';

    angular.module('FHIRStarter').controller(controllerId,
        ['$location', 'common', 'config', 'fhirServers', 'patientService', patients]);

    function patients($location, common, config, fhirServers, patientService) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var keyCodes = config.keyCodes;
        var log = getLogFn(controllerId);

        vm.activeServer = null;
        vm.busyMessage = "Contacting remote server ...";
        vm.filteredPatients = [];
        vm.filteredPatientsCount = 0;
        vm.isBusy = false;
        vm.goToPatient = goToPatient;
        vm.patients = [];
        vm.patientsCount = 0;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            links: null,
            maxPagesToShow: 10,
            pageSize: 30,
            totalResults: 0
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.searchResults = null;
        vm.searchText = '';
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };
        vm.title = 'Patients';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.paging.totalResults / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getActiveServer(), getCachedPatients()], controllerId)
                .then(function () {
                    // nothing to do
                }, function (error) {
                    log('Error ' + error);
                });
        }

        function applyFilter() {
            vm.filteredPatients = vm.patients.filter(patientFilter);
        }

        function getActiveServer() {
            fhirServers.getActiveServer()
                .then(function (server) {
                    return vm.activeServer = server;
                });
        }

        function getCachedPatients() {
            patientService.getCachedSearchResults()
                .then(function (data) {
                    log('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Patients from cache');
                    return data;
                }, function (error) {
                    // proceed
                })
                .then(processSearchResults);
        }

        function getPatientsFilteredCount() {
            // TODO: filter results based on doB or address, etc.
        }

        function fetchLinkedPage(url) {
            if (url.length > 0) {
                toggleSpinner(true);
                patientService.getLink(url)
                    .then(function (data) {
                        log('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Patients from ' + vm.activeServer.name, true);
                        return data;
                    }, function (error) {
                        log('Error ' + error);
                        toggleSpinner(false);
                    })
                    .then(processSearchResults)
                    .then(function () {
                        toggleSpinner(false);
                    });
            }
        }

        function goToPatient(patient) {
            if (patient && patient.$$hashKey) {
                $location.path('/patient/' + patient.$$hashKey);
            }
        }

        function patientFilter(patient) {
            var isMatch = vm.searchText
                ? common.textContains(patient.name, vm.searchText)
                : true;
            return isMatch;
        }

        function pageChanged() {
            getPatients();
        }

        function processSearchResults(searchResults) {
            if (searchResults) {
                vm.patients = (searchResults.entry || []);
                vm.paging.links = (searchResults.link || []);
                vm.paging.totalResults = (searchResults.totalResults || 0);
            }
        }

        function refresh() {

        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.searchText = '';
            } else if ($event.keyCode === keyCodes.enter || $event.type === 'click') {
                vm.paging.currentPage = 1;
                getPatients();
            }
        }

        function getPatients() {
            if (vm.searchText.length > 0) {
                toggleSpinner(true);
                patientService.getPatients(vm.activeServer.baseUrl, vm.searchText, vm.paging.currentPage, vm.paging.pageSize)
                    .then(function (data) {
                        log('Returned ' + (angular.isArray(data.entry) ? data.entry.length : 0) + ' Patients from ' + vm.activeServer.name, true);
                        return data;
                    }, function (error) {
                        log('Error ' + error);
                        toggleSpinner(false);
                    })
                    .then(processSearchResults)
                    .then(function () {
                        toggleSpinner(false);
                    });
            }
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }
    }
})();
