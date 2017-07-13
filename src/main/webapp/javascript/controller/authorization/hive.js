/**
 * Created by zhangtao on 2017/6/9.
 */
(function (){
    function getResources(scope) {
        var jsonObj = {};
        var resources = {};
        if (scope.formData.type === "1") {
            var urlValues = [];
            urlValues.push(scope.formData.path);
            var url = {
                isExcludes: false,
                isRecursive: "",
                values: urlValues
            }

            resources.url = url;
        } else {
            /* 暂时所有列 */
            var column = {
                isExcludes : false,
                isRecursive : false,
                values : ["*"]
            };

            var database = {
                isExcludes : scope.formData.pathExclude,
                isRecursive : false,
                values : [scope.formData.path]
            };

            var table = {
                isExcludes : scope.formData.tableExclude,
                isRecursive : false,
                values : [scope.formData.table]
            };

            resources.column = column;
            resources.database = database;
            resources.table = table;
        }

        jsonObj.resources = resources;

        return jsonObj;
    };

    app.controller('hiveTableController', ['$scope', '$controller', '$http', '$state', function($scope, $controller, $http, $state) {
        $controller('authTableBaseController', {$scope: $scope});

        $scope.setActionUrl("app.auth.hiveAdd", "app.auth.hiveEdit");
        $scope.setServiceUrl("app.auth.hiveServiceAdd", "app.auth.hiveServiceEdit");
        $scope.getPluginListByName("hive");
    }
    ]);

    app.controller('hiveAddController', ['$scope', '$controller', '$http', '$state', function($scope, $controller, $http, $state) {
        $controller('authAddBaseController', {$scope: $scope});
        $scope.formData.type = "0";
        $scope.formData.pathExclude = false;
        $scope.formData.tableExclude = false;

        $scope.submitPolicyForm = function() {
            var jsonObj = getResources($scope);

            $scope.addPolicy(jsonObj);
            return false;
        };

        $scope.setTableUrl("app.auth.hive");
        $scope.getPluginListByName("hive");
    }
    ]);


    app.controller('hiveEditController', ['$scope', '$controller', '$http', '$state', function($scope, $controller, $http, $state) {
        $controller('authEditBaseController', {$scope: $scope});

        $scope.parseResource = function (resource) {
            if (resource == null) {
                return;
            }

            if (resource.url != null) {
                $scope.formData.type = "1";
                //$scope.formData.isExcludes = resource.url.isExcludes;
                $scope.formData.path = resource.url.values[0];
            } else {
                $scope.formData.type = "0";
                if (resource.database != null) {
                    $scope.formData.pathExclude = resource.database.isExcludes;
                    $scope.formData.path = resource.database.values[0];
                }

                if (resource.table != null) {
                    $scope.formData.tableExclude = resource.table.isExcludes;
                    $scope.formData.table = resource.table.values[0];
                }
            }
        };

        $scope.submitPolicyForm = function() {
            var jsonObj = getResources($scope);

            $scope.editPolicy(jsonObj);
            return false;
        };

        $scope.setTableUrl("app.auth.hive");
        $scope.getPluginListByName("hive");
    }
    ]);
})();

