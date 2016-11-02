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
var trackId;
var searchDisplay;
var searchType;


var url = '/api';

var buOptionMapping = '{"FKMP":\
                                {\
                                "order_id":"Order Id",\
                                "merchant_ref_id":"Merchant Ref Id"\
                                },\
                         "EKL":\
                                {\
                                "merchant_ref_id":"Merchant Ref Id",\
                                "vendor_tracking_id":"Vendor Tracking Id"\
                                }\
                       }';

function changeSearchBy(bu_select) {
    $('#inpSearchType').html("");
    console.log("selected val is :"+bu_select.val);
    var optionList = JSON.parse(buOptionMapping)[$('#inpBuId').val()];
    if(optionList != undefined){
        var optionHtml = '<option value="" disabled selected>Choose your option</option>';
        $.each(optionList,function(param,displayname) {
            optionHtml += '<option value="'+param+'">'+displayname+'</option>';
        });
        $('#inpSearchType').append(optionHtml);
    }
    $('select').material_select();
}

function fetchData(trackingId)
{
    trackId=$('#inpTrackingId').val();
    searchType = $('#inpSearchType').val();
    searchDisplay = $('#inpSearchDisplay input').val();
    var summaryHead = $('#divSummaryHead');
    // searchType = searchType.split('_').join(' ');
    BuName = $('#inpBuId').val();
    console.log(trackId);
    // var pdnData = fetchPdnData();
    // console.log("after pdn");
    // console.log("pdn data :"+pdnData);
    // readResponse(pdnData); // should add
    // var rcnData = fetchRcnData();
    // console.log("after rcn");
    // console.log("rcn data :"+rcnData);
    readResponse();
    $.get(url,{id:trackId, BU:BuName, type:searchType}).done(function (data) {
            console.log("fetched invoice data 1st :"+data);
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




}

/*function fetchRcnData() {
    $.get('/rcn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        console.log("fetched rcn data");
        console.log(data);
        return data;
    }).fail(function(data) {
        console.log("failed while fetching PDN");
    });
}
function fetchPdnData() {
    $.get('/pdn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        console.log("fetched pdn data");
        console.log(data);
        return data;
    }).fail(function(data) {
        console.log("failed while fetching PDN");
    });
}*/
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

function readResponse(response) {
    var sampleResponse = '{"summary_detail":{\
    "search_id": "596348467570",\
        "service_type": "FA",\
        "payment_type": "Prepaid",\
        "seller_id": "abcdef"\
}}';
    $.extend(responseData,JSON.parse(sampleResponse));
    // responseData = $.extend(response,responseData);

    console.log(responseData);
}

$(document).ready(function() {
    $('select').material_select();
});


