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
    var trackId=$('#inputTrackingId').val();
    console.log(trackId);
    $.get(url,{id:trackId}).done(function (data) {
        console.log(data);
        //var res = document.getElementById('jres');

        $('#jres').html(data);
        // res.value=data;
    })
}

