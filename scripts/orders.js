$(document).on("pageinit", "#OrderPage", function (event) {
    wireEventsOrderPage();
});
function wireEventsOrderPage() {
    $('#orderbtn').on('click', function () {
        WebServiceURL = "http://proj.ruppin.ac.il/cegroup11/prod/" + "OrderWS.asmx";
        $.support.cors = true;
        $.ajax({
            url:   WebServiceURL + "/InsertOrder",
            dataType: "json",
            type: "POST",
            data: "{'UserName':'" + $("#user").val() + "'," +
                    "'Phone':'" + $("#phone").val() + "'," +
                    "'date':'" + $("#date").val() + "'," +
                    "'shopname':'" + sessionStorage.name + "'," +
                    "'time':'" + $("#time").val() + "'}",
            contentType: "application/json; charset=utf-8",
            error: function (err) {
                alert("errornir: " + JSON.stringify(err));
            },
            success: function (data) {

               
                if (data.d == null) {
                    msg('<h2>your appointment in  ' + $("#date").val() + '  ' + $("#time").val() + '<br>has been confrimed  !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                    });


                }
                else {
                    str = "";
                    data.d.forEach(function (item) {
                       
                        str += "<br>" + item;
                    });
                    msg('<h2>sorry the current hour has been try another date or hour that isn\'t in this time  ' +str+ '!<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                    });
                }
            }
        });
    });

    function msg(_msg, _title, _okCB) {
        try {
            if (_title == null || _title == undefined || _title == '') {
                _title = 'Information';
            }
            if (_msg == null || _msg == undefined || _msg == '') {
                _msg = 'Error found. Please contact your administrator.';
            }
            // Create it in memory
            var dlg = $("<div id=\"dlgAlert\" class=\"ui-corner-all ui-shadow\" data-close-btn=\"right\" />")
                .attr("data-role", "dialog")
                .attr("id", "dialog");

            var header = $("<div />")
                .attr("data-role", "header")
                .attr("role", "banner")
                .html("<h2>" + _title + "</h2>");

            var content = $("<div style=\"padding: 15px;\" />")
                .attr("data-role", "content")
                .append($("<p />").html(_msg));

            content.append("<div ><a class='dlgalert' href='#index' data-rel='back'  data-role=\"button\"    data-theme=\"a\" >Close</a></div>");

            dlg.append(header).trigger('create');
            dlg.append(content).trigger('create');



            dlg.dialog({
                close: function (event, ui) {
                    _okCB();  //this line is not called
                }
            }).appendTo($.mobile.pageContainer);

            $.mobile.changePage(dlg, {
                transition: "pop",
                role: "dialog",
                reverse: false

            });



        } catch (e) {
            alert(e);
        }

    }

}
