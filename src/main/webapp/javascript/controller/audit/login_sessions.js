/**
 * Created by hasen on 2017/6/19.
 */

function goAccessList(state) {
    state.go('app.audit.access');
}


function accessTransform(val) {
    if (val) {
        val = 1;
    } else {
        val = 0;
    }

    return val;
}

app.controller('loginSessionsController', ['$scope', '$http', '$state', '$translate', function($scope, $http, $state, $translate) {

    $scope.formData = {};
    $scope.tableloading = true;
    $scope.pageSize = 25;
    $scope.page = 0;
    $scope.pageFirst = true;
    $scope.searchPageFirst = true;
    $scope.accessListResponse = {};
    $scope.searchAccessListResponse = {};

    /* 翻页回调函数 */
    $scope.pageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        $scope.getAccessListInfo($scope.page, $scope.pageSize, $scope.startIndex,
            $scope.getAccessListSuccess,$scope.getAccessListError);
        return false;
    };


    /* 获取用户组列表信息成功后的回调函数 */
    $scope.getAccessListSuccess = function (vXAccessResponse) {

        var vXAccessAudits = vXAccessResponse.vXAuthSessions;
        /*var vXAccessAudits = vxAccessJson.vXAccessAudits;*/

        var reg = /([\d\-]+)T(\d+:\d+)\:.*/;
        $scope.accessListResponse = vXAccessResponse;
        /*var date = vXAccessAudits[0].eventTime.replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');*/

        for (var i = 0; i < vXAccessAudits.length; i++) {
            if (vXAccessAudits[i]["authTime"] != null) {
                vXAccessAudits[i]["authTime"] = new Date(vXAccessAudits[i]["authTime"]).toLocaleString();
            }
        }
        $scope.LoginSessionTable = vXAccessAudits;
        $scope.tableLength = $scope.LoginSessionTable.length;
        $scope.tableloading = false;

        if ($scope.pageFirst == true) {
            $scope.pageFirst = false;
            $('#page').pagination(vXAccessResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.pageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getAccessListError = function (vXAccessResponse) {
        bootbox.alert("Get Access List Information Error!!!");
    };

    /* 搜索翻页回调函数 */
    $scope.searchPageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.startIndex = $scope.page * $scope.pageSize;
        var total_page = Math.ceil($scope.searchAccessListResponse.totalCount/$scope.pageSize);
        var urlString = "service/xusers/authSessions?page=0" +
            "&pageSize=" + $scope.pageSize +
            "&total_pages=" + total_page +
            "&startIndex=" + $scope.startIndex +
            "&sortBy=id&sortType=desc" + "&loginId=" + $scope.formData.loginId;
        ajaxGet(urlString, $scope.getServiceNameSuccess, $scope.getServiceNameError);
        return false;
    };

    $scope.getServiceNameSuccess = function (vXAccessResponse) {
        var vXAccessAudits = vXAccessResponse.vXAuthSessions;
        var reg = /([\d\-]+)T(\d+:\d+)\:.*/;
        $scope.searchAccessListResponse = vXAccessResponse;
        for (var i = 0; i < vXAccessAudits.length; i++) {
            if (vXAccessAudits[i]["authTime"] != null) {
                vXAccessAudits[i]["authTime"] = new Date(vXAccessAudits[i]["authTime"]).toLocaleString();
            }
        }

        $scope.LoginSessionTable = vXAccessAudits;
        $scope.tableLength = $scope.LoginSessionTable.length;
        $scope.tableloading = false;

        if ($scope.searchPageFirst == true) {
            $scope.searchPageFirst= false;
            $('#page').pagination(vXAccessResponse.totalCount, {
                num_edge_entries: 1,
                callback: $scope.searchPageSelectCallback,
                items_per_page : $scope.pageSize
            });
        }

        $scope.$digest();
    };

    $scope.getServiceNameError = function (vXAccessResponse) {
        bootbox.alert("No service name: " + $scope.formData.repoName + " to be found!");
    };

    /* 响应搜索框输入完成后，按下enter按键后的响应函数 */
    document.searchSessionsByid = function(e) {
        var total_page=0;
        $scope.searchPageFirst = true;
        $scope.pageFirst = true;
        if (!e) {
            e = window.event;
        }
        if ((e.keyCode || e.which) == 13) {
            var urlString;
            if (accessTransform($scope.formData.loginId)=== 0) {
                $scope.getAccessListInfo(0,$scope.pageSize,0,$scope.getAccessListSuccess, $scope.getAccessListError);
            }

            total_page = Math.ceil($scope.accessListResponse.totalCount/$scope.pageSize);
            urlString = "service/xusers/authSessions?page=0" +
                "&pageSize=" + $scope.pageSize +
                "&total_pages=" + total_page +
                /*"&totalCount=" + $scope.accessListResponse.totalCount +*/
                "&startIndex=0" + "&sortBy=id&sortType=desc" + "&loginId=" + $scope.formData.loginId;
            ajaxGet(urlString, $scope.getServiceNameSuccess, $scope.getServiceNameError);
        }
    }

    /* 获取用户组列表信息公共接口函数定义 */
    $scope.getAccessListInfo = function (page, pageSize, startIndex, successCallback, errorCallback) {
        ajaxGet("service/xusers/authSessions?page="+page+"&pageSize="+pageSize+"&startIndex="+ startIndex +
            "&sortBy=id&sortType=desc", successCallback, errorCallback);
    }

    /* 获取用户组列表信息 */
    $scope.getAccessListInfo(0,$scope.pageSize,0,$scope.getAccessListSuccess, $scope.getAccessListError);
}
]);
