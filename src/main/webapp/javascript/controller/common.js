/**
 * Created by zhangtao on 2017/5/26.
 */
var serviceUrl = ""

function __ajaxRequest(method, requestUrl, headers, obj, successCallback, errorCallback) {
    var test = serviceUrl;
    $.ajax({
        url: serviceUrl + requestUrl,
        method: method,
        dataType: 'json',
        headers: headers,
        data:obj,
    success:successCallback,
    error:errorCallback
    });
}

function __jsonAjaxRequest(method, requestUrl, obj, successCallback, errorCallback) {
    var headers =  {
        'Content-Type': 'application/json; charset=UTF-8',
        'cache-control': 'no-cache'
    }

    __ajaxRequest(method, requestUrl, headers, JSON.stringify(obj), successCallback, errorCallback);
}

function ajaxPost(requestUrl, obj, successCallback, errorCallback) {
    __jsonAjaxRequest('POST', requestUrl, obj, successCallback, errorCallback);
}

function ajaxPut(requestUrl, obj, successCallback, errorCallback) {
    //obj['_method'] = 'PUT';
    //httpPost(http, requestUrl, obj, successCallback, errorCallback);
    __jsonAjaxRequest('PUT', requestUrl, obj, successCallback, errorCallback);
}

function ajaxGet(requestUrl, successCallback, errorCallback) {
    __jsonAjaxRequest('GET', requestUrl, null, successCallback, errorCallback);
}

function ajaxDelete(requestUrl, obj, successCallback, errorCallback) {
    __jsonAjaxRequest('DELETE', requestUrl, obj, successCallback, errorCallback);
}

function ajaxFormPost(requestUrl, obj, successCallback, errorCallback) {
    var headers =  {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cache-control': 'no-cache'
    }

    __ajaxRequest('POST', requestUrl, headers, obj, successCallback, errorCallback);
}


function ListCheck() {
    var checkedArray = new Array();
    var checkedname = new Array();

    this.toggleCheck = function(id,name) {
        var index = checkedArray.indexOf(id);
        if (index === -1) {
            checkedArray.push(id);
            checkedname.push(name);
        } else {
            checkedArray.splice(index, 1);
            checkedname.splice(index,1);
        }
    }

    this.toggleCheckAll = function(chkAll, table) {
        this.clearChecked();
        angular.forEach(table, function(value, key) {
            value.checked = chkAll;
            if (chkAll) {
                checkedArray.push(value.id);
                checkedname.push(value.name);
            }
        });
    }

    this.checkedCount = function() {
        return checkedArray.length;
    }

    this.getChecked = function() {
        return checkedArray;
    }

    this.getCheckedName = function() {
        return checkedname;
    }

    this.clearChecked = function() {
        checkedArray = [];
        checkedname = [];
    }
}


function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var str = '';
    for (i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
}

