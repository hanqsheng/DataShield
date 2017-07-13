/**
 * Created by hasen on 2017/7/7.
 */

function normalCtrl(ctrlId) {
    document.getElementById(ctrlId).style.border = "1px solid #ccc";

}

function warmCtrl(ctrlId) {
    document.getElementById(ctrlId).style.border = "1px solid red";
    //$('#' + ctrlId).addClass("form-control has-error");
}

function checkNullAndShowPrompt(str, ctrlId) {
    if ((str === undefined) || (str === '')) {
        warmCtrl(ctrlId);
        return false;
    }

    normalCtrl(ctrlId);

    return true;
}

app.controller('userInfoController', ['$scope', '$http', '$state', '$translate', function($scope, $http, $state, $translate) {

    $scope.formData = {};
    $scope.tableloading = true;
    $scope.sourceLDAP = false;
    $scope.enable_group_sync = false;
    $scope.properties = {};



    $scope.getInstallPropertiesSuccess = function(response) {
        var propertiesJson = eval(response);
        $scope.properties = propertiesJson;


        /**********************************sync source************************************/
        if (propertiesJson.SYNC_SOURCE === '') {
            $scope.formData.syncSource = "unix";
        } else {
            $scope.formData.syncSource = propertiesJson.SYNC_SOURCE;

            if ($scope.formData.syncSource === "ldap") {
                $scope.sourceLDAP = true;
            } else {
                $scope.sourceLDAP = false;
            }
        }

        /*$scope.formData.SYNC_LDAP_USERNAME_CASE_CONVERSION = propertiesJson.SYNC_LDAP_USERNAME_CASE_CONVERSION;
        $scope.formData.SYNC_LDAP_GROUPNAME_CASE_CONVERSION = propertiesJson.SYNC_LDAP_GROUPNAME_CASE_CONVERSION;*/
        /**********************************for unix************************************/
/*        $scope.formData.MIN_UNIX_USER_ID_TO_SYNC = propertiesJson.MIN_UNIX_USER_ID_TO_SYNC;
        $scope.formData.SYNC_INTERVAL = propertiesJson.SYNC_INTERVAL;//sync interval in minutes*/
        /**********************************for ldap's common configs************************************/
        $scope.formData.ldap_url = propertiesJson.SYNC_LDAP_URL;
        $scope.formData.bind_user = propertiesJson.SYNC_LDAP_BIND_DN;
        $scope.formData.password = propertiesJson.SYNC_LDAP_BIND_PASSWORD;
        $scope.formData.repassword = propertiesJson.SYNC_LDAP_BIND_PASSWORD;
        /**********************************for ldap's user configs************************************/

        if (propertiesJson.SYNC_LDAP_USER_NAME_ATTRIBUTE === '') {
            $scope.formData.username_attr = "cn";
        } else {
            $scope.formData.username_attr = propertiesJson.SYNC_LDAP_USER_NAME_ATTRIBUTE;
        }

        if (propertiesJson.SYNC_LDAP_USER_OBJECT_CLASS === '') {
            $scope.formData.userObject_class = "person";
        } else {
            $scope.formData.userObject_class = propertiesJson.SYNC_LDAP_USER_OBJECT_CLASS;
        }

        $scope.formData.userSearch_base = propertiesJson.SYNC_LDAP_USER_SEARCH_BASE;
        $scope.formData.userSearch_filter = propertiesJson.SYNC_LDAP_USER_SEARCH_FILTER;

        if (propertiesJson.SYNC_LDAP_USER_SEARCH_SCOPE === '') {
            $scope.formData.userSearch_scope = "sub";
        } else {
            $scope.formData.userSearch_scope = propertiesJson.SYNC_LDAP_USER_SEARCH_SCOPE;
        }

        if (propertiesJson.SYNC_LDAP_USER_GROUP_NAME_ATTRIBUTE === '') {
            $scope.formData.userGroupName_attr = "memberof,ismemberof";
        } else {
            $scope.formData.userGroupName_attr = propertiesJson.SYNC_LDAP_USER_GROUP_NAME_ATTRIBUTE;
        }

        if (propertiesJson.SYNC_GROUP_USER_MAP_SYNC_ENABLED === '') {
            $scope.formData.groupUserMap_sync = false;
        } else {
            $scope.formData.groupUserMap_sync = JSON.parse(propertiesJson.SYNC_GROUP_USER_MAP_SYNC_ENABLED);
        }
        /**********************************for ldap's group configs************************************/
        if (propertiesJson.SYNC_GROUP_NAME_ATTRIBUTE === '') {
            $scope.formData.groupName_attr = "cn";
        } else {
            $scope.formData.groupName_attr = propertiesJson.SYNC_GROUP_NAME_ATTRIBUTE;
        }

        if (propertiesJson.SYNC_GROUP_MEMBER_ATTRIBUTE_NAME === '') {
            $scope.formData.groupMember_attr = "member";
        } else {
            $scope.formData.groupMember_attr = propertiesJson.SYNC_GROUP_MEMBER_ATTRIBUTE_NAME;
        }

        if (propertiesJson.SYNC_GROUP_OBJECT_CLASS === '') {
            $scope.formData.groupObject_class = "groupofnames";
        } else {
            $scope.formData.groupObject_class = propertiesJson.SYNC_GROUP_OBJECT_CLASS;
        }
        $scope.formData.groupSearch_base = propertiesJson.SYNC_GROUP_SEARCH_BASE;
        $scope.formData.groupSearch_filter = propertiesJson.SYNC_LDAP_GROUP_SEARCH_FILTER;
        if (propertiesJson.SYNC_GROUP_SEARCH_ENABLED === '') {
            $scope.formData.groupSearch_enable = false;
        } else {
            $scope.formData.groupSearch_enable = JSON.parse(propertiesJson.SYNC_GROUP_SEARCH_ENABLED);
        }

        /****************************************end**************************************************/
        $scope.$digest();
    }

    $scope.getInstallPropertiesError = function(response) {
        bootbox.alert({
            message:"Save failed!",
            size: 'small'
        });
    }
    $scope.getInstallProperties = function() {
        var urlString = "http://10.111.121.30/install_properties";
        ajaxGet(urlString, $scope.getInstallPropertiesSuccess, $scope.getInstallPropertiesError);
    }

    $scope.submitSuccess = function() {
        bootbox.alert({
            message:"Save successfully!",
            size: 'small'
        });
    }

    $scope.submitError = function() {
        bootbox.alert({
            message:"Save failed!",
            size: 'small'
        });
    }

    $scope.submitForm=function () {

        /**********************************check ldap's common configs************************************/
        if (checkNullAndShowPrompt($scope.formData.ldap_url, "ldap_url") != true) {
            bootbox.alert({
                    message:$translate.instant('CERTIFICATE.USER_INFO.LDAP/AD_URL') + $translate.instant('OTHER.NO_EMPTY'),
                    size: 'small'
                });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.bind_user, "bind_user") != true) {
            bootbox.alert({
                    message:$translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_BIND_DN') + $translate.instant('OTHER.NO_EMPTY'),
                    size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.password, "password") != true) {
            bootbox.alert({
                message:$translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_BIND_PASSWORD') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.repassword, "repassword") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.CONFIRM_PASSWORD') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message:$translate.instant('CERTIFICATE.USER_INFO.CONFIRM_PASSWORD') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }
        /***************************************************end**************************************************************/

        /**********************************check ldap's user configs********************************************************/
        if (checkNullAndShowPrompt($scope.formData.username_attr, "username_attr") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_NAME_ATTRIBUTE') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message:$translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_NAME_ATTRIBUTE') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.userObject_class, "userObject_class") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_OBJECT_CLASS') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message:$translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_OBJECT_CLASS') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }


        if (checkNullAndShowPrompt($scope.formData.userSearch_base, "userSearch_base") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_SEARCH_BASE') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message:$translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_SEARCH_BASE') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.userGroupName_attr, "userGroupName_attr") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_GROUP_NAME_ATTRIBUTE') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message:$translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_USER_GROUP_NAME_ATTRIBUTE') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }
        /***********************************************************end***************************************************************/

        /**********************************check ldap's group configs****************************************************************/

        if (checkNullAndShowPrompt($scope.formData.groupMember_attr, "groupMember_attr") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_MEMBER_ATTRIBUTE_NAME') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message: $translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_MEMBER_ATTRIBUTE_NAME') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.groupName_attr, "groupName_attr") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_NAME_ATTRIBUTE') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message: $translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_NAME_ATTRIBUTE') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.groupObject_class, "groupObject_class") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_OBJECT_CLASS') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message: $translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_OBJECT_CLASS') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.groupSearch_base, "groupSearch_base") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_SEARCH_BASE') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message: $translate.instant('CERTIFICATE.USER_INFO.SYNC_GROUP_SEARCH_BASE') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }

        if (checkNullAndShowPrompt($scope.formData.groupSearch_filter, "groupSearch_filter") != true) {
            /*bootbox.alert($translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_GROUP_SEARCH_FILTER') + $translate.instant('OTHER.NO_EMPTY'));*/
            bootbox.alert({
                message: $translate.instant('CERTIFICATE.USER_INFO.SYNC_LDAP_GROUP_SEARCH_FILTER') + $translate.instant('OTHER.NO_EMPTY'),
                size: 'small'
            });
            return;
        }
        /***********************************************************end check*****************************************************************/


        if ($scope.formData.password !== $scope.formData.repassword) {
            bootbox.alert("You did not enter the same password, please check it and re-enter!");
        }

        var urlString = "http://10.111.121.30/install_properties";
        $scope.properties.SYNC_SOURCE = $scope.formData.syncSource;
        /*$scope.properties.MIN_UNIX_USER_ID_TO_SYNC = $scope.formData.MIN_UNIX_USER_ID_TO_SYNC;
        $scope.properties.SYNC_INTERVAL = $scope.formData.SYNC_INTERVAL;*/
        $scope.properties.SYNC_LDAP_URL = $scope.formData.ldap_url;
        $scope.properties.SYNC_LDAP_BIND_DN = $scope.formData.bind_user;
        $scope.properties.SYNC_LDAP_BIND_PASSWORD = $scope.formData.password;
        $scope.properties.SYNC_LDAP_USER_SEARCH_BASE = $scope.formData.userSearch_base;
        $scope.properties.SYNC_LDAP_USER_SEARCH_SCOPE = $scope.formData.userSearch_scope;

        $scope.properties.SYNC_LDAP_USER_OBJECT_CLASS = $scope.formData.userObject_class;
        $scope.properties.SYNC_LDAP_USER_SEARCH_FILTER = $scope.formData.userSearch_filter;

        $scope.properties.SYNC_LDAP_USER_NAME_ATTRIBUTE = $scope.formData.username_attr;
        $scope.properties.SYNC_LDAP_USER_GROUP_NAME_ATTRIBUTE = $scope.formData.userGroupName_attr;
        $scope.properties.SYNC_LDAP_USERNAME_CASE_CONVERSION = $scope.formData.SYNC_LDAP_USERNAME_CASE_CONVERSION;
        $scope.properties.SYNC_LDAP_GROUPNAME_CASE_CONVERSION = $scope.formData.SYNC_LDAP_GROUPNAME_CASE_CONVERSION;
        $scope.properties.SYNC_GROUP_USER_MAP_SYNC_ENABLED = $scope.formData.groupUserMap_sync;
        $scope.properties.SYNC_GROUP_SEARCH_BASE = $scope.formData.groupSearch_base;
        $scope.properties.SYNC_GROUP_OBJECT_CLASS = $scope.formData.groupObject_class;
        $scope.properties.SYNC_LDAP_GROUP_SEARCH_FILTER = $scope.formData.groupSearch_filter;
        $scope.properties.SYNC_GROUP_NAME_ATTRIBUTE = $scope.formData.groupName_attr;
        $scope.properties.SYNC_GROUP_MEMBER_ATTRIBUTE_NAME = $scope.formData.groupMember_attr;
        $scope.properties.SYNC_GROUP_SEARCH_ENABLED = $scope.formData.groupSearch_enable;

        ajaxPut(urlString, $scope.properties,  $scope.submitSuccess, $scope.submitError);
    }

    $scope.checkField=function(){
        var value = $scope.formData.syncSource;
        if (value =="ldap") {
            $scope.sourceLDAP = true;
            $scope.formData.SYNC_INTERVAL = 360;//sync interval in minutes
        } else {
            $scope.sourceLDAP = false;
        }
    }

    /*$scope.enableGroupSync = function() {
        if ($scope.formData.groupSync_enable === true) {
            $scope.enable_group_sync = true;
        } else {
            $scope.enable_group_sync = false;
        }
    }*/

    $scope.blurCheckRepwd=function() {
         if ($scope.formData.password !== $scope.formData.repassword) {
             bootbox.alert("You did not enter the same password, please check it and re-enter!");
         }
    }

    $scope.goDiscard = function() {
        $scope.getInstallProperties();
    }
/*

    /!**********************************sync source************************************!/
    $scope.formData.syncSource="unix";
    $scope.formData.SYNC_LDAP_USERNAME_CASE_CONVERSION="lower";
    $scope.formData.SYNC_LDAP_GROUPNAME_CASE_CONVERSION="lower";
    /!**********************************for unix************************************!/
    $scope.formData.MIN_UNIX_USER_ID_TO_SYNC = 500;
    $scope.formData.SYNC_INTERVAL = 5;//sync interval in minutes
    /!**********************************for ldap's common configs************************************!/
    $scope.formData.ldap_url = "123";
    $scope.formData.bind_user = "123" ;
    $scope.formData.password = "123";
    $scope.formData.repassword = "123";
    /!**********************************for ldap's user configs************************************!/
    $scope.formData.username_attr = "cn";
    $scope.formData.userObject_class = "person";
    $scope.formData.userSearch_base = "123";
    $scope.formData.userSearch_filter = "123";
    $scope.formData.userSearch_scope = "sub";
    $scope.formData.userGroupName_attr = "memberof,ismemberof";
    $scope.formData.groupUserMap_sync = true;
    /!**********************************for ldap's group configs************************************!/
    $scope.formData.groupName_attr = "cn";
    $scope.formData.groupMember_attr = "member";
    $scope.formData.groupObject_class = "groupofnames";
    $scope.formData.groupSearch_base = "123";
    $scope.formData.groupSearch_filter = "123";
    /!****************************************end****************************************!/
*/

    $scope.getInstallProperties();
}
]);
