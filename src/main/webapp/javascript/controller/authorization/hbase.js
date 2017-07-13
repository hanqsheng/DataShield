/**
 * Created by sunxia on 2017/6/19.
 */
(function () {
    function getResources(scope) {
        var jsonObj = {};
        var resources = {};
            var table = {
                isExcludes : scope.formData.tableExclude,
                isRecursive : false,
                values : [scope.formData.tablevalue]
            };
          var column_family = {
            isExcludes : scope.formData.familyExclude,
            isRecursive : false,
            values : [scope.formData.column_family]
          };
          var column = {
            isExcludes : scope.formData.columnExclude,
            isRecursive : false,
            values : [scope.formData.columnvarlue]
          };
            resources.table = table;
            resources["column-family"] = column_family;
            resources.column = column;
           jsonObj.resources = resources;
        return jsonObj;
    };
    app.controller('hbaseTableController', ['$scope', '$controller', '$http', '$state', '$translate', function ($scope, $controller, $http, $state, $translate) {
        $controller('authTableBaseController', {$scope: $scope});
        $scope.setActionUrl("app.auth.hbaseadd", "app.auth.hbaseEdit");
        $scope.setServiceUrl("app.auth.hbaseServiceAdd", "app.auth.hbaseServiceEdit");
        $scope.getPluginListByName("hbase");
    }
    ]);

    app.controller('hbaseAddController', ['$scope', '$controller', '$http', '$state', '$translate', function ($scope, $controller, $http, $state, $translate) {
        $controller('authAddBaseController', {$scope: $scope});
        $scope.submitPolicyForm = function () {
              var jsonObj = getResources($scope);
            $scope.addPolicy(jsonObj);
            return false;
        };
        $scope.setTableUrl("app.auth.hbase");
        $scope.getPluginListByName("hbase");
    }
    ]);

    app.controller('hbaseEditController', ['$scope', '$controller', '$http', '$state', '$translate', function ($scope, $controller, $http, $state, $translate) {
        $controller('authEditBaseController', {$scope: $scope});
        $scope.parseResource = function (resource) {
            if (resource == null) {
                return;
            }
            $scope.formData.type = "0";
            if (resource["column-family"] != null) {
                    $scope.formData.familyExclude =resource["column-family"].isExcludes;
                    $scope.formData.column_family = resource["column-family"].values[0];
                }
            if (resource.column!= null) {
                $scope.formData.columnExclude = resource.column.isExcludes;
                $scope.formData.columnvarlue = resource.column.values[0];
            }
            if (resource.table != null) {
                $scope.formData.tableExclude = resource.table.isExcludes;
                $scope.formData.tablevalue = resource.table.values[0];
            }
        };
        $scope.submitPolicyForm = function () {
            var jsonObj = getResources($scope);
            $scope.editPolicy(jsonObj);
            return false;
        };
        $scope.setTableUrl("app.auth.hbase");
        $scope.getPluginListByName("hbase");
    }
    ]);
})();

