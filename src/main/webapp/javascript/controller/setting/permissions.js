/**
 * Created on 2017/5/26.
 */
app.controller('permissionsTableController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.tableloading = true;

    $scope.getPermissionListSuccess = function (response) {
        $scope.permissionTable = response.vXModuleDef;


        $scope.tableLength = $scope.permissionTable.length;
        $scope.tableloading = false;

        $scope.$digest();
    };

    $scope.getPermissionListError = function (response) {

    };

    $scope.editPermission = function (id) {
        $state.go('app.setting.permissionEdit', {id:id, status:"edit"});
    }


    ajaxGet("service/xusers/permission", $scope.getPermissionListSuccess, $scope.getPermissionListError);
}
]);


app.controller('permissionsEditController', ['$scope', '$http', '$state', '$translate', '$stateParams', function($scope, $http, $state, $translate, $stateParams) {

    $scope.getPGroupListSuccess = function (AllGroupResponse) {
        $scope.allGroupTable = AllGroupResponse.vXGroups;
        for(var i=0; i<$scope.allGroupTable.length;i++) {
            var isSelected = false;
            for (var j=0; j<$scope.permission.groupPermList.length;j++){
                if ($scope.allGroupTable[i].id == $scope.permission.groupPermList[j].groupId){
                    isSelected = true;
                    break;
                }
            }

            if (isSelected != true){
                var obj = {};
                obj.id = $scope.allGroupTable[i].id;
                obj.name =  $scope.allGroupTable[i].name;
                obj.selected = false;

                $scope.permGroupTable.push(obj);
            }
        }

        $scope.$apply();
    };

    $scope.getPGroupListError = function (AllGroupResponse) {
    };

    $scope.getPUserListSuccess = function (AllUserResponse) {
        $scope.allUserTable = AllUserResponse.vXUsers;
        for(var i=0; i<$scope.allUserTable.length;i++) {
            var isSelected = false;
            for (var j=0; j<$scope.permission.userPermList.length;j++){
                if ($scope.allUserTable[i].id == $scope.permission.userPermList[j].userId){
                   isSelected = true;
                   break;
                }
            }

            if (isSelected != true){
                var userobj = {};
                userobj.id = $scope.allUserTable[i].id;
                userobj.name =  $scope.allUserTable[i].name;
                userobj.selected = false;

                $scope.permUserTable.push(userobj);
            }
        }

        $scope.$apply();
    };

    $scope.getPUserListError = function (AllUserResponse) {
    };

    $scope.getPermissionSuccess = function (permissionResponse) {
        console.log(permissionResponse);
        $scope.permission = permissionResponse;
        var tmppermUserTable = [];
        var tmppermGroupTable = [];

        var i;

        for (i = 0; i < $scope.permission.userPermList.length;i++){
            var userobj = {};
            userobj.id = $scope.permission.userPermList[i].userId;
            userobj.name =  $scope.permission.userPermList[i].userName;
            userobj.selected = true;
            tmppermUserTable.push(userobj);
        }
        $scope.permUserTable = tmppermUserTable;

        for (i = 0; i < $scope.permission.groupPermList.length; i++){
            var groupobj = {};
            groupobj.id = $scope.permission.groupPermList[i].groupId;
            groupobj.name =  $scope.permission.groupPermList[i].groupName;
            groupobj.selected = true;
            tmppermGroupTable.push(groupobj);
        }
        $scope.permGroupTable = tmppermGroupTable;

        $scope.$apply();

        var urlString = "service/xusers/users?userRoleList%5B%5D=ROLE_KEY_ADMIN&userRoleList%5B%5D=ROLE_SYS_ADMIN&userRoleList%5B%5D=ROLE_USER";
        ajaxGet(urlString, $scope.getPUserListSuccess, $scope.getPUserListError);

        urlString = "service/xusers/groups";
        ajaxGet(urlString, $scope.getPGroupListSuccess, $scope.getPGroupListError);

        //$scope.$digest();
    };

    $scope.getPermissionError = function (permissionResponse) {
    };

    $scope.putForm = function(id) {
        var urlString = "service/xusers/permission/" + id;
        ajaxGet(urlString, $scope.getPermissionSuccess, $scope.getPermissionError);
    }

    $scope.updatePermSuccess = function () {
        console.log("update success!");
        $state.go('app.setting.permissions');
    };

    $scope.updatePermError = function () {
    };

    $scope.FindAddedUser=function () {
        $scope.addedUser = [];

        for (var i=0; i<$scope.selectedUserItems.length; i++){
            var found = false;
            for (var j=0; j<$scope.permission.userPermList.length;j++){
                if ($scope.selectedUserItems[i].id == $scope.permission.userPermList[j].userId){
                    found = true;
                    break;
                }
            }
            if (found != true){
                $scope.addedUser.push($scope.selectedUserItems[i].id);
            }

        }
    }

    $scope.FindDelUser=function () {
        $scope.delUser = [];

        for (var j=0; j<$scope.permission.userPermList.length;j++){
            var found = false;
            for (var i=0; i<$scope.selectedUserItems.length; i++){
                if ($scope.selectedUserItems[i].id == $scope.permission.userPermList[j].userId){
                    found = true;
                    break;
                }
            }

            if (found != true){
                $scope.delUser.push($scope.permission.userPermList[j].userId);
            }
        }

    }




    $scope.FindAddedGroup=function () {
        $scope.addedGroup = [];

        for (var i=0; i<$scope.selectedGroupItems.length; i++){
            var found = false;
            for (var j=0; j<$scope.permission.groupPermList.length;j++){
                if ($scope.selectedGroupItems[i].id == $scope.permission.groupPermList[j].groupId){
                    found = true;
                    break;
                }
            }
            if (found != true){
                $scope.addedGroup.push($scope.selectedGroupItems[i].id);
            }

        }
    }

    $scope.FindDelGroup=function () {
        $scope.delGroup = [];

        for (var j=0; j<$scope.permission.groupPermList.length;j++){
            var found = false;
            for (var i=0; i<$scope.selectedGroupItems.length; i++){
                if ($scope.selectedGroupItems[i].id == $scope.permission.groupPermList[j].groupId){
                    found = true;
                    break;
                }
            }

            if (found != true){
                $scope.delGroup.push($scope.permission.groupPermList[j].groupId);
            }
        }

    }


    $scope.submitForm=function () {
        $scope.FindAddedUser();
        $scope.FindDelUser();
        $scope.FindAddedGroup();
        $scope.FindDelGroup();

        var update = false;

        var i;
        var j;


        if($scope.delUser != undefined){
            for (i = 0; i < $scope.delUser.length; i++){
                for (j = 0; j < $scope.permission.userPermList.length; j++){
                    if ($scope.delUser[i] == $scope.permission.userPermList[j].userId){
                        $scope.permission.userPermList[j].isAllowed = 0;
                        update = true;
                        break;
                    }
                }
            }
        }

        if($scope.addedUser != undefined){
            for (i = 0; i < $scope.addedUser.length; i++){
                var userObj = {};
                userObj.userId = $scope.addedUser[i];
                userObj.moduleId = $scope.permission.id;
                userObj.isAllowed = 1;
                $scope.permission.userPermList.push(userObj);
                update = true;
            }
        }

        if($scope.delGroup != undefined){
            for (i = 0; i < $scope.delGroup.length; i++){
                for (j = 0; j < $scope.permission.groupPermList.length; j++){
                    if ($scope.delGroup[i] == $scope.permission.groupPermList[j].groupId){
                        $scope.permission.groupPermList[j].isAllowed = 0;
                        update = true;
                        break;
                    }
                }
            }
        }

        if($scope.addedGroup != undefined){
            for (i = 0; i < $scope.addedGroup.length; i++){
                var Obj = {};
                Obj.groupId = $scope.addedGroup[i];
                Obj.moduleId = $scope.permission.id;
                Obj.isAllowed = 1;
                $scope.permission.groupPermList.push(Obj);
                update = true;
            }
        }


        if (update != false) {
            var urlString = "service/xusers/permission/" + $scope.permission.id;
            ajaxPut(urlString, $scope.permission, $scope.updatePermSuccess, $scope.updatePermError);
        }else{
            $state.go('app.setting.permissions');
        }
    }

    $scope.setDefaultDisabled=function () {
        $scope.isPUserSelectShow = true;
        $scope.isPGroupSelectShow = true;
    }

    $scope.setDefaultDisabled();
    $scope.formData = {};
    $scope.putForm($stateParams.id);

}
]);
