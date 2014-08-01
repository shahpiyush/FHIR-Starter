﻿(function () {
    'use strict';

    var app = angular.module('FHIRStarter');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-database"></i> Dashboard'
                    }
                }
            },
            {
                url: '/organizations',
                config: {
                    title: 'organizations',
                    templateUrl: '/app/administration/organization/organizations.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-hospital-o"></i> Organization'
                    }
                }
            },
            {
                url: '/organization/:hashKey',
                config: {
                    title: 'organization',
                    templateUrl: '/app/administration/organization/organizationDetail.html',
                    settings: { }
                }
            },
            {
                url: '/practitioners',
                config: {
                    title: 'practitioners',
                    templateUrl: '/app/administration/practitioner/practitioners.html',
                    settings: {
                        nav: 5,
                        content: '<i class="fa fa-user-md"></i> Practitioner'
                    }
                }
            },
            {
                url: '/practitioner/:hashKey',
                config: {
                    title: 'practitioner',
                    templateUrl: '/app/administration/practitioner/practitionerDetail.html',
                    settings: { }
                }
            },
            {
                url: '/patients',
                config: {
                    title: 'patients',
                    templateUrl: '/app/administration/patient/patients.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-male"></i> Patient'
                    }
                }
            },
            {
                url: '/patient/:hashKey',
                config: {
                    title: 'patient',
                    templateUrl: '/app/administration/patient/patientDetail.html',
                    settings: { }
                }
            },
            {
                url: '/persons',
                config: {
                    title: 'person',
                    templateUrl: '/app/administration/person/persons.html',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-child"></i> Person'
                    }
                }
            },
            {
                url: '/person/:hashKey',
                config: {
                    title: 'person',
                    templateUrl: '/app/administration/person/personDetail.html',
                    settings: { }
                }
            },
            {
                url: '/questionnaires',
                config: {
                    title: 'questionnaire',
                    templateUrl: '/app/clinical/questionnaire/questionnaires.html',
                    settings: {
                        nav: 5,
                        content: '<i class="fa fa-clipboard"></i> Questionnaire'
                    }
                }
            },
            {
                url: '/questionnaire/:hashKey',
                config: {
                    title: 'questionnaire',
                    templateUrl: '/app/clinical/questionnaire/questionnaireDetail.html',
                    settings: { }
                }
            },
            {
                url: '/questionnaire/Practitioner/:id',
                config: {
                    title: 'questionnaire-practitioner',
                    templateUrl: '/app/administration/practitioner/practitionerDetail.html',
                    settings: { }
                }
            },
            {
                url: '/questionnaire/Patient/:id',
                config: {
                    title: 'questionnaire-patient',
                    templateUrl: '/app/administration/patient/patientDetail.html',
                    settings: { }
                }
            },
            {
                url: '/valuesets',
                config: {
                    title: 'valuesets',
                    templateUrl: '/app/infrastructure/valueset/valuesets.html',
                    settings: {
                        nav: 5,
                        content: '<i class="fa fa-codepen"></i> ValueSet'
                    }
                }
            },
            {
                url: '/valueset/:hashKey',
                config: {
                    title: 'valueset',
                    templateUrl: '/app/infrastructure/valueset/valuesetDetail.html',
                    settings: { }
                }
            },
        ];
    }
})();