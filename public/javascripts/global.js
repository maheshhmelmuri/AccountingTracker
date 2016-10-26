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
// var angular = require('./angular.min');
// $(document).ready(function () {
//     fetchData();
//
// });

var url = '/api';

// angular.module('AccountingDetail')
//     .controller('summaryLine',function ($global) {
//         $global.search_type = "";
//         $global.search_id = "";
//     });



function fetchData(trackingId)
{
    var trackId=$('#inpTrackingId').val();
    var searchType = $('#inpSearchType').val();
    searchType = searchType.split('_').join(' ');
    console.log(trackId);
    readResponse(); //check with removing later
    $.get(url,{id:trackId}).done(function (data) {
        console.log(data);
        $('#jres').html(data);
        fillSummaryTableData(); //check with removing later
        var summaryHead = $('#divSummaryHead');
        summaryHead.text("Summary of "+searchType+": "+trackId);
        summaryHead.show();
        $('#divOrderSummary').show();
    })
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


