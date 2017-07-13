/**
 * Created by zhangtao on 2017/6/12.
 */
app.controller('authEditBaseController', ['$scope', '$controller', '$http', '$state', '$stateParams', function($scope, $controller, $http, $state, $stateParams) {
    $controller('authBaseController', {$scope: $scope});
    $scope.status = "edit";

    $scope.parseResource = function (resource) {

    };

    $scope.updateItemSelect = function (item, list) {
        for (var i in  item) {
            for (var j in  list) {
                if (list[j].name === item[i]) {
                    list[j].selected = true;
                    break;
                }
            }
        }
    };

    $scope.parsePolicy = function (resp) {
        if ((resp.policyItems != null) && (resp.policyItems[0] != null)) {
            if (resp.policyItems[0].accesses != null) {
                $scope.formData.permissions = [];
                for (var a in resp.policyItems[0].accesses) {
                    $scope.formData.permissions[resp.policyItems[0].accesses[a].type] = resp.policyItems[0].accesses[a].isAllowed;
                }

                if (resp.policyItems[0].users != null) {
                    $scope.updateItemSelect(resp.policyItems[0].users, $scope.userList);

                }

                if (resp.policyItems[0].groups != null) {
                    $scope.updateItemSelect(resp.policyItems[0].groups, $scope.groupList);
                }
            }
        }
    };

    $scope.getPolicySuccess = function (resp) {
        $scope.formData.name = resp.name;
        $scope.formData.description = resp.description;
        $scope.formData.isEnabled = resp.isEnabled;
        $scope.formData.isAuditEnabled = resp.isAuditEnabled;

        $scope.parsePolicy(resp);

        $scope.parseResource (resp.resources);

        $scope.$digest();
    };

    $scope.getPolicyError = function (resp) {

    };

    $scope.getPolicyById = function (id) {
        ajaxGet("service/plugins/policies/" + id, $scope.getPolicySuccess, $scope.getPolicyError);
    };

    $scope.afterGetUserListExec = function () {
        $scope.getPolicyById($stateParams.id);
    };

    $scope.editPolicySuccess = function () {
        $state.go($scope.tableUrl);
    };

    $scope.editPolicyError = function () {

    };

    $scope.editPolicy = function (jsonObj) {
        jsonObj = $scope.getFormValue(jsonObj);
        jsonObj = $scope.getAccess(jsonObj);
        jsonObj.id = $stateParams.id;
        ajaxPut("service/plugins/policies/" + $stateParams.id, jsonObj, $scope.editPolicySuccess, $scope.editPolicyError);
    };


    $scope.putGroupAndUserToForm();

}
]);
