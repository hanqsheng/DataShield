/**
 * Created by hasen on 2017/6/28.
 */

function goPluginList(state) {
    state.go('app.audit.plugin');
}


function pluginTransform(val) {
    if (val) {
        val = 1;
    } else {
        val = 0;
    }

    return val;
}

app.controller('pluginsController', ['$scope', '$http', '$state', '$translate', function($scope, $http, $state, $translate) {

    $scope.formData = {};
    $scope.tableloading = true;
    $scope.pageSize = 25;
    $scope.page = 0;
    $scope.pageFirst = true;
    $scope.searchPageFirst = true;
    $scope.pluginListResponse = {};
    $scope.searchPluginListResponse = {};

    /* 翻页回调函数 */
    $scope.pageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        $scope.getPluginListInfo($scope.page, $scope.pageSize, $scope.startIndex,
            $scope.getPluginListSuccess,$scope.getPluginListError);
        return false;
    };


    /* 获取用户组列表信息成功后的回调函数 */
    $scope.getPluginListSuccess = function (vXPluginResponse) {

        var vXPolicyExportAudits = vXPluginResponse.vXPolicyExportAudits;

        $scope.pluginListResponse = vXPluginResponse;

        for (var i = 0; i < vXPolicyExportAudits.length; i++) {
            if (vXPolicyExportAudits[i]["createDate"] != null) {
                vXPolicyExportAudits[i]["createDate"] = new Date(vXPolicyExportAudits[i]["createDate"]).toLocaleString();
            }
        }

        $scope.pluginTable = vXPolicyExportAudits;
        $scope.tableLength = $scope.pluginTable.length;
        $scope.tableloading = false;

        if ($scope.pageFirst == true) {
            $scope.pageFirst = false;
            $('#page').pagination(vXPluginResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.pageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getPluginListError = function (vXPluginResponse) {
        bootbox.alert("Get Plugin List Information Error!!!");
    };

    /* 搜索翻页回调函数 */
    $scope.searchPageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        var total_page = Math.ceil($scope.searchPluginListResponse.totalCount/$scope.pageSize);
        var urlString = "/service/assets/exportAudit?page=" + $scope.page +
            "&pageSize=" + $scope.pageSize +
            "&total_pages=" + total_page +
            "&sortBy=createDate&sortType=desc" +
            "&startIndex=" + $scope.startIndex +
            "&repositoryName=" + $scope.formData.service_name;
        ajaxGet(urlString, $scope.getPluginServiceNameSuccess, $scope.getPluginServiceNameError);
        return false;
    };

    $scope.getPluginServiceNameSuccess = function (vXPluginResponse) {
        var vXPolicyExportAudits = vXPluginResponse.vXPolicyExportAudits;

        $scope.pluginListResponse = vXPluginResponse;

        for (var i = 0; i < vXPolicyExportAudits.length; i++) {
            if (vXPolicyExportAudits[i]["createDate"] != null) {
                vXPolicyExportAudits[i]["createDate"] = new Date(vXPolicyExportAudits[i]["createDate"]).toLocaleString();
            }
        }

        $scope.pluginTable = vXPolicyExportAudits;
        $scope.tableLength = $scope.pluginTable.length;
        $scope.tableloading = false;

        $scope.pluginTable = vXPolicyExportAudits;
        $scope.tableLength = $scope.pluginTable.length;
        $scope.tableloading = false;

        if ($scope.searchPageFirst == true) {
            $scope.searchPageFirst= false;
            $('#page').pagination(vXPluginResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.searchPageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getPluginServiceNameError = function (vXPluginResponse) {
        bootbox.alert("No Service Name: " + $scope.formData.actions + " to be found!");
    };

    /* 响应搜索框输入完成后，按下enter按键后的响应函数 */
    document.searchPluginByServiceName = function(e) {
        $scope.searchPageFirst = true;
        $scope.pageFirst = true;
        if (!e) {
            e = window.event;
        }
        if ((e.keyCode || e.which) == 13) {
            var urlString;
            if (pluginTransform($scope.formData.service_name)=== 0) {
                $scope.getPluginListInfo(0,$scope.pageSize,0,$scope.getPluginListSuccess, $scope.getPluginListError);
            }

            urlString = "/service/assets/exportAudit?page=0" +
                "&pageSize=" + $scope.pageSize +
                "&startIndex=0" + "&repositoryName=" + $scope.formData.service_name;
            ajaxGet(urlString, $scope.getPluginServiceNameSuccess, $scope.getPluginServiceNameError);
        }
    }

    /* 获取用户组列表信息公共接口函数定义 */
    $scope.getPluginListInfo = function (page, pageSize, startIndex, successCallback, errorCallback) {
        ajaxGet("/service/assets/exportAudit?page="+page+"&pageSize="+pageSize+"&startIndex="+ startIndex,
            successCallback, errorCallback);
    }

    /* 获取用户组列表信息 */
    $scope.getPluginListInfo(0,$scope.pageSize,0,$scope.getPluginListSuccess, $scope.getPluginListError);
}
]);
