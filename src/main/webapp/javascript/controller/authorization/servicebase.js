app.controller('serviceBaseController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.type = null;
    $scope.policyTableUrl = null;
    $scope.formData = {};
    $scope.service = null;

    $scope.addServiceSuccess = function (resp) {
        $state.go($scope.policyTableUrl);
    };

    $scope.addServiceError = function (resp) {

    };


    $scope.addService = function (configs) {
        var jsonObj = {
            configs : configs
        };

        jsonObj.name = $scope.Service_name;
        jsonObj.isEnabled = $scope.formData.isEnabled;
        jsonObj.type = $scope.type;
        jsonObj.description = $scope.formData.description;

        jsonObj.configs.username = $scope.formData.username;
        jsonObj.configs.password = $scope.formData.password;

        ajaxPost("service/plugins/services", jsonObj, $scope.addServiceSuccess, $scope.addServiceError);
    };

    $scope.editServiceSuccess = function (resp) {
        $state.go($scope.policyTableUrl);
    };

    $scope.editServiceError = function (resp) {

    };

    $scope.editService = function (configs) {
        var jsonObj = {
            configs : configs
        };

        jsonObj.name = $scope.service.name;
        jsonObj.isEnabled = $scope.formData.isEnabled;
        jsonObj.type = $scope.type;
        jsonObj.description = $scope.formData.description;

        jsonObj.configs.username = $scope.formData.username;
        jsonObj.configs.password = $scope.formData.password;

        jsonObj.id = $scope.service.id;

        ajaxPut("service/plugins/services/" + $scope.service.id, jsonObj, $scope.editServiceSuccess, $scope.editServiceError);
    };

    $scope.setPolicyTableUrl = function (policyTableUrl) {
        $scope.policyTableUrl = policyTableUrl;
    };

    $scope.setType = function (type) {
        $scope.type  = type;
    };

    $scope.serviceExtendToForm = function() {

    };

    $scope.getServiceByIdSuccess = function (resp) {
        $scope.service = resp;
        $scope.formData.isEnabled = $scope.service.isEnabled;
        $scope.formData.username = $scope.service.configs.username;
        $scope.formData.password = $scope.service.configs.password;
        $scope.serviceExtendToForm();
        $scope.$digest();
    };

    $scope.getServiceByIdError = function (resp) {

    };


    $scope.getServiceById = function (id) {
        ajaxGet("service/plugins/services/" + id, $scope.getServiceByIdSuccess, $scope.getServiceByIdError);
    };

    $scope.goBack = function() {
        $state.go($scope.policyTableUrl);
    };

    $scope.formData.isEnabled = true;

    $scope.setService_name = function (name) {
        $scope.Service_name  = name;
    };
}
]);
