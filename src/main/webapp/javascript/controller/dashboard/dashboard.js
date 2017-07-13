/**
 * Created by Administrator on 2017/5/24.
 */
app.controller('dashboardCtrl', ['$scope', '$state',function($scope,$state) {
    $scope.hdfsCount = 0;
    $scope.hiveCount = 0;
    $scope.hbaseCount = 0;

    $scope.getHdfsCountSuccess = function (response) {
        $scope.hdfsCount = response;
        $scope.$digest();
    };

    $scope.getHdfsCountError = function (response) {

    };

    $scope.getHiveCountSuccess = function (response) {
        $scope.hiveCount = response;
        $scope.$digest();
    };

    $scope.getHiveCountError = function (response) {

    };

    $scope.getHbaseCountSuccess = function (response) {
        $scope.hbaseCount = response;
        $scope.$digest();
    };

    $scope.getHbaseCountError = function (response) {

    };


    $scope.getServiceSuccess = function (response) {
        var serviceTable = response.services;

        var map = new HashMap();
        angular.forEach(serviceTable, function (data) {
            map.put(data.type, data.id);
        })

        var hdfsId = map.get("hdfs");
        var hiveId = map.get("hive");
        var hbaseId = map.get("hbase");

        if (hdfsId != null) {
            ajaxGet("service/plugins/policies/count?serviceId=" + hdfsId, $scope.getHdfsCountSuccess, $scope.getHdfsCountError);
        }

        if (hiveId != null) {
            ajaxGet("service/plugins/policies/count?serviceId=" + hiveId, $scope.getHiveCountSuccess, $scope.getHiveCountError);
        }

        if (hbaseId != null) {
            ajaxGet("service/plugins/policies/count?serviceId=" + hbaseId, $scope.getHbaseCountSuccess, $scope.getHbaseCountError);
        }
    };

    $scope.getServiceError = function (response) {
    };


    ajaxGet("service/plugins/services", $scope.getServiceSuccess, $scope.getServiceError);
}
]);
