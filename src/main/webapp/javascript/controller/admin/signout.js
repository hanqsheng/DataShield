/**
 * Created by zhangtao on 2017/6/2.
 */
app.controller('signOutController', ['$scope', '$state',function($scope, $state) {
    $scope.signOutSuccess = function (response) {
        //$state.go('app.home');
        window.location.replace('locallogin');
    };

    $scope.signOutError = function (response, status) {

    };

    $scope.signOut = function() {
        ajaxGet('security-admin-web/logout.html', $scope.signOutSuccess, $scope.signOutError);
        return false;
    };
}]);
