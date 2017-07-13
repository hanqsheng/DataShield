/**
 * Created by zhangtao on 2017/5/26.
 */
app.controller('userTableController', ['$scope', '$http', '$state', '$translate', function($scope, $http, $state, $translate) {
    $scope.tableloading = true;
    $scope.chkAll = false;
    $scope.listCheck = new ListCheck();
    $scope.pageSize = 10;
    $scope.page = 0;
    $scope.pageFirst = true;

    document.searchGroupByName = function(e) {
        if (!e) {
            e = window.event;
        }
        if ((e.keyCode || e.which) == 13) {
            $scope.getUserListInfo(0,$scope.pageSize, 0, "&name=" + $scope.search_name, $scope.getUserListSuccess, $scope.getUserListError);
        }
    }

    $scope.add = function(id) {
        $state.go('app.setting.userAdd', {id:id, status:"add"});
    };

    $scope.toggleCheckAll = function() {
        $scope.listCheck.toggleCheckAll($scope.chkAll, $scope.userTable);
    }

    $scope.toggleCheck = function(id, name) {
        $scope.listCheck.toggleCheck(id, name);
    }

    $scope.userDelete = function () {
        var obj = {value:""};
        var array=[];
        if ($scope.listCheck.checkedCount() == 0) {
            bootbox.confirm($translate.instant('OTHER.SELECT'), function(result) {
                if (!result) {
                    return;
                }
            })
        } else if ($scope.listCheck.checkedCount() == 1) {
            bootbox.confirm($translate.instant('OTHER.CONFIRM') + "用户'" + $scope.listCheck.getCheckedName()[0] + "'?", function(result) {
                if (!result) {
                    return;
                }

                obj = {value:$scope.listCheck.getCheckedName()[0]};
                array.push(obj);

                var vXStrings = {"vXStrings":array};
                console.log(vXStrings);

                ajaxDelete("service/xusers/secure/users/delete?forceDelete=true",
                    vXStrings, $scope.deleteUsersSuccess, $scope.deleteUsersError);
            })
        } else {
            bootbox.confirm($translate.instant('OTHER.CONFIRM') + $scope.listCheck.checkedCount() + "个组?", function(result) {
                if (!result) {
                    return;
                }

                for (var i = 0; i < $scope.listCheck.checkedCount(); i++) {
                    obj = {value:$scope.listCheck.getCheckedName()[i]};
                    array.push(obj);
                }

                console.log($scope.listCheck.getChecked().join(","));
                var vXStrings = {"vXStrings":array};

                ajaxDelete("service/xusers/secure/users/delete?forceDelete=true",
                    vXStrings, $scope.deleteUsersSuccess, $scope.deleteUsersError);
            })
        }

    }

    $scope.deleteUsersSuccess = function(response){
        console.log("delete success!");
        $scope.chkAll = false;
        $scope.listCheck.clearChecked();
        $scope.$digest();
    }

    $scope.deleteUsersError = function(response){
        console.log("delete failed!");
    }

    $scope.getUserListSuccess = function (response) {
        $scope.userTable = response.vXUsers;
        $scope.tableLength = $scope.userTable.length;
        $scope.tableloading = false;

        if ($scope.pageFirst == true) {
            $scope.pageFirst= false;
            $('#page').pagination(response.totalCount, {
                num_edge_entries: 1,
                callback: $scope.pageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getUserListError = function (response) {

    };

    $scope.pageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        $scope.getUserListInfo($scope.page, $scope.pageSize, $scope.startIndex, "", $scope.getUserListSuccess,$scope.getUserListError);
        return false;
    };

    $scope.setVisiblity = function(IsVisible) {
        var obj={};
        var urlString = "service/xusers/secure/users/visibility";
        if ($scope.listCheck.checkedCount() == 0) {
            bootbox.confirm($translate.instant('SYSTEM-SETTING.GROUP.SELECT_VISIBLE'), function(result) {
                if (!result) {
                    return;
                }
            })
        } else if ($scope.listCheck.checkedCount() == 1) {
            obj[$scope.listCheck.getChecked()[0].toString()] = IsVisible;

            ajaxPut(urlString, obj, $scope.setUsersVisiblitySuccess, $scope.setUsersVisiblityError);
        } else {

            for (var i = 0; i < $scope.listCheck.checkedCount(); i++) {
                obj[$scope.listCheck.getChecked()[i].toString()]=IsVisible;
            }

            ajaxPut(urlString, obj, $scope.setUsersVisiblitySuccess, $scope.setUsersVisiblityError);
        }
    }

    $scope.setUsersVisiblitySuccess = function(response){
        $scope.chkAll = false;
        $scope.listCheck.clearChecked();
        ajaxGet("service/xusers/users?userRoleList%5B%5D=ROLE_SYS_ADMIN&userRoleList%5B%5D=ROLE_USER", $scope.getUserListSuccess, $scope.getUserListError);
    }

    $scope.setUsersVisiblityError = function(response){
        console.log("set visiblity failed!");
    }

    $scope.userDetail = function (id) {
        $state.go('app.setting.userAdd', {id:id, status:"edit"});
    }

    $scope.getUserListInfo = function (page, pageSize, startIndex, params, successCallback, errorCallback) {
        ajaxGet("service/xusers/users?page="+page+"&pageSize="+pageSize +"&sortBy=id&sortType=asc&startIndex="+startIndex + "&userRoleList%5B%5D=ROLE_SYS_ADMIN&userRoleList%5B%5D=ROLE_USER" + params, successCallback, errorCallback);
    }

    $scope.getUserListInfo(0,$scope.pageSize, 0, "", $scope.getUserListSuccess, $scope.getUserListError);
}
]);

app.controller('userAddController', ['$scope', '$http', '$state', '$translate', '$stateParams', function($scope, $http, $state, $translate, $stateParams) {

    $scope.getUserSuccess = function (vXUserResponse) {
        vXUserResponse.userRoleList[0]=="ROLE_SYS_ADMIN"?vXUserResponse.role="admin":vXUserResponse.role="user";
        console.log(vXUserResponse);
        $scope.user = vXUserResponse;
        $scope.firstnameDisabled = $scope.user.userSource == 1;
        $scope.lastnameDisabled = $scope.user.userSource == 1;
        $scope.emailDisabled = $scope.user.userSource == 1;
        $scope.roleDisabled = $scope.user.name == "admin";
        $scope.isGroupSelectShow = $scope.user.userSource == 0;
        if($scope.isGroupSelectShow){
            urlString = "service/xusers/groups";
            ajaxGet(urlString, $scope.getGroupListSuccess, $scope.getGroupListError);
        }
        $scope.$digest();
    };

    $scope.getUserError = function (vXUserResponse) {
    };

    $scope.getGroupListSuccess = function (vXGroupResponse) {
        for(var i=0; i<vXGroupResponse.vXGroups.length;i++){
            var isSelected = false;
            if($scope.user.groupIdList != undefined){
                for(var j=0; j<$scope.user.groupIdList.length;j++){
                    if($scope.user.groupIdList[j] == vXGroupResponse.vXGroups[i].id){
                        isSelected = true;
                        break;
                    }
                }
            }
            vXGroupResponse.vXGroups[i].selected = isSelected;
        }
        $scope.groupList = vXGroupResponse.vXGroups;
        $scope.$apply();
    };

    $scope.getGroupListError = function (vXGroupResponse) {
    };

    $scope.putForm = function(id) {
        var urlString;
        if($stateParams.status == "edit"){
            urlString = "service/xusers/secure/users/" + id;
            ajaxGet(urlString, $scope.getUserSuccess, $scope.getUserError);
        }else{
            urlString = "service/xusers/groups";
            ajaxGet(urlString, $scope.getGroupListSuccess, $scope.getGroupListError);
        }
    }

    $scope.updateUserSuccess = function () {
        $state.go('app.setting.users');
    };

    $scope.updateUserError = function (response) {
        bootbox.alert({message:JSON.parse(response.responseText).msgDesc, backdrop: true,size: 'small'});
    };

    $scope.submitForm=function () {
        if($stateParams.status == "edit"){
            var urlString = "service/xusers/secure/users/" + $scope.user.id;
            $scope.user.role == "admin" ? $scope.user.userRoleList[0] = "ROLE_SYS_ADMIN" : $scope.user.userRoleList[0] = "ROLE_USER";
            var groupIdList = new Array();
            for(var i=0; i<$scope.selectedItems.length;i++){
                groupIdList.push($scope.selectedItems[i].id.toString());
            }
            $scope.user.groupIdList = groupIdList;
            delete $scope.user.role;
            delete $scope.user.password;
            ajaxPut(urlString, $scope.user, $scope.updateUserSuccess, $scope.updateUserError);
        }else {
            var urlString = "service/xusers/secure/users/";
            var groupIdList = new Array();
            for(var i=0; i<$scope.selectedItems.length;i++){
                groupIdList.push($scope.selectedItems[i].id.toString());
            }
            $scope.user.groupIdList = groupIdList;
            $scope.user.new_password == $scope.user.password_confirm ? $scope.user.password = $scope.user.new_password : $scope.user.password = "";
            var roleList = new Array();
            $scope.user.role == "admin" ? roleList.push("ROLE_SYS_ADMIN") : roleList.push("ROLE_USER");
            $scope.user.userRoleList = roleList;
            $scope.user.status = 1;
            delete $scope.user.role;
            delete $scope.user.new_password;
            delete $scope.user.password_confirm;
            ajaxPost(urlString, $scope.user, $scope.updateUserSuccess, $scope.updateUserError);
        }
    }

    $scope.setDefaultDisabled=function () {
        $scope.nameDisabled = $scope.status == "edit";
        $scope.firstnameDisabled = false;
        $scope.lastnameDisabled = false;
        $scope.emailDisabled = false;
        $scope.roleDisabled = false;
        $scope.isGroupSelectShow = true;
    }

    $scope.status = $stateParams.status;
    $scope.setDefaultDisabled();
    $scope.formData = {};
    $scope.putForm($stateParams.id);
    }
]);
