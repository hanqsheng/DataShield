/**
 * Created by hasen on 2017/6/24.
 */

function goPluginStatusList(state) {
    state.go('app.audit.pluginStatus');
}


function pluginStatusTransform(val) {
    if (val) {
        val = 1;
    } else {
        val = 0;
    }

    return val;
}

function timestampToString(val) {
    var Y,M,D,h,m,s,ss;
    if (val == null || val=='' || val==undefined) {
        return "null";
    }

    var timestamp = parseInt(val)
    var date = new Date(timestamp); //传个时间戳过去就可以了
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() < 10 ? '0'+ date.getMinutes() + ":" : date.getMinutes() + ':';
    s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();
    ss = date.getMilliseconds();
    return Y+M+D+h+m+s;
}

app.controller('pluginStatusController', ['$scope', '$http', '$state', '$translate', function($scope, $http, $state, $translate) {

    $scope.formData = {};
    $scope.tableloading = true;
    $scope.pageSize = 25;
    $scope.page = 0;
    $scope.pageFirst = true;
    $scope.searchPageFirst = true;
    $scope.pluginStatusListResponse = {};
    $scope.searchPluginStatusListResponse = {};

    /* 翻页回调函数 */
    $scope.pageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        $scope.getPluginStatusListInfo($scope.page, $scope.pageSize, $scope.startIndex,
            $scope.getPluginStatusSuccess,$scope.getPluginStatusError);
        return false;
    };


    /* 获取用户组列表信息成功后的回调函数 */
    $scope.getPluginStatusListSuccess = function (vXPluginStatusResponse) {

        var pluginInfoList = vXPluginStatusResponse.pluginInfoList;

        $scope.pluginStatusListResponse = vXPluginStatusResponse;

        for (var i = 0; i < pluginInfoList.length; i++) {
            pluginInfoList[i].info.policyActivationTime = timestampToString(pluginInfoList[i].info.policyActivationTime);
            pluginInfoList[i].info.policyDownloadTime = timestampToString(pluginInfoList[i].info.policyDownloadTime);
            pluginInfoList[i].info.lastPolicyUpdateTime = timestampToString(pluginInfoList[i].info.lastPolicyUpdateTime);
            pluginInfoList[i].info.tagActivationTime = timestampToString(pluginInfoList[i].info.tagActivationTime);
            pluginInfoList[i].info.tagDownloadTime = timestampToString(pluginInfoList[i].info.tagDownloadTime);
            pluginInfoList[i].info.lastTagUpdateTime = timestampToString(pluginInfoList[i].info.lastTagUpdateTime);
        }

        $scope.pluginStatusTable = pluginInfoList;
        $scope.tableLength = $scope.pluginStatusTable.length;
        $scope.tableloading = false;

        if ($scope.pageFirst == true) {
            $scope.pageFirst = false;
            $('#page').pagination(vXPluginStatusResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.pageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getPluginStatusListError = function (vXPluginStatusResponse) {
        bootbox.alert("Get PluginStatus List Information Error!!!");
    };

    /* 搜索翻页回调函数 */
    $scope.searchPageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        var total_page = Math.ceil($scope.searchPluginStatusListResponse.totalCount/$scope.pageSize);
        var urlString = "/service/plugins/plugins/info?page" + $scope.page +
            "&pageSize=" + $scope.pageSize +
            "&total_pages=" + total_page +
            "&startIndex=" + $scope.startIndex +
            "&pluginHostName=" + $scope.formData.hostname;
        ajaxGet(urlString, $scope.getServiceNameSuccess, $scope.getServiceNameError);
        return false;
    };

    $scope.getPluginStatusSuccess = function (vXPluginStatusResponse) {
        var pluginInfoList = vXPluginStatusResponse.pluginInfoList;

        $scope.searchPluginStatusListResponse = vXPluginStatusResponse;
        for (var i = 0; i < pluginInfoList.length; i++) {
            pluginInfoList[i].info.policyActivationTime = timestampToString(pluginInfoList[i].info.policyActivationTime);
            pluginInfoList[i].info.policyDownloadTime = timestampToString(pluginInfoList[i].info.policyDownloadTime);
            pluginInfoList[i].info.lastPolicyUpdateTime = timestampToString(pluginInfoList[i].info.lastPolicyUpdateTime);
            pluginInfoList[i].info.tagActivationTime = timestampToString(pluginInfoList[i].info.tagActivationTime);
            pluginInfoList[i].info.tagDownloadTime = timestampToString(pluginInfoList[i].info.tagDownloadTime);
            pluginInfoList[i].info.lastTagUpdateTime = timestampToString(pluginInfoList[i].info.lastTagUpdateTime);
        }

        $scope.pluginStatusTable = pluginInfoList;
        $scope.tableLength = $scope.pluginStatusTable.length;
        $scope.tableloading = false;

        if ($scope.searchPageFirst == true) {
            $scope.searchPageFirst= false;
            $('#page').pagination(vXPluginStatusResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.searchPageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getPluginStatusError = function (vXPluginStatusResponse) {
        bootbox.alert("No hostname: " + $scope.formData.hostname + " to be found!");
    };

    /* 响应搜索框输入完成后，按下enter按键后的响应函数 */
    document.searchPluginStatusByHostName = function(e) {
        var total_page=0;
        $scope.searchPageFirst = true;
        $scope.pageFirst = true;
        if (!e) {
            e = window.event;
        }
        if ((e.keyCode || e.which) == 13) {
            var urlString;
            if (pluginStatusTransform($scope.formData.hostname)=== 0) {
                $scope.getPluginStatusListInfo(0,$scope.pageSize,0,$scope.getPluginStatusListSuccess, $scope.getPluginStatusListError);
            }

            total_page = Math.ceil($scope.pluginStatusListResponse.totalCount/$scope.pageSize);
            urlString = "/service/plugins/plugins/info?page=0" +
                "&pageSize=" + $scope.pageSize +
                "&total_pages=" + total_page +
                "&startIndex=0" + "&pluginHostName=" + $scope.formData.hostname;
            ajaxGet(urlString, $scope.getPluginStatusActionSuccess, $scope.getPluginStatusActionError);
        }
    }

    /* 获取用户组列表信息公共接口函数定义 */
    $scope.getPluginStatusListInfo = function (page, pageSize, startIndex, successCallback, errorCallback) {
        ajaxGet("/service/plugins/plugins/info?page="+page+"&pageSize="+pageSize+"&startIndex="+ startIndex,
            successCallback, errorCallback);
    }

    /* 获取用户组列表信息 */
    $scope.getPluginStatusListInfo(0,$scope.pageSize,0,$scope.getPluginStatusListSuccess, $scope.getPluginStatusListError);
}
]);
