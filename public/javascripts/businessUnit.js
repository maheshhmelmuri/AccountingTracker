/**
 * Created by niyazulla.khan on 26/10/16.
 */

function fecthBusinessUnit() {
    var buUrl = "/buList";
    // var buUrl = "10.85.52.146:80/business_unit/";
    $.get(buUrl)
        .done(function(data) {
           console.log("fetching bu list successful");
        })
        .fail(function(data){console.log("failed to fetch BU");})
    ;
}