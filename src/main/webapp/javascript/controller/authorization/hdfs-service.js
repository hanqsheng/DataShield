/**
 * Created by sunxia on 2017/6/16.
 */


app.controller('hdfsServiceAddController',['$scope', '$controller', '$http', '$state', '$stateParams', function($scope, $controller, $http, $state, $stateParams) {
    $controller('serviceBaseController', {$scope: $scope});
    $scope.showGoBack = false;
    $scope.submitServiceForm = function () {
        var configs = {
            "username": $scope.formData.username,
            "password": $scope.formData.password,
            "fs.default.name": $scope.formData.NamenodeUrl,
            "hadoop.security.authorization": $scope.formData.authorization,
            "hadoop.security.authentication": $scope.formData.authentication,
            "hadoop.security.auth_to_local": $scope.formData.auth_to_local,
            "hadoop.rpc.protection": $scope.formData.rpcprotection,
            "dfs.datanode.kerberos.principal": $scope.formData.datanode_kerberos,
            "dfs.namenode.kerberos.principal": $scope.formData.namenode_kerberos,
            "dfs.secondary.namenode.kerberos.principal": $scope.formData.secondary_namenode_kerberos,
            "commonNameForCertificate": $scope.formData.cn
        };
        $scope.addService(configs);

        return false;
    }
     $scope.setType("hdfs");
    $scope.setPolicyTableUrl("app.auth.hdfs");
    $scope.setService_name("clusterone_hadoop");

}
]);


app.controller('hdfsServiceEditController', ['$scope', '$controller', '$http', '$state', '$stateParams', function($scope, $controller, $http, $state, $stateParams) {
    $controller('serviceBaseController', {$scope: $scope});
    $scope.showGoBack = true;

    $scope.submitServiceForm = function () {
        var configs = {
            "fs.default.name" :$scope.formData.NamenodeUrl,
            "hadoop.security.authorization" :   $scope.formData.authorization,
            "hadoop.security.authentication" :  $scope.formData.authentication,
            "hadoop.security.auth_to_local" :$scope.formData.auth_to_local,
            "hadoop.rpc.protection" : $scope.formData.rpcprotection,
            "dfs.datanode.kerberos.principal" :  $scope.formData.datanode_kerberos,
            "dfs.namenode.kerberos.principal" :  $scope.formData.namenode_kerberos,
            "dfs.secondary.namenode.kerberos.principal":   $scope.formData.secondary_namenode_kerberos,
            "commonNameForCertificate" : $scope.formData.cn
        };

        $scope.editService(configs);

        return false;
    };

    $scope.serviceExtendToForm = function() {
        $scope.formData.NamenodeUrl = $scope.service.configs["fs.default.name"];
        $scope.formData.authorization =$scope.service.configs["hadoop.security.authorization"];
        $scope.formData.authentication = $scope.service.configs["hadoop.security.authentication"];
        $scope.formData.auth_to_local =$scope.service.configs["hadoop.security.auth_to_local"];
        $scope.formData.rpcprotection =$scope.service.configs["hadoop.rpc.protection"];
        $scope.formData.datanode_kerberos = $scope.service.configs["dfs.datanode.kerberos.principal"];
        $scope.formData.namenode_kerberos = $scope.service.configs["dfs.namenode.kerberos.principal"];
        $scope.formData.secondary_namenode_kerberos = $scope.service.configs["dfs.secondary.namenode.kerberos.principal"];
        $scope.formData.cn = $scope.service.configs.commonNameForCertificate;
    };

    $scope.setType("hdfs");
    $scope.setPolicyTableUrl("app.auth.hdfs");

    $scope.getServiceById($stateParams.id);

}
]);
