/**
 * Created by mahesh.melmuri on 17/10/16.
 */

//shipping details

var shippingDetails = [];

// $(document).ready(function () {
//     fetchData();
//
// });
var url = '/api';

function fetchData(trackingId)
{
    var trackId=$('#inpTrackingId').val();
    var searchType = $('#inpSearchType').val();
    searchType = searchType.replace("_"," ");
    console.log(trackId);
    $.get(url,{id:trackId}).done(function (data) {
        console.log(data);
        //var res = document.getElementById('jres');

        $('#jres').html(data);
        // window.location.href = "/testSome";
        $('#divSummaryHead').text("Summary of "+searchType+": "+trackId);
        $('#divSummaryHead').show();
        // res.value=data;
        // res.trackId = trackId;
    })
}

$(document).ready(function() {
    $('select').material_select();
});


