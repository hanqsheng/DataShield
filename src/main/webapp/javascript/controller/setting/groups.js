/**
 * Created by hasen on 2017/6/5.
 */

function goGroupList(state) {
    state.go('app.setting.groups');
}

function GroupSourceTransform(val) {
    var source = "";
    switch (val) {
        case 0:
            source = "Internal";
            break;
        case 1:
            source = "External";
            break;
        default:
            source = "Internal";
            break;
    }

    return source;
}

function GroupVisbilityTransform(val) {
    var visibility = "";
    switch (val) {
        case 0:
            visibility = "Hidden";
            break;
        case 1:
            visibility = "Visible";
            break;
        default:
            visibility = "Visible";
            break;
    }

    return visibility;
}

function groupNameTransform(val) {
    if (val) {
        val = 1;
    } else {
        val = 0;
    }

    return val;
}

app.controller('groupTableController', ['$scope', '$http', '$state', '$translate', function($scope, $http, $state, $translate) {

    $scope.formData = {};
    $scope.tableloading = true;
    $scope.pageSize = 25;
    $scope.page = 0;
    $scope.groupResponse={};
    $scope.chkAll = false;
    $scope.listCheck = new ListCheck();
    $scope.pageFirst = true;
    $scope.searchPageFirst = true;

    /* 翻页回调函数 */
    $scope.pageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        $scope.getGroupListInfo($scope.page, $scope.pageSize, $scope.startIndex,
            $scope.getGroupListSuccess,$scope.getGroupListError);
        return false;
    };

    $scope.add = function(id) {
        $state.go('app.setting.groupAdd',{id:id, status:"add"});
    }


    /* 获取用户组列表信息成功后的回调函数 */
    $scope.getGroupListSuccess = function (vXGroupsponse) {
        var vXGroups = vXGroupsponse.vXGroups;
        $scope.groupResponse = vXGroupsponse;

        for (var i = 0; i < vXGroups.length; i++) {
            if (vXGroups[i]["groupSource"] != null) {
                vXGroups[i].groupsource = vXGroups[i]["groupSource"];
                vXGroups[i]["groupSource"] = GroupSourceTransform(vXGroups[i]["groupSource"]);
            }

            if (vXGroups[i]["isVisible"] != null) {
                vXGroups[i].visibility = vXGroups[i]["isVisible"];
                vXGroups[i]["isVisible"] = GroupVisbilityTransform(vXGroups[i]["isVisible"]);
            }
        }
        $scope.groupTable = vXGroups;
        $scope.tableLength = $scope.groupTable.length;
        $scope.tableloading = false;

        if ($scope.pageFirst == true) {
            $scope.pageFirst= false;
            $('#page').pagination(vXGroupsponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.pageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getGroupListError = function (vXGroupsponse) {
        bootbox.error("Get Group Information Error!!!");
    };

    /* 成功删除选中的用户组信息后的回调函数 */
    $scope.deleteGroupsSuccess = function(response){
        console.log("delete success!");
        $scope.chkAll = false;
        $scope.listCheck.clearChecked();
        $scope.getGroupListInfo(0,$scope.pageSize, 0,$scope.getGroupListSuccess, $scope.getGroupListError);
    }

    $scope.deleteGroupsError = function(response){
        console.log("delete failed!");
    }

    /* 删除按钮响应函数 */
    $scope.groupsDelete = function () {
        var obj = {value:""};
        var array=[];
        if ($scope.listCheck.checkedCount() == 0) {
            bootbox.confirm($translate.instant('OTHER.SELECT'), function(result) {
                if (!result) {
                    return;
                }
            })
        } else if ($scope.listCheck.checkedCount() == 1) {
            bootbox.confirm($translate.instant('OTHER.CONFIRM') + "组'" + $scope.listCheck.getCheckedName()[0] + "'?", function(result) {
                if (!result) {
                    return;
                }

                obj = {value:$scope.listCheck.getCheckedName()[0]};
                array.push(obj);

                var vXStrings = {"vXStrings":array};

                ajaxDelete("service/xusers/secure/groups/delete?forceDelete=true",
                    vXStrings, $scope.deleteGroupsSuccess, $scope.deleteGroupsError);
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

                ajaxDelete("service/xusers/secure/groups/delete?forceDelete=true",
                    vXStrings, $scope.deleteGroupsSuccess, $scope.deleteGroupsError);
            })
        }

    }


    /* 复选框全选响应函数 */
    $scope.toggleCheckAll = function() {
        $scope.listCheck.toggleCheckAll($scope.chkAll, $scope.groupTable);
    }

    /* 复选框响应函数 */
    $scope.toggleCheck = function(id, name) {
        $scope.listCheck.toggleCheck(id, name);
    }

    $scope.setGroupsVisibilitySuccess = function(response){
        $scope.chkAll = false;
        $scope.listCheck.clearChecked();
        $scope.getGroupListInfo(0,$scope.pageSize, 0,$scope.getGroupListSuccess, $scope.getGroupListError);
    }

    $scope.setGroupsVisibilityError = function(response){
        console.log("set visibility failed!");
    }


    /* 设置可见性响应函数 */
    $scope.setVisibility = function(IsVisible) {
        var obj={};
        var urlString = "service/xusers/secure/groups/visibility";
        if ($scope.listCheck.checkedCount() == 0) {
            bootbox.confirm($translate.instant('SYSTEM-SETTING.GROUP.SELECT_VISIBLE'), function(result) {
                if (!result) {
                    return;
                }
            })
        } else if ($scope.listCheck.checkedCount() == 1) {
            obj[$scope.listCheck.getChecked()[0].toString()] = IsVisible;

            ajaxPut(urlString, obj, $scope.setGroupsVisibilitySuccess, $scope.setGroupsVisibilityError);
        } else {

            for (var i = 0; i < $scope.listCheck.checkedCount(); i++) {
                obj[$scope.listCheck.getChecked()[i].toString()]=IsVisible;
            }

            ajaxPut(urlString, obj, $scope.setGroupsVisibilitySuccess, $scope.setGroupsVisibilityError);
        }
    }

    /* 搜索翻页回调函数 */
    $scope.searchPageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        var total_page = Math.ceil($scope.searchAdminListResponse.totalCount/$scope.pageSize);
        var urlString = "service/xusers/groups?page=" + $scope.page +
            "&pageSize=" + $scope.pageSize +
            "&total_pages=" + total_page +
            "&startIndex=" + $scope.startIndex +
            "&name=" + $scope.formData.name;
        ajaxGet(urlString, $scope.getGroupNameSuccess, $scope.getGroupNameError);
        return false;
    };

    $scope.getGroupNameSuccess = function (vXGroupsponse) {
        var vXGroups = vXGroupsponse.vXGroups;

        for (var i = 0; i < vXGroups.length; i++) {
            if (vXGroups[i]["groupSource"] != null) {
                vXGroups[i].groupsource = vXGroups[i]["groupSource"];
                vXGroups[i]["groupSource"] = GroupSourceTransform(vXGroups[i]["groupSource"]);
            }

            if (vXGroups[i]["isVisible"] != null) {
                vXGroups[i].visibility = vXGroups[i]["isVisible"];
                vXGroups[i]["isVisible"] = GroupVisbilityTransform(vXGroups[i]["isVisible"]);
            }
        }
        $scope.groupTable = vXGroups;
        $scope.tableLength = $scope.groupTable.length;
        $scope.tableloading = false;

        if ($scope.searchPageFirst == true) {
            $scope.searchPageFirst= false;
            $('#page').pagination(vXGroupsponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.searchPageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getGroupNameError = function (vXGroupsponse) {
        bootbox.alert("No group name: " + $scope.formData.name + " to be found!");
    };

    /* 响应搜索框输入完成后，按下enter按键后的响应函数 */
    document.searchGroupByName = function(e) {
        var total_page=0;
        $scope.searchPageFirst = true;
        $scope.pageFirst = true;
        if (!e) {
            e = window.event;
        }
        if ((e.keyCode || e.which) == 13) {
            var urlString;
            if (groupNameTransform($scope.formData.name)=== 0) {
                ajaxGet("service/xusers/groups?page=0&pageSize=" + $scope.pageSize +
                    "&startIndex=0", $scope.getGroupListSuccess, $scope.getGroupListError);
            }

            total_page = Math.ceil($scope.groupResponse.totalCount/$scope.groupResponse.pageSize);
            urlString = "service/xusers/groups?page=0" +
                "&pageSize=" + $scope.groupResponse.pageSize +
                "&total_pages=" + total_page +
                "&totalCount=" + $scope.groupResponse.totalCount +
                "&sortBy=name" + "&sortType=" + $scope.groupResponse.sortType +
                "&startIndex=" + $scope.groupResponse.startIndex +
                "&name=" + $scope.formData.name;
            ajaxGet(urlString, $scope.getGroupNameSuccess, $scope.getGroupNameError);
        }
    }

    /* 点击用户组名字的时候响应函数 */
    $scope.groupDetail = function (id) {
        $state.go('app.setting.groupAdd', {id:id, status:"edit"});
    }

    /* 获取用户组列表信息公共接口函数定义 */
    $scope.getGroupListInfo = function (page, pageSize, startIndex, successCallback, errorCallback) {
        ajaxGet("service/xusers/groups?page="+page+"&pageSize="+pageSize +"&startIndex="+startIndex, successCallback, errorCallback);
    }

    /* 获取用户组列表信息 */
    $scope.getGroupListInfo(0,$scope.pageSize, 0,$scope.getGroupListSuccess, $scope.getGroupListError);
}
]);


app.controller('groupAddController', ['$scope', '$http', '$state', '$translate', '$stateParams', function($scope, $http, $state, $translate, $stateParams){

    $scope.formData = {};
    $scope.goBack = function() {
        goGroupList($state);
    }

    $scope.success = function(response){
        goGroupList($state);
    }

    $scope.error = function() {
    }

    $scope.goBack = function() {
        goGroupList($state);
    }

    $scope.getGroupListSuccess = function (vXGroupsponse) {
        var vXGroups = vXGroupsponse.vXGroups;
        $scope.groupResponse = vXGroupsponse;

        for (var i = 0; i < vXGroups.length; i++) {
            if (vXGroups[i]["groupSource"] != null) {
                vXGroups[i].groupsource = vXGroups[i]["groupSource"];
                vXGroups[i]["groupSource"] = GroupSourceTransform(vXGroups[i]["groupSource"]);
            }

            if (vXGroups[i]["isVisible"] != null) {
                vXGroups[i].visibility = vXGroups[i]["isVisible"];
                vXGroups[i]["isVisible"] = GroupVisbilityTransform(vXGroups[i]["isVisible"]);
            }
        }
        $scope.groupTable = vXGroups;
        $scope.tableLength = $scope.groupTable.length;
        $scope.tableloading = false;
z
        $scope.$digest();
    };

    $scope.getGroupListError = function (vXGroupsponse) {
        bootbox.alert("Get Group List Information Error!!!");
    };

    $scope.getGroupListInfo = function (page, pageSize, startIndex, successCallback, errorCallback) {
        ajaxGet("service/xusers/groups?page="+page+"&pageSize="+pageSize +"&startIndex="+startIndex, successCallback, errorCallback);
    }


    $scope.updateGroupSuccess = function () {
        /*$scope.getGroupListInfo(0, $scope.pageSize, 0, $scope.getGroupListSuccess, $scope.getGroupListError);*/
        goGroupList($state);
    };

    $scope.updateGroupError = function (response) {
        bootbox.setLocale("zh_CN");
        if ( response && response.responseJSON && response.responseJSON.msgDesc){
            var errorMsg = JSON.parse(response.responseText);
            var existsTipMsg = $translate.instant('SYSTEM-SETTING.GROUP.GROUP_NAME') +" '"
                + $scope.formData.name + "' " + $translate.instant('SYSTEM-SETTING.GROUP.ALREADY_EXISTS');
            var otherTipMsg = $stateParams.status + " group name '" +$scope.formData.name + "' failed, because of " + errorMsg.msgDesc + "!";
            if (errorMsg.msgDesc == "XGroup already exists") {
                bootbox.alert({message:existsTipMsg, backdrop: true,size: 'small'});
            } else {
                bootbox.alert({message:otherTipMsg, backdrop: true,size: 'small'});
            }
        }else {
            bootbox.alert({message:"Error occurred while creating/updating group!",backdrop: true,size: 'small'});
        }
    };

    $scope.submitForm=function () {
        var urlString = "service/xusers/secure/groups/";
        if ($stateParams.status == "edit") {
            var putUrl = urlString + $stateParams.id;
            ajaxPut(putUrl, $scope.formData, $scope.updateGroupSuccess, $scope.updateGroupError);
        } else if ($stateParams.status == "add") {
            if ($scope.formData.description == undefined || $scope.formData.description == null) {
                $scope.formData.description
            }
            ajaxPost(urlString, {"name":$scope.formData.name,"description":$scope.formData.description},
                $scope.updateGroupSuccess, $scope.updateGroupError);
        }
    }

    $scope.getGroupNameSuccess = function (vXGroupsponse) {
        $scope.formData = vXGroupsponse;
        if ($scope.formData.groupSource == 1) {
           document.getElementById('name').disabled = true;
           document.getElementById('description').disabled = true;
        }
        $scope.$digest();
    };

    $scope.getGroupNameError = function (vXGroupsponse) {
    };

    $scope.putForm = function(id) {
        if($stateParams.status == "edit") {
            var urlString = "service/xusers/secure/groups/" + id;
            ajaxGet(urlString, $scope.getGroupNameSuccess, $scope.getGroupNameError);
        }
    }

    $scope.formData = {};
    $scope.putForm($stateParams.id);
}
]);
