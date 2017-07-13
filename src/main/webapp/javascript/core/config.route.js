'use strict';
   /* angular.module('app')*/
app.config(['$urlRouterProvider',function($urlRouterProvider){
    $urlRouterProvider
        .when('/', ['$state', function ($state) {
            $state.go('app.home');
        }]).when('', ['$state', function ($state) {
            $state.go('app.home');
        }]);
    $urlRouterProvider.otherwise("/404");
}]);

        app.config(['$routeProvider', '$stateProvider', '$urlRouterProvider','$controllerProvider',
            '$compileProvider', '$filterProvider', '$provide',
            '$locationProvider', '$httpProvider',function($routeProvider,$stateProvider,$urlRouterProvider,$controllerProvider,
                                                          $compileProvider, $filterProvider, $provide,
                                                          $locationProvider, $httpProvider) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;

                if (!$httpProvider.defaults.headers.get) {
                    $httpProvider.defaults.headers.get = {};
                }

                // Disable IE ajax request caching
                $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
                $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

            $stateProvider
                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "template/home/home.html"
                })
                .state('app.home',{
                    url:'/home',
                    templateUrl: "template/dashboard/dashboard.html",
                    controller: 'dashboardCtrl'
                })
                .state('signin',{
                    url:'/signin',
                    templateUrl: "template/signin/signin.html",
                    controller: 'signinController'
                })


                .state('app.auth',{
                    url:'/auth',
                    template: '<div ui-view class="fade-in-down"></div>'
                })


                .state('app.auth.hdfs',{
                    url:'/hdfs',
                    templateUrl: "template/authorization/hdfs_table.html",
                    controller: 'hdfsTableController'/*,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function( $ocLazyLoad){
                                return $ocLazyLoad.load(
                                    ['javascript/controller/authorization/hdfs.js']);
                            }]
                    }*/
                })
                .state('app.auth.hdfsAdd',{
                    url:'/hdfs/add',
                    templateUrl: "template/authorization/hdfs_edit.html",
                    controller: 'hdfsAddController'

                })
                .state('app.auth.hdfsEdit',{
                    url:'/hdfs/edit/:id',
                    templateUrl: "template/authorization/hdfs_edit.html",
                    controller: 'hdfsEditController'

                })

                .state('app.auth.hdfsServiceAdd',{
                    url:'/hdfs/service/add',
                    templateUrl: "template/authorization/hdfs_service_edit.html",
                    controller: 'hdfsServiceAddController'
                })

                .state('app.auth.hdfsServiceEdit',{
                    url:'/hdfs/service/edit/:id',
                    templateUrl: "template/authorization/hdfs_service_edit.html",
                    controller: 'hdfsServiceEditController'
                })

                .state('app.auth.hive',{
                    url:'/hive',
                    templateUrl: "template/authorization/hive_table.html",
                    controller: 'hiveTableController'
                })

                .state('app.auth.hiveAdd',{
                    url:'/hive/add',
                    templateUrl: "template/authorization/hive_edit.html",
                    controller: 'hiveAddController'
                })

                .state('app.auth.hiveEdit',{
                    url:'/hive/edit/:id',
                    templateUrl: "template/authorization/hive_edit.html",
                    controller: 'hiveEditController'
                })

                .state('app.auth.hiveServiceAdd',{
                    url:'/hive/service/add',
                    templateUrl: "template/authorization/hive_service_edit.html",
                    controller: 'hiveServiceAddController'
                })

                .state('app.auth.hiveServiceEdit',{
                    url:'/hive/service/edit/:id',
                    templateUrl: "template/authorization/hive_service_edit.html",
                    controller: 'hiveServiceEditController'
                })
                .state('app.auth.hbase',{
                    url:'/hbase',
                    templateUrl: "template/authorization/hbase_table.html",
                    controller: 'hbaseTableController'
                })
                .state('app.auth.hbaseadd',{
                    url:'/hbase/add',
                    templateUrl: "template/authorization/hbase_edit.html",
                    controller: 'hbaseAddController'
                })

                .state('app.auth.hbaseEdit',{
                    url:'/hbase/edit/:id',
                    templateUrl: "template/authorization/hbase_edit.html",
                    controller: 'hbaseEditController'
                })
                .state('app.auth.hbaseServiceAdd',{
                    url:'/hbase/service/add',
                    templateUrl: "template/authorization/hbase_service_edit.html",
                    controller: 'hbaseServiceAddController'
                })

                .state('app.auth.hbaseServiceEdit',{
                    url:'/hbase/service/edit/:id',
                    templateUrl: "template/authorization/hbase_service_edit.html",
                    controller: 'hbaseServiceEditController'
                })
                .state('app.setting',{
                    url:'/setting',
                    template: '<div ui-view class="fade-in-down"></div>'
                })
                .state('app.setting.users',{
                    url:'/user',
                    templateUrl: "template/setting/user_table.html",
                    controller: 'userTableController'
                })
                .state('app.setting.groups',{
                    url:'/group',
                    templateUrl: "template/setting/group_table.html",
                    controller: 'groupTableController'
                })

                .state('app.setting.groupAdd',{
                    url:'/group/add',
                    params:{"id" : 0, "status" : "add"},
                    templateUrl: "template/setting/group_edit.html",
                    controller: 'groupAddController'
                })

                .state('app.setting.userAdd',{
                    url:'/user/add',
                    params:{"id" : 0, "status" : "add"},
                    templateUrl: "template/setting/user_edit.html",
                    controller: 'userAddController'
                })
                .state('app.setting.permissions',{
                    url:'/permission',
                    templateUrl: "template/setting/permissions_table.html",
                    controller: 'permissionsTableController'
                })

                .state('app.setting.permissionEdit',{
                    url:'/permission/edit',
                    params:{"id" : 0, "status" : "edit"},
                    templateUrl: "template/setting/permissions_edit.html",
                    controller: 'permissionsEditController'
                })

                /* add audit page */
                .state('app.audit',{
                    url:'/audit',
                    template: '<div ui-view class="fade-in-down"></div>'
                })

                .state('app.audit.access',{
                    url:'/access',
                    templateUrl: "template/audit/access.html",
                    controller: 'accessTableController'
                })

                .state('app.audit.admin',{
                    url:'/admin',
                    templateUrl: "template/audit/admin.html",
                    controller: 'adminController'
                })

                .state('app.audit.login_sessions',{
                    url:'/login_sessions',
                    templateUrl: "template/audit/login_sessions.html",
                    controller: 'loginSessionsController'
                })

                .state('app.audit.plugins',{
                    url:'/plugins',
                    templateUrl: "template/audit/plugin.html",
                    controller: 'pluginsController'
                })

                .state('app.audit.plugin_status',{
                    url:'/plugin_status',
                    templateUrl: "template/audit/plugin_status.html",
                    controller: 'pluginStatusController'
                })

                .state('app.certification',{
                    url:'/certification',
                    template: '<div ui-view class="fade-in-down"></div>'
                })

                .state('app.certification.kerberos',{
                    url:'/kerberos',
                    templateUrl: "template/certification/kerberos.html",
                    controller: 'kerberosController'
                })
                .state('app.certification.user_info',{
                    url:'/user_info',
                    templateUrl: "template/certification/user_info.html",
                    controller: 'userInfoController'
                })
            }]
    );

  app.run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    );

