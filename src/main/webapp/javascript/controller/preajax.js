/**
 * Created by zhangtao on 2017/6/8.
 */
(function(){
    var restCsrfCustomHeader = null;
    var restCsrfMethodsToIgnore = null;

// Adds custom headers to request if necessary.  This is done only for WebHDFS
// URLs, and only if it's not an ignored method.
    function addRestCsrfCustomHeader(xhr, settings) {
//    if (settings.url == null || !settings.url.startsWith('/webhdfs/')) {
        if (settings.url == null ) {
            return;
        }
        var method = settings.type;
        if (restCsrfCustomHeader != null && !restCsrfMethodsToIgnore[method]) {
            // The value of the header is unimportant.  Only its presence matters.
            xhr.setRequestHeader(restCsrfCustomHeader, '""');
        }

    }

    function restCsrf() {
        var url = "service/plugins/csrfconf";

        $.ajax({'url': url, 'dataType': 'json', 'async': false}).done(
            function(data) {
                function getTrimmedStringArrayValue(element) {
                    var str = element, array = [];
                    if (str) {
                        var splitStr = str.split(',');
                        for (var i = 0; i < splitStr.length; i++) {
                            array.push(splitStr[i].trim());
                        }
                    }
                    return array;
                }

                // Get all relevant configuration properties.
                var $xml = $(data);
                var csrfEnabled = false;
                var header = null;
                var methods = [];
                $xml.each(function(indx,element){
                    if(element['ranger.rest-csrf.enabled']) {
                        var str = "" + element['ranger.rest-csrf.enabled'];
                        csrfEnabled = (str.toLowerCase() == 'true');
                    }
                    if (element['ranger.rest-csrf.custom-header']) {
                        header = element['ranger.rest-csrf.custom-header'].trim();
                    }
                    if (element['ranger.rest-csrf.methods-to-ignore']) {
                        methods = getTrimmedStringArrayValue(element['ranger.rest-csrf.methods-to-ignore']);
                    }
                });

                // If enabled, set up all subsequent AJAX calls with a pre-send callback
                // that adds the custom headers if necessary.
                if (csrfEnabled) {
                    restCsrfCustomHeader = header;
                    restCsrfMethodsToIgnore = {};
                    methods.map(function(method) { restCsrfMethodsToIgnore[method] = true; });
                    $.ajaxSetup({
                        beforeSend: addRestCsrfCustomHeader
                    });
                }
            });
    };


    function preAjaxError() {
        $.ajaxSetup({
            complete: function (xhr, status) {
                console.log("ajax complete, status:%d, textStatus:%s", xhr.status, status);
                if (xhr.status === 419) {
                    window.location.replace("/signin.html");
                }
            }
        });
    }

    restCsrf();
    preAjaxError();
})();

