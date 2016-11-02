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
var tableLayout = "";
var invoiceTable = "";
responseData['invoice'] = {};
responseData['accrual'] = {};
var url = '/api';

var syncCount = 0;

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
    // searchType = searchType.split('_').join(' ');
    BuName = $('#inpBuId').val();
    console.log(trackId);
    readResponse();
    //fetch table header
    $.get('/headerDef',{BU:BuName}).done(function(data) {
       console.log("the table header is found");
        // $.extend(responseData,data);
        responseData['TableHeader'] = data;
        console.log("final JSON :"+JSON.stringify(responseData));
        Materialize.toast('Found Table Header!', 4000);
        createInvoiceHeader();
        //once table data found call the invoice api
        fetchInvoiceDetails();
        // fillInvoiceTableData();
    }).fail(function (data) {
        console.log("failed while fetching header data");
    });
    
    
    /*$.get(url,{id:trackId, BU:BuName, type:searchType}).done(function (data) {
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
        });*/
}

function fillInvoiceTableData()  {
    console.log("in fill invoice table: ");
    // if(syncCount > 0) {
    //     console.log("count is: "+syncCount);
    //     // sleepFor(5000);
    //     // console.log("sleeping for 5 sec");
    //     fillInvoiceTableData();
    // } else {
    console.log("responseData: "+ JSON.stringify(responseData));
        if(responseData['invoice']['receivable_credit_note'] != null || responseData['invoice']['receivable_credit_note'] != undefined) {
            fillInvoiceRow(responseData['invoice']['receivable_credit_note']);
        }

        if(responseData['invoice']['payable_debit_note'] != null || responseData['invoice']['payable_debit_note'] != undefined) {
            fillInvoiceRow(responseData['invoice']['payable_debit_note']);
        }

    if(responseData['invoice']['receivable_debit_note'] != null || responseData['invoice']['receivable_debit_note'] != undefined) {
        fillInvoiceRow(responseData['invoice']['receivable_debit_note']);
    }

    if(responseData['invoice']['payable_credit_note'] != null || responseData['invoice']['payable_credit_note'] != undefined) {
        fillInvoiceRow(responseData['invoice']['payable_credit_note']);
    }

        closeTable();
    // }
}

function fillSUmmaryTable() {
    var summaryHead = $('#divSummaryHead');
    /*$.get(url,{id:trackId, BU:BuName, type:searchType}).done(function (data) {
            console.log("fetched invoice data 1st :"+data);
            console.log(data);
            $('#payload').html(JSON.stringify(data));
            $('#jres').html(data);
            fillSummaryTableData(); //should move this to other function
            summaryHead.text("Summary of "+searchDisplay+": "+trackId);
            summaryHead.show();
            $('#divOrderSummary').show();
            fillInvoiceDetails();
        })
        .fail(function(data) {
            $('#divOrderSummary').hide();
            summaryHead.text("No data Found");
            summaryHead.show();
            $('#payload').html("");
        });*/

    fetchInvoiceDetails();
   
}

function fetchInvoiceDetails() {
    fetchRCN();

    fetchPDN();

    fetchPcnData();

    fetchRdnData();
    // callback();

}

function fetchRCN() {
    ++syncCount;
    console.log("calling RCN");
    $.get('/rcn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('RCN Details found!', 4000);
        responseData['invoice']['receivable_credit_note'] = data['receivable_credit_note'];
        // fillInvoiceRow(responseData['invoice']['receivable_credit_note']);
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
        // closeTable();
    }).fail(function(data) {
        console.log("failed while fetching RCN");
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
    });
}
function fetchRdnData() {
    ++syncCount;
    $.get('/rdn', {id: trackId, type: searchType, BU: BuName}).done(function (data) {
        Materialize.toast('RDN Details found!', 4000);
        responseData['invoice']['receivable_debit_note'] = data['receivable_debit_note'];
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
    }).fail(function (data) {
        console.log("failed while fetching rdn");
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
    });
}

function fetchPcnData() {
    ++syncCount;
    $.get('/pcn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('PCN Details found!', 4000);
        responseData['invoice']['payable_credit_note'] = data['payable_credit_note'];
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
    }).fail(function(data) {
        console.log("failed while fetching PCN");
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
    });
}

function fetchPDN() {
    ++syncCount;
    $.get('/pdn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('PDN Details found!', 4000);
        responseData['invoice']['payable_debit_note'] = data['payable_debit_note'];
        // fillInvoiceRow(responseData['invoice']['payable_debit_note']);
        // closeTable();
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
    }).fail(function(data) {
        console.log("failed while fetching PDN");
        --syncCount;
        if(syncCount == 0) {
            fillInvoiceTableData();
        }
    });
}

function closeTable() {
    invoiceTable += '</table>';
    $('#divInvoiceTable').append(invoiceTable);
    $('#divInvoiceHead').show();
    $('#divInvoiceData').show();
    console.log("invoce table:"+invoiceTable);
}


function fillInvoiceRow(res) {
    console.log(JSON.stringify(res));
    $.each(res, function(rows) {
       invoiceTable += '<tr>';
       $.each(res[rows],function(rowHead,rowVal) {
           invoiceTable += '<td>'+rowVal+'</td>';
       }) ;
       invoiceTable += '</tr>';
    });
}

function createInvoiceHeader() {
    invoiceTable = '<table class="highlight"><thead><tr>';
    var header = responseData['TableHeader']['invoice'];
    $.each(header,function (index) {
        invoiceTable += '<th>'+header[index]+'</th>';
    });
    invoiceTable += '</tr></thead>';

    invoiceTable += '<tboby>';
    // $.each(responseData[])
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


