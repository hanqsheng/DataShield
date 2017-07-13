/**
 * Created by hasen on 2017/6/19.
 */

function goAdminList(state) {
    state.go('app.audit.admin');
}


function adminTransform(val) {
    if (val) {
        val = 1;
    } else {
        val = 0;
    }

    return val;
}

var classType = {
    0: "None",
    1: "Message",
    2: "User Profile",
    3: "Authentication Session",
    4: "CLASS_TYPE_DATA_OBJECT",
    5: "CLASS_TYPE_NAMEVALUE",
    6: "CLASS_TYPE_LONG",
    7: "Password Change",
    8: "CLASS_TYPE_STRING",
    9: "CLASS_TYPE_ENUM",
    10: "CLASS_TYPE_ENUM_ELEMENT",
    11: "Response",
    1000: "Asset",
    1001: "Resource",
    1002: "Ranger Group",
    1003: "Ranger User",
    1004: "XA Group of Users",
    1005: "XA Group of groups",
    1006: "XA permissions for resource",
    1007: "XA audits for resource",
    1008: "XA credential store",
    1009: "XA Policy Export Audit",
    1010: "Transaction log",
    1011: "Admin Audit",
    1012: "Transaction log attribute",
    1020: "Ranger Policy",
    1030: "Ranger Service"
}

var operationPreFix = {
    2: "User Profile ",
    1002: "Group ",
    1003: "User ",
    1020: "Policy ",
    1030: "Service "
}

app.controller('adminController', ['$scope', '$http', '$state', '$translate', function($scope, $http, $state, $translate) {

    $scope.formData = {};
    $scope.tableloading = true;
    $scope.pageSize = 25;
    $scope.page = 0;
    $scope.pageFirst = true;
    $scope.searchPageFirst = true;
    $scope.adminListResponse = {};
    $scope.searchAdminListResponse = {};

    /* 翻页回调函数 */
    $scope.pageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        $scope.getAdminListInfo($scope.page, $scope.pageSize, $scope.startIndex,
            $scope.getAdminListSuccess,$scope.getAdminListError);
        return false;
    };


    /* 获取用户组列表信息成功后的回调函数 */
    $scope.getAdminListSuccess = function (vXAdminResponse) {

         var vXTrxLogs = vXAdminResponse.vXTrxLogs;

        $scope.adminListResponse = vXAdminResponse;

        for (var i = 0; i < vXTrxLogs.length; i++) {
            if (vXTrxLogs[i]["createDate"] != null) {
                vXTrxLogs[i]["createDate"] = new Date(vXTrxLogs[i]["createDate"]).toLocaleString();
            }

            vXTrxLogs[i].operation = operationPreFix[vXTrxLogs[i].objectClassType] + vXTrxLogs[i].action + "d ";/* +
                vXTrxLogs[i].objectName;*/
            vXTrxLogs[i].objectClassType = classType[vXTrxLogs[i].objectClassType];
        }

        $scope.adminTable = vXTrxLogs;
        $scope.tableLength = $scope.adminTable.length;
        $scope.tableloading = false;

        if ($scope.pageFirst == true) {
            $scope.pageFirst = false;
            $('#page').pagination(vXAdminResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.pageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getAdminListError = function (vXAdminResponse) {
        bootbox.alert("Get Admin List Information Error!!!");
    };

    /* 搜索翻页回调函数 */
    $scope.searchPageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        var total_page = Math.ceil($scope.searchAdminListResponse.totalCount/$scope.pageSize);
        var urlString = "/service/assets/report?page=" + $scope.page +
            "&pageSize=" + $scope.pageSize +
            "&total_pages=" + total_page +
            "&startIndex=" + $scope.startIndex +
            "&action=" + $scope.formData.actions;
        ajaxGet(urlString, $scope.getServiceNameSuccess, $scope.getServiceNameError);
        return false;
    };

    $scope.getAdminActionSuccess = function (vXAdminResponse) {
        var vXTrxLogs = vXAdminResponse.vXTrxLogs;
        var action;

        var hasAction = ["EXPORT JSON", "EXPORT EXCEL", "EXPORT CSV", "IMPORT START", "IMPORT END"];
        $scope.searchAdminListResponse = vXAdminResponse;
        for (var i = 0; i < vXTrxLogs.length; i++) {
            if (vXTrxLogs[i]["createDate"] != null) {
                vXTrxLogs[i]["createDate"] = new Date(vXTrxLogs[i]["createDate"]).toLocaleString();
            }

            vXTrxLogs[i].objectClassType = classType[vXTrxLogs[i].objectClassType];
            action = vXTrxLogs[i].action;
            if($.inArray(action,hasAction)>=0){
                if(action == "EXPORT JSON" || action == "EXPORT EXCEL" || action == "EXPORT CSV"){
                    vXTrxLogs[i].operation = 'Exported policies';
                } else {
                    vXTrxLogs[i].operation = action;
                }
            } else {
                vXTrxLogs[i].operation = operationPreFix[vXTrxLogs[i].objectClassType] + vXTrxLogs[i].action + "d ";
            }
        }

        $scope.adminTable = vXTrxLogs;
        $scope.tableLength = $scope.adminTable.length;
        $scope.tableloading = false;

        if ($scope.searchPageFirst == true) {
            $scope.searchPageFirst= false;
            $('#page').pagination(vXAdminResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.searchPageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getAdminActionError = function (vXAdminResponse) {
        bootbox.alert("No actions: " + $scope.formData.actions + " to be found!");
    };

    /* 响应搜索框输入完成后，按下enter按键后的响应函数 */
    document.searchAdminByActions = function(e) {
        var total_page=0;
        $scope.searchPageFirst = true;
        $scope.pageFirst = true;
        if (!e) {
            e = window.event;
        }
        if ((e.keyCode || e.which) == 13) {
            var urlString;
            if (adminTransform($scope.formData.actions)=== 0) {
                $scope.getAdminListInfo(0,$scope.pageSize,0,$scope.getAdminListSuccess, $scope.getAdminListError);
            }

            total_page = Math.ceil($scope.adminListResponse.totalCount/$scope.pageSize);
            urlString = "/service/assets/report?page=0" +
                "&pageSize=" + $scope.pageSize +
                "&total_pages=" + total_page +
                "&startIndex=0" + "&action=" + $scope.formData.action;
            ajaxGet(urlString, $scope.getAdminActionSuccess, $scope.getAdminActionError);
        }
    }

    /* 获取用户组列表信息公共接口函数定义 */
    $scope.getAdminListInfo = function (page, pageSize, startIndex, successCallback, errorCallback) {
        ajaxGet("/service/assets/report?page="+page+"&pageSize="+pageSize+"&startIndex="+ startIndex,
            successCallback, errorCallback);
    }

    /* 获取用户组列表信息 */
    $scope.getAdminListInfo(0,$scope.pageSize,0,$scope.getAdminListSuccess, $scope.getAdminListError);
}
]);
