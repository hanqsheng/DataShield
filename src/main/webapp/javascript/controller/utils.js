
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function isNum(s) {
    if(s != null) {
        var reg = new RegExp("^-?\\d+$");
        return reg.test(s)? true:false;
    }
    return false;
}

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

function checkRangeAdnShowPrompt(str, ctrlId, min, max) {
    if (!isNum(str) || (str < min) || (str > max)) {
        warmCtrl(ctrlId);
        return false;
    }

    normalCtrl(ctrlId);
    return true;
}

function checkThresholdRangeFixValue(str, ctrlId) {
    var max = 9999999999;
    var min = 1;
    if ((str < min) || (str > max)) {
        warmCtrl(ctrlId);
        return false;
    }

    normalCtrl(ctrlId);
    return true;
}

function checkMinAndShowPrompt(str, ctrlId, min) {
    if (!isNum(str) || (str <= min)) {
        warmCtrl(ctrlId);
        return false;
    }

    normalCtrl(ctrlId);
    return true;
}

function checkPIntAndShowPrompt(str, ctrlId)
{
	if (isNum(str) && str > 0 && str%1===0)
	{
		normalCtrl(ctrlId);
	    return true;
	}

	warmCtrl(ctrlId);
    return false;
}

function date2time(obj){

	var dateString;
	var yearString;
	var year;
	var month;
	var day;
	var hour;
	var min;
	var sec;

	yearString = obj.toLocaleDateString();
	year = obj.getFullYear();
	month = obj.getMonth();
	day = obj.getDay();
	hour = obj.getHours();
	min = obj.getMinutes();
	sec = obj.getSeconds();

	dateString = year+"-"+month+"-"+day + " "+ hour+":"+min+":"+sec;

    return dateString;
}
