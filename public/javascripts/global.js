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
var url = '/api';
// var Set = require("collections/set");
var shipmentIds = [];
var syncInvoiceCount = 0;
var syncAccrualCount = 0;

var ignoreDisplayTable = ['shipment_id'];

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
    responseData = {};
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
        // createInvoiceHeader();
        //once table data found call the invoice api
        fetchInvoiceDetails();
        // generateTable();
    }).fail(function (data) {
        console.log("failed while fetching header data");
    });
    

}

function getSummaryLine(ItemId, shipmentId) {
    return '<div>\
    <div class="sub-heading">Item ID :'+ItemId+' Shipment ID :'+shipmentId+'</div>\
    </div>';
}

function getInvoiceTable(invoiceArray) {
    var invoiceTable = '<div id="divOrderSummary" style="padding-top:1%;padding-left:1%;" class="row">\
        <div class="col s12">\
        <table id="invoiceTable"> \
        <thead>\
        <tr>\
        <b>Invoices</b>';


    var invoiceHead = responseData['TableHeader']['invoice'];
    
    $.each(invoiceHead, function(index) {
        invoiceTable += '<th>'+invoiceHead[index]+'</th>'
    });
    
    invoiceTable += '</tr>\
    <tbody>';


    $.each(invoiceArray, function(index) {
        invoiceTable += '</tr>';
       $.each(invoiceArray[index], function(key,value) {
           console.log("ignoretable ius type of :"+ JSON.stringify(ignoreDisplayTable));
           if ( $.inArray(key,ignoreDisplayTable) < 0 ) {
               console.log("the key to use: "+key+ " the value of in array is: "+$.inArray(ignoreDisplayTable,key));
               invoiceTable += '<td>'+value+'</td>';
           }
       }); 
    });

    invoiceTable += '</tbody></table>';
    return invoiceTable;
}

function getAccrualTable(accrualArray) {
    var accrualTable = '<div id="divOrderSummary" style="padding-top:1%;padding-left:1%;" class="row">\
    <div class="col s12">\
    <table id="accrualTable">\
    <thead>\
    <tr>\
    <b>Accruals</b>';

    var accrualHead = responseData['TableHeader']['accrual'];
    $.each(accrualHead,function (index) {
        accrualTable +='<th>'+accrualHead[index]+'</th>';
    });

    accrualTable +='</tr>\
    <tbody>';

    $.each(accrualArray, function(index) {
        accrualTable += '</tr>';
        $.each(accrualArray[index], function(key,value) {
            accrualTable += '<td>'+value+'</td>';
        });
    });

    accrualTable += '</tbody></table>';
    return accrualTable;

}

function generateTable()  {
    console.log("shipment: "+JSON.stringify(shipmentIds));
    fillSUmmaryTable();
    var finalTable = '';
    finalTable = '<div class="top-heading" style="margin-bottom: 12px">Accounting details below</div>\
';
    $('#divTableData').append(finalTable);
    $.each(responseData, function(key, data) {
       if( key != "summary_detail" && key != "TableHeader") {
           console.log("key is: "+ key);
           console.log("the data in it is: "+JSON.stringify(data));
           var summLine = getSummaryLine(key,data['invoice'][0]['shipment_id']);
           var invoice_table = getInvoiceTable(data['invoice']);
           var accrual_table = getAccrualTable(data['accrual']);
           var finalTable = summLine+invoice_table+accrual_table;
           console.log(finalTable);
           $('#divTableData').append(finalTable);
       }
    });

    console.log("responseData: "+ JSON.stringify(responseData));
    // if(responseData['invoice']['receivable_credit_note'] != null || responseData['invoice']['receivable_credit_note'] != undefined) {
    //     fillInvoiceRow(responseData['invoice']['receivable_credit_note']);
    // }
    //
    // if(responseData['invoice']['payable_debit_note'] != null || responseData['invoice']['payable_debit_note'] != undefined) {
    //     fillInvoiceRow(responseData['invoice']['payable_debit_note']);
    // }
    //
    // if(responseData['invoice']['receivable_debit_note'] != null || responseData['invoice']['receivable_debit_note'] != undefined) {
    //     fillInvoiceRow(responseData['invoice']['receivable_debit_note']);
    // }
    //
    // if(responseData['invoice']['payable_credit_note'] != null || responseData['invoice']['payable_credit_note'] != undefined) {
    //     fillInvoiceRow(responseData['invoice']['payable_credit_note']);
    // }
    //
    //     closeTable();

}

function fillSUmmaryTable() {
    var summaryHead = $('#divSummaryHead');
    summaryHead.text("Summary of "+searchDisplay+": "+trackId);
    summaryHead.show();
    fillSummaryTableData(); //should move this to other function
    $('#divOrderSummary').show();
}

function fetchInvoiceDetails() {
    fetchRCN();

    fetchPDN();

    fetchPcnData();

    fetchRdnData();

}

function fetchRevenueAccrual(searchId, searchType) {
    ++syncAccrualCount;
    console.log("calling Revenue Accrual");
    $.get('/racc',{id:searchId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('Revenue Accrual Details found!', 4000);
        console.log(JSON.stringify(data));
        $.each(data,function(itemId, dataArray) {
            updateResultData(itemId, dataArray);
        });

        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            generateTable();
            console.log("accrual to zer, data is: "+ JSON.stringify(responseData));
        }
        // closeTable();
    }).fail(function(data) {
        console.log("failed while fetching RCN");
        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            console.log("accrual to zer, data is: "+ JSON.stringify(responseData));
            generateTable();
        }
    });
}

function fetchCostAccrual(searchId, searchType) {
    ++syncAccrualCount;
    console.log("calling Cost Acrual");
    $.get('/cacc',{id:searchId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('Cost Accrual Details found!', 4000);
        // responseData['invoice']['receivable_credit_note'] = data['receivable_credit_note'];
        // fillInvoiceRow(responseData['invoice']['receivable_credit_note']);
        console.log(JSON.stringify(data));
        $.each(data,function(itemId, dataArray) {
            updateResultData(itemId, dataArray);
        });

        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            generateTable();
            console.log("accrual to zer, data is: "+ JSON.stringify(responseData));
        }
        // closeTable();
    }).fail(function(data) {
        console.log("failed while fetching RCN");
        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            console.log("accrual to zer, data is: "+ JSON.stringify(responseData));
            generateTable();
        }
    });
}

function updateResultData(itemId, dataArray) {
    if ( responseData[itemId] == undefined ) {
        responseData[itemId] = {};
    }
    $.each(dataArray, function(index) {
       if ( dataArray[index]["Type"] == "payable_debit_note" || dataArray[index]["Type"] == "receivable_credit_note" || dataArray[index]["Type"] == "receivable_debit_note" || dataArray[index]["Type"] == "payable_credit_note" ) {
          if ( $.inArray(dataArray[index]["shipment_id"],shipmentIds ) < 0 ) {
               shipmentIds.push(dataArray[index]["shipment_id"]); //these Id's will be used to fetch Accruals
          }
          if ( responseData[itemId]["invoice"] == undefined ) {
              responseData[itemId]["invoice"] = [];
              responseData[itemId]["invoice"].push(dataArray[index]);
              console.log("res:"+responseData);
          } else {
              responseData[itemId]["invoice"].push(dataArray[index]);
          }
       } else if ( dataArray[index]["Type"] == "revenue_accrual" || dataArray[index]["Type"] == "cost_accrual") {
           if ( responseData[itemId]["accrual"] == undefined ) {
               responseData[itemId]["accrual"] = [];
               responseData[itemId]["accrual"].push(dataArray[index]);
           } else {
               responseData[itemId]["accrual"].push(dataArray[index]);
           }
       }
    });
}

function fetchRCN() {
    ++syncInvoiceCount;
    console.log("calling RCN");
    $.get('/rcn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('RCN Details found!', 4000);
        // responseData['invoice']['receivable_credit_note'] = data['receivable_credit_note'];
        // fillInvoiceRow(responseData['invoice']['receivable_credit_note']);
        console.log(JSON.stringify(data));
        $.each(data,function(itemId, dataArray) {
           updateResultData(itemId, dataArray);
        });

        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
        // closeTable();
    }).fail(function(data) {
        console.log("failed while fetching RCN");
        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
    });
}


function fetchRdnData() {
    ++syncInvoiceCount;
    $.get('/rdn', {id: trackId, type: searchType, BU: BuName}).done(function (data) {
        Materialize.toast('RDN Details found!', 4000);
        // responseData['invoice']['receivable_debit_note'] = data['receivable_debit_note'];
        $.each(data,function(itemId, dataArray) {
            updateResultData(itemId, dataArray);
        });
        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
    }).fail(function (data) {
        console.log("failed while fetching rdn");
        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
    });
}

function fetchPcnData() {
    ++syncInvoiceCount;
    $.get('/pcn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('PCN Details found!', 4000);
        // responseData['invoice']['payable_credit_note'] = data['payable_credit_note'];
        $.each(data,function(itemId, dataArray) {
            updateResultData(itemId, dataArray);
        });
        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
    }).fail(function(data) {
        console.log("failed while fetching PCN");
        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
    });
}

function fetchPDN() {
    ++syncInvoiceCount;
    $.get('/pdn',{id:trackId,type:searchType,BU:BuName}).done(function (data) {
        Materialize.toast('PDN Details found!', 4000);
        // responseData['invoice']['payable_debit_note'] = data['payable_debit_note'];
        // fillInvoiceRow(responseData['invoice']['payable_debit_note']);
        // closeTable();
        $.each(data, function(itemId,dataArray) {
           updateResultData(itemId,dataArray);
        });
        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
    }).fail(function(data) {
        console.log("failed while fetching PDN");
        --syncInvoiceCount;
        if(syncInvoiceCount == 0) {
            fetchAccrualData();
        }
    });
}

//TODO
function fetchAccrualData() {
    console.log("shipment: "+JSON.stringify(shipmentIds));
    $.each(shipmentIds,function(index) {
       //do the accrual calls
        fetchRevenueAccrual(shipmentIds[index],"merchant_ref_id");
        fetchCostAccrual(shipmentIds[index],"merchant_ref_id");
    });
}


/*function closeTable() {
    invoiceTable += '</table>';
    $('#divInvoiceTable').append(invoiceTable);
    $('#divInvoiceHead').show();
    $('#divInvoiceData').show();
    console.log("invoice table:"+invoiceTable);
}*/


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
    summaryDetail = responseData['summary_detail'];
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


