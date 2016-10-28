/**
 * Created by mahesh.melmuri on 17/10/16.
 */
///<reference path="angular.min.js" />
//shipping details
/*jshint globalstrict: true, bitwise: false */
/*global require: true, exports: true */
'use strict';
var shippingDetails = [];
var responseData = {};
var BuName;

var url = '/api';


function fetchData(trackingId)
{
    var trackId=$('#inpTrackingId').val();
    var searchType = $('#inpSearchType').val();
    var searchDisplay = $('#inpSearchDispay input').val();
    var summaryHead = $('#divSummaryHead');
    // searchType = searchType.split('_').join(' ');
    BuName = $('#inpBuId').val();
    console.log(trackId);
    readResponse(); //check with removing later
    $.get(url,{id:trackId, BU:BuName, type:searchType}).done(function (data) {
        console.log(data);
        $('#payload').html(JSON.stringify(data));
        $('#jres').html(data);
        fillSummaryTableData(); //check with removing later
        summaryHead.text("Summary of "+searchDisplay+": "+trackId);
        summaryHead.show();
        $('#divOrderSummary').show();
    })
        .fail(function(data) {
            $('#divOrderSummary').hide();
            summaryHead.text("No data Found");
            summaryHead.show();
            $('#payload').html("");
        });

    // $.get('/pdn',{id:trackId}).done(function (data) {
    //     console.log(data);
    // })
    //
    // $.get('/rcn',{id:trackId}).done(function (data) {
    //     console.log(data);
    // })
    //
    // $.get('/rdn',{id:trackId}).done(function (data) {
    //     console.log(data);
    // })
    //
    // $.get('/pcn',{id:trackId}).done(function (data) {
    //     console.log(data);
    // })

    // $.get('/racc',{id:trackId}).done(function (data) {
    //     console.log(data);
    // });

    // $.get('/cacc',{id:trackId}).done(function (data) {
    //     console.log(data);
    //
    // })
}



function fillSummaryTableData() {
    var summaryDetail = {};
    summaryDetail = responseData.summary_detail;
    var summTable = $('#summaryTable');
    $.each(summaryDetail,function (rowKey,rowValue) {
        $('#'+rowKey).html(rowValue);
        console.log("value of row:" + rowValue);

    });
    console.log("summary detail while filling :"+ JSON.stringify(summaryDetail));
}

function readResponse() {
    var sampleResponse = '{"summary_detail":{\
    "search_id": "596348467570",\
        "service_type": "FA",\
        "payment_type": "Prepaid",\
        "seller_id": "abcdef"\
}}';
    responseData = JSON.parse(sampleResponse);
    console.log(responseData);
}

$(document).ready(function() {
    $('select').material_select();
});


