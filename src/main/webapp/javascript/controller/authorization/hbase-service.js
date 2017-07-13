/**
 * Created by sunxia on 2017/6/16.
 */


app.controller('hbaseServiceAddController',['$scope', '$controller', '$http', '$state', '$stateParams', function($scope, $controller, $http, $state, $stateParams) {
    $controller('serviceBaseController', {$scope: $scope});
    $scope.showGoBack = false;
    $scope.submitServiceForm = function () {
        var configs = {
            "username": $scope.formData.username,
            "password": $scope.formData.password,
            "hbase.zookeeper.quorum":  $scope.formData.zookeeper_quorum,
            "hadoop.security.authentication":  $scope.formData.hadoopauthentication,
            "hbase.security.authentication" : $scope.formData.hbaseauthentication,
            "hbase.zookeeper.property.clientPort": $scope.formData.zookeeper_clientPort,
            "hbase.master.kerberos.principal" :$scope.formData.master_kerberos,
            "zookeeper.znode.parent" :  $scope.formData.zookeeper_node,
            "commonNameForCertificate": $scope.formData.cn
        };
        $scope.addService(configs);

        return false;
    }
     $scope.setType("hbase");
    $scope.setPolicyTableUrl("app.auth.hbase");
    $scope.setService_name("clusterone_hbase");
}
]);


app.controller('hbaseServiceEditController', ['$scope', '$controller', '$http', '$state', '$stateParams', function($scope, $controller, $http, $state, $stateParams) {
    $controller('serviceBaseController', {$scope: $scope});
    $scope.showGoBack = true;

    $scope.submitServiceForm = function () {
        var configs = {
            "hbase.zookeeper.quorum":  $scope.formData.zookeeper_quorum,
            "hadoop.security.authentication":  $scope.formData.hadoopauthentication,
           "hbase.security.authentication" : $scope.formData.hbaseauthentication,
            "hbase.zookeeper.property.clientPort": $scope.formData.zookeeper_clientPort,
            "hbase.master.kerberos.principal" :$scope.formData.master_kerberos,
            "zookeeper.znode.parent" :  $scope.formData.zookeeper_node,
        };

        $scope.editService(configs);

        return false;
    };

    $scope.serviceExtendToForm = function() {
        $scope.formData.zookeeper_quorum = $scope.service.configs["hbase.zookeeper.quorum"];
        $scope.formData.hadoopauthentication =$scope.service.configs["hadoop.security.authentication"];
        $scope.formData.hbaseauthentication = $scope.service.configs["hbase.security.authentication"];
        $scope.formData.zookeeper_clientPort=$scope.service.configs["hbase.zookeeper.property.clientPort"];
        $scope.formData.master_kerberos =$scope.service.configs["hbase.master.kerberos.principal"];
        $scope.formData.zookeeper_node =$scope.service.configs["zookeeper.znode.parent"];

        $scope.formData.cn = $scope.service.configs.commonNameForCertificate;
    };




    $scope.setType("hbase");
    $scope.setPolicyTableUrl("app.auth.hbase");

    $scope.getServiceById($stateParams.id);

}
]);
