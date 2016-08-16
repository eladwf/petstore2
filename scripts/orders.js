$(document).on("pageinit", "#OrderPage", function (event) {
    wireEventsOrderPage();
});
function wireEventsOrderPage() {
    $('#orderbtn').on('click', function () {
        WebServiceURL = "OrderWS.asmx";
        $.support.cors = true;
        $.ajax({
            url: WebServiceURL + "/InsertOrder",
            dataType: "json",
            type: "POST",
            data: "{'UserName':'" + $("#user").val() + "'," +
                    "'Phone':'" + $("#phone").val() + "'," +
                    "'date':'" + $("#date").val() + "'," +
                    "'time':'" + $("#time").val() + "'}",
            contentType: "application/json; charset=utf-8",
            error: function (err) {
                alert("errornir: " + JSON.stringify(err));
            },
            success: function (data) {
                if (data["d"] == 1) {
                    msg('<h2>your appointment in' + $("#date").val() + '  ' + $("#time").val() + 'has been confrimed  !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                    });


                }
                else {
                    msg('<h2>your appointment in' + $("#date").val() + '  ' + $("#time").val() + 'hasn\'t been confrimed  !<h2></br><p>see  you in our store ;)!</p>', 'info', function () {

                    });
                }
            }
        });
    });



}
