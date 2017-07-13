/**
 * Created by zhangtao on 2017/6/12.
 */
app.controller('authTableBaseController', ['$scope', '$controller', '$http', '$translate', '$state', function($scope, $controller, $http, $translate, $state) {
    $controller('authBaseController', {$scope: $scope});
    $scope.pageSize = 25;
    $scope.page = 0;
    $scope.service = null;
    $scope.pluginName = null;
    $scope.addUrl = null;
    $scope.editUrl = null;
    $scope.keyword = null;
    $scope.listCheck = new ListCheck();

    $scope.pageSelectCallback = function(page_index, jq) {
        $scope.page = page_index;
        $scope.pageSelectGetPluginPoliciesList($scope.service);
        return false;
    };

    $scope.updateTableList = function (response) {
        $scope.hdfsTable = response.policies;

        $scope.tableLength = $scope.hdfsTable.length;
        $scope.tableloading = false;
    };

    $scope.pageSelectGetPluginPoliciesListSuccess = function(response) {
        $scope.updateTableList(response);
        $scope.$digest();
    }

    $scope.getPluginPoliciesListSuccess = function (response) {
        $scope.updateTableList(response);

        $('#page').pagination(response.totalCount, {
            num_edge_entries: 1,
            callback: $scope.pageSelectCallback,
            items_per_page : $scope.pageSize
        });

        $scope.$digest();
    };

    $scope.getPluginPoliciesListError = function (response, status) {

    };

    $scope.getPluginPolicies = function (e, successCallback) {
        var startIndex = $scope.page * $scope.pageSize;
        var url = "service/plugins/policies/service/" + e.id + "?page=" + $scope.page + "&pageSize=" + $scope.pageSize + "&startIndex=" + startIndex + "&policyType=0";
        if (($scope.keyword != null) && ($scope.keyword != "")) {
            url += "&policyNamePartial=" + $scope.keyword;
        }
        ajaxGet(url, successCallback, $scope.getPluginPoliciesListError);
    };

    $scope.getPluginPoliciesList = function (e) {
        $scope.getPluginPolicies(e, $scope.getPluginPoliciesListSuccess);
    };

    $scope.pageSelectGetPluginPoliciesList = function (e) {
        $scope.getPluginPolicies(e, $scope.pageSelectGetPluginPoliciesListSuccess);
    };


    $scope.serviceCallback = function(service) {
        $scope.getPluginPoliciesList(service);
    };



    $scope.setActionUrl = function (addUrl, editUrl) {
        $scope.addUrl = addUrl;
        $scope.editUrl = editUrl;
    };


    $scope.add = function() {
        $state.go($scope.addUrl);
    };

    $scope.edit = function(id) {
        //ajaxGet("service/plugins/policies/" + id, $scope.getPluginPolicyByIdSuccess, $scope.getPluginPolicyByIdError);
        //$scope.state();
        $state.go($scope.editUrl, {id: id});
    };

    $scope.delSuccess = function(resp) {
        $scope.page = 0;
        $scope.getPluginPoliciesList($scope.service);
    };

    $scope.delError = function(resp) {

    };

    $scope.del = function(id) {
        bootbox.confirm($translate.instant('OTHER.CONFIRM') +  "?", function(result) {
            if (!result) {
                return;
            }
            ajaxDelete("service/plugins/policies/" + id, null, $scope.delSuccess, $scope.delError);
        });
    };

    $scope.searchPolicy = function(e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode != 13){
            return;
        }

        $scope.page = 0;
        $scope.getPluginPoliciesList($scope.service);
    };

    $scope.goEditService = function () {
        $state.go($scope.editServiceUrl, {id : $scope.service.id});
    };
}
]);
