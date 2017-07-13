app.controller('hiveServiceAddController', ['$scope', '$controller', '$http', '$state', function($scope, $controller, $http, $state) {
    $controller('serviceBaseController', {$scope: $scope});
    $scope.showGoBack = false;


    $scope.submitServiceForm = function () {
        var configs = {
            "username" : $scope.formData.username,
            "password" : $scope.formData.password,
            "jdbc.url" : $scope.formData.jdbcUrl,
            "jdbc.driverClassName" : $scope.formData.driverClassName,
            "commonNameForCertificate" : $scope.formData.cn
        };

        $scope.addService(configs);
        return false;
    };

    $scope.setType("hive");
    $scope.setPolicyTableUrl("app.auth.hive");
    $scope.setService_name("clusterone_hive");

}
]);


app.controller('hiveServiceEditController', ['$scope', '$controller', '$http', '$state', '$stateParams', function($scope, $controller, $http, $state, $stateParams) {
    $controller('serviceBaseController', {$scope: $scope});
    $scope.showGoBack = true;

    $scope.submitServiceForm = function () {
        var configs = {
            "jdbc.url" : $scope.formData.jdbcUrl,
            "jdbc.driverClassName" : $scope.formData.driverClassName,
            "commonNameForCertificate" : $scope.formData.cn
        };
        $scope.editService(configs);

        return false;
    };

    $scope.serviceExtendToForm = function() {
        $scope.formData.jdbcUrl = $scope.service.configs["jdbc.url"];
        $scope.formData.driverClassName = $scope.service.configs["jdbc.driverClassName"];
        $scope.formData.cn = $scope.service.configs.commonNameForCertificate;
    };

    $scope.setType("hive");
    $scope.setPolicyTableUrl("app.auth.hive");

    $scope.getServiceById($stateParams.id);
}
]);
