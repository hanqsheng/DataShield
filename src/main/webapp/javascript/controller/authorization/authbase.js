app.controller('authBaseController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.formData = {};
    $scope.tableUrl = null;
    $scope.addServiceUrl = null;
    $scope.editServiceUrl = null;

    $scope.setTableUrl = function (tableUrl) {
        $scope.tableUrl = tableUrl;
    };

    $scope.serviceCallback = function(service) {

    };

    $scope.getServicePluginsSuccess = function (response) {
        var services = response.services;

        if (services == null) {
            return;
        }

        var e = null;
        for(var i in services) {
            if (services[i].type === $scope.pluginName) {
                $scope.service = services[i];
                break;
            }
        }

        if ($scope.service == null) {
            $state.go($scope.addServiceUrl);
            return;
        }

        $scope.serviceCallback($scope.service);
    };

    $scope.getServicePluginsError = function (response, status) {

    };

    $scope.getPluginListByName = function (name) {
        $scope.pluginName = name;
        ajaxGet("service/plugins/services", $scope.getServicePluginsSuccess, $scope.getServicePluginsError);
    };


    $scope.getFormValue = function (jsonObj) {
        jsonObj.allowExceptions =  [];
        jsonObj.denyExceptions =   [];
        jsonObj.denyPolicyItems =   [];
        jsonObj.description =   $scope.formData.description;
        jsonObj.isAuditEnabled =  $scope.formData.isAuditEnabled;
        jsonObj.isEnabled =  $scope.formData.isEnabled;
        jsonObj.name =  $scope.formData.name;
        jsonObj.policyType =  "0";
        jsonObj.service =   $scope.service.name;


        var policyItems = [];


        var groups = [];
        angular.forEach($scope.selectedGroupItems, function(data, index, array) {
            groups.push(data.name);
        });

        var users = [];
        angular.forEach($scope.selectedUserItems, function (data, index, array) {
            users.push(data.name);
        });

        var p = {};

        if (groups.length > 0) {
            p.groups = groups;
        }

        if (users.length > 0) {
            p.users = users;
        }

        policyItems.push(p);
        jsonObj.policyItems = policyItems;

        return jsonObj;
    };

    $scope.getGroupListSuccess = function (vXGroupResponse) {
        for(var i=0; i<vXGroupResponse.vXGroups.length;i++){
            vXGroupResponse.vXGroups[i].selected = false;
        }
        $scope.groupList = vXGroupResponse.vXGroups;

        var urlString = "service/xusers/users?isVisible=1";
        ajaxGet(urlString, $scope.getUserListSuccess, $scope.getUserListError);
    };

    $scope.getGroupListError = function (vXGroupResponse) {
    };

    $scope.groupClick = function (data) {
        console.log(data);
        console.log($scope.selectedGroupItems);
    }

    $scope.afterGetUserListExec = function () {

    };

    $scope.getUserListSuccess = function (resp) {
        for(var i=0; i<resp.vXUsers.length;i++){
            resp.vXUsers[i].selected = false;
        }
        $scope.userList = resp.vXUsers;
        $scope.afterGetUserListExec();
        $scope.$digest();
    };

    $scope.getUserListError = function (resp) {
    };

    $scope.userClick = function (data) {
        console.log(data);
        console.log($scope.selectedUserItems);
    };

    $scope.putGroupAndUserToForm = function() {
        var urlString = "service/xusers/groups?isVisible=1";
        ajaxGet(urlString, $scope.getGroupListSuccess, $scope.getGroupListError);
    };

    $scope.buildAllowAccess = function (type) {
        var a = {
            type: type,
            isAllowed : true
        };
        return a;
    };

    $scope.getAccess = function (jsonObj) {
        var accesses = [];
        for (var p in $scope.formData.permissions) {
            if ($scope.formData.permissions[p] === true) {
                var a = $scope.buildAllowAccess(p);
                accesses.push(a);
            }
        }
        jsonObj.policyItems[0].accesses = accesses;

        return jsonObj;
    };
    $scope.goBack = function() {
        $state.go($scope.tableUrl);
    };

    $scope.setServiceUrl = function (addServiceUrl, editServiceUrl) {
        $scope.addServiceUrl = addServiceUrl;
        $scope.editServiceUrl = editServiceUrl;
    };
}
]);
