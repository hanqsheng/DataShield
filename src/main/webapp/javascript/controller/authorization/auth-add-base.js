/**
 * Created by zhangtao on 2017/6/13.
 */
app.controller('authAddBaseController', ['$scope', '$controller', '$http', '$state', '$stateParams', function($scope, $controller, $http, $state, $stateParams) {
    $controller('authBaseController', {$scope: $scope});
    $scope.status = "add";
    $scope.formData.isEnabled = true;
    $scope.formData.isAuditEnabled = true;



    $scope.addPolicySuccess = function () {
        $state.go($scope.tableUrl);
    };

    $scope.addPolicyError = function () {

    };

    $scope.addPolicy = function (jsonObj) {
        jsonObj = $scope.getFormValue(jsonObj);
        jsonObj = $scope.getAccess(jsonObj);
        ajaxPost("service/plugins/policies", jsonObj, $scope.addPolicySuccess, $scope.addPolicyError);
    };


    $scope.putGroupAndUserToForm();
}
]);
