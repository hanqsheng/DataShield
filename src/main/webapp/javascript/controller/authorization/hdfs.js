/**
 * Created by zhangtao on 2017/5/26.
 */
(function () {
    function getResources(scope) {
        var jsonObj = {};
        var resources = {};
        var urlValues = [];
        urlValues.push(scope.formData.path);
        var url = {
            isRecursive: true,
            values: urlValues
        }
        resources.path = url;
        jsonObj.resources = resources;
        return jsonObj;
    };
    app.controller('hdfsTableController', ['$scope', '$controller', '$http', '$state', '$translate', function ($scope, $controller, $http, $state, $translate) {
        $controller('authTableBaseController', {$scope: $scope});
        $scope.setActionUrl("app.auth.hdfsAdd", "app.auth.hdfsEdit");
        $scope.setServiceUrl("app.auth.hdfsServiceAdd", "app.auth.hdfsServiceEdit");
        $scope.getPluginListByName("hdfs");
    }
    ]);

    app.controller('hdfsAddController', ['$scope', '$controller', '$http', '$state', '$translate', function ($scope, $controller, $http, $state, $translate) {
        $controller('authAddBaseController', {$scope: $scope});
        $scope.submitPolicyForm = function () {
            var jsonObj = getResources($scope);
            $scope.addPolicy(jsonObj);
            return false;
        };
        $scope.setTableUrl("app.auth.hdfs");
        $scope.getPluginListByName("hdfs");
    }
    ]);

    app.controller('hdfsEditController', ['$scope', '$controller', '$http', '$state', function ($scope, $controller, $http, $state) {
        $controller('authEditBaseController', {$scope: $scope});
        $scope.parseResource = function (resource) {
            if (resource == null) {
                return;
            }
            $scope.formData.path = resource.path.values[0];
        };
        $scope.submitPolicyForm = function () {
            var jsonObj = getResources($scope);
            $scope.editPolicy(jsonObj);
            return false;
        };
        $scope.setTableUrl("app.auth.hdfs");
        $scope.getPluginListByName("hdfs");
    }
    ]);
})();
