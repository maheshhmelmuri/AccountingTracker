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
var buName;
var trackId;
var searchDisplay;
var searchType;
var tableLayout = "";
var invoiceTable = "";
var url = '/api';
// var Set = require("collections/set");
var shipmentIds = [];
// var invoiceIds =[];
var invoiceIdHash = {};
var syncInvoiceCount = 0;
var syncAccrualCount = 0;
var synAccrualInvoiceCount =0;
var invoiceIdFetchCount = 0;
//var ignoreDisplayTable = ['shipment_id'];
var ignoreDisplayTable = ['shipment_id','extra_details','invoice_id'];
var extraDetailsHtml = '';
var invoiceTable ='';
var accrualTable ='';

var buOptionMapping = '{"FKMP":\
                                {\
                                "order_id":"Order Id",\
                                "shipment_id":"Shipment Id"\
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

// if user passed the params direcly from url
$(document).ready(function (){
   console.log( location.search.substr(1).split('&') ) ;
    var queryParams = location.search.substr(1).split('&');
    if( queryParams.length == 3 ) //Specifically how many query params you are expecting
    {
        //set buName, trackId, and searchType from queryParams
        var trackId = queryParams[2].split("=")[1];
        var searchType = queryParams[1].split("=")[1];
        var buName = queryParams[0].split("=")[1];

        var malformed = false;

        //Set the UI elements' values
        switch( buName )
        {
            case "FKMP":
                $('#inpBuId').val("FKMP").change();
                switch( searchType )
                {
                    case "order_id":
                        $('#inpSearchType').val("order_id").change();
                        //do checks for the order id
                        if (trackId.startsWith("OD") && trackId.length == 20)
                            $('#inpTrackingId').val(trackId).change();
                        else
                            malformed = true;
                        break;
                    case "shipment_id":
                        $('#inpSearchType').val("shipment_id").change();
                        $('#inpTrackingId').val(trackId).change();
                        break;
                    default:
                        malformed = true;
                }
                break;
            case "EKL":
                $('#inpBuId').val("EKL").change();
                switch( searchType )
                {
                    case "merchant_ref_id":
                        $('#inpSearchType').val("merchant_ref_id").change();
                        break;
                    case "external_ref_id":
                        $('#inpSearchType').val("external_ref_id").change();
                        break;
                    default:
                        malformed = true;
                }
                break;
            default:
                malformed = true;
        }


        //Do any checks if needed

        // if(searchType == "order_id") {
        //     if (trackId.startsWith("OD") && trackId.length == 20)
        //         $('#inpTrackingId').val(trackId).change();
        //     else
        //         malformed = true;
        // }
        // else
        // {
        //     $('#inpTrackingId').val(trackId).change();
        // }


        //call fetchData()
        if( !malformed )
        {
            fetchData();
        }

        else {
            alert("Invalid query parameters!");
        }
    }
});


function fetchData()
{
    invoiceIdFetchCount = 0;
    if( buName !==  $('#inpBuId').val())
        buName = $('#inpBuId').val();
    if( trackId !== $('#inpTrackingId').val() )
        trackId = $('#inpTrackingId').val();
    if( searchType !== $('#inpSearchType').val() )
        searchType = $('#inpSearchType').val();

    //initializing the global variables in order to avoid appending the results
    shipmentIds = [];
    invoiceIdHash = {};

    // validation of the id
    if(searchType == "order_id")
    {
        try {
            if (!trackId.startsWith("OD") || trackId.length != 20) {
                throw("order id is not valid, please pass the valid id");
            }
        }
        catch (e)
        {
            alert(e);
            clearAllInputs();
            return;
        }
    }

    searchDisplay = $('#inpSearchDisplay input').val();
    console.log("the response data before cleanup :"+JSON.stringify(responseData));
    responseData = {};
    $('#divTableData').text("");
    $('#divPreLoader').css('display','inline-block');
    console.log("the response data now is :"+JSON.stringify(responseData));

    //fetch table header
    $.get('/headerDef',{BU:buName}).done(function(data) {
       console.log("the table header is found");
        responseData['TableHeader'] = data;
        console.log("final JSON :"+JSON.stringify(responseData));
        //Materialize.toast('Found Table Header!', 4000);

        //once table data found call the invoice api
        fetchInvoiceDetails();

        // generateTable();
        if( history.pushState )
        {
            var newURL = location.protocol + "//" + location.host + location.pathname + "?buName="+buName+"&searchType="+searchType+"&trackId="+trackId;
            history.pushState({path:newURL}, '', newURL);
            console.log("newURL"+newURL);
        }
        else {
            console.log("History pushState absent");
        }
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
    console.log("enteres invoice table");
    invoiceTable = '<div id="divInvoiceTable" style="padding-top:1%;padding-left: 1%;padding-right: 1%" class="row">\
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
           if ( $.inArray(key,ignoreDisplayTable) < 0 ) {
               invoiceTable += '<td>'+value+'</td>';
           }
       }); 
    });

    invoiceTable += '</tbody></table></div></div>';
    return invoiceTable;
}

function getAccrualTable(accrualArray,itemID,eventName) {
    console.log("accrual table entered");
    accrualTable = '<div id="divAccrualTable" style="padding-top:1%;padding-left: 1%;padding-right: 1%" class="row">\
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

    if(accrualArray != undefined) {
        $.each(accrualArray, function (index) {
            accrualTable += '</tr>';
            $.each(accrualArray[index], function (key, value) {
                if ($.inArray(key, ignoreDisplayTable) < 0) {
                    if (key == "Type") {
                        accrualTable += '<td class="typeColumn" id="AccrId--' + itemID + '_' + eventName + '_' + index + '" onclick="showExtraDetails(this)"><u>' + value + '</u></td>';

                    } else {
                        accrualTable += '<td>' + value + '</td>';
                    }
                }
            });
            extraDetailsHtml = '';
            accrualTable += addExtraDetails(accrualArray[index]["extra_details"], itemID, eventName, index);
        });
    }


        accrualTable += '</tbody></table></div></div>';
        console.log("accrual table: " + accrualTable);


    return accrualTable;

}

function addExtraDetails(extraDetails,itemID,eventName,rowId) {
    console.log("calling fro row ID: "+rowId);
    //var extraDetailTable = '<td>';
    var tempDetails = extraDetails;
    var padding = '<td></td>';
    var header = '';
    var val = '';
    var accHeadLen = responseData['TableHeader']['accrual'];
    var headerLength = accHeadLen.length;
    console.log("the headers length from response data is :"+ accHeadLen.length + "and extra detals is"+Object.keys(extraDetails).length );
    var diff = headerLength - Object.keys(extraDetails).length;
    var indexId= itemID+'_'+eventName+'_'+rowId;

    if ( diff >= 0 ) {
        $.each(tempDetails,function (key,value) {
            header +='<td>' +key+ '</td>';
            //val += '<td style="max-width:100px ;max-height: 100px;">' +value+ '</td>';
            val += '<td> \
                        <div style="height: 50px; overflow-y: auto">\
                            '+value+' \
                        </div>\
                    </td>'
        });

        for( var i=1 ; i<diff ; i++ ) {
            header +='<td></td>';
            val += '<td></td>';
        }
        extraDetailsHtml += '<tr class="extraDetail--'+indexId+'" style="font-weight:bold; display: none">' +padding+header+ ' </tr>\
            <tr class="extraDetail--'+indexId+'" style="display: none">' +padding+val+ '</tr>';
    } else {
        var count = 0;
        $.each(tempDetails,function (key,value) {
            if(++count <= headerLength - 1) {
                header +='<td>' +key+ '</td>';
                //val += '<td>' +value+ '</td>';
                //val += '<td style="max-width:100px ;max-height: 100px;">' +value+ '</div></td>';
                val += '<td> \
                            <div style="height: 50px; overflow-y: auto">\
                            '+value+' \
                            </div>\
                        </td>'
                delete tempDetails[key];
            }
        });
        extraDetailsHtml += '<tr class="extraDetail--'+indexId+'" style="font-weight:bold; display: none">' +padding+header+ ' </tr>\
            <tr class="extraDetail--'+indexId+'" style="display: none">' +padding+val+ '</tr>';
        // console.log("its in else tempdetails are: "+JSON.stringify(tempDetails));
        addExtraDetails(tempDetails,itemID,eventName,rowId);
    }

    return extraDetailsHtml;

}

function showExtraDetails(element) {

    var id = element.id.split('--')[1];
    console.log("id:"+id);
    var check = eval('$(".extraDetail--'+id+'").is(":visible")');
    var detRow = $('.extraDetail--'+id+'');
    check ? detRow.hide() : detRow.show();
}

function getEventLine(eventName) {
    return '<div>\
    <div class="sub-sub-heading">Event :'+eventName+'</div>\
    </div>';
}

function generateTable()  {

    if(Object.keys(invoiceIdHash).length == invoiceIdFetchCount) {

        console.log("Generate table entered");
        console.log("final output to show:"+JSON.stringify(responseData));
        //fillSUmmaryTable();
        var finalTable = "";
        finalTable = '<div class="top-heading" style="margin-bottom: 12px">Accounting details below</div>\
';
        $('#divTableData').append(finalTable);
        $.each(responseData, function(itemID,itemHash) {
            if(itemID != "summary_detail" && itemID != "TableHeader") {
                console.log("itemID:"+itemID);
                var finalTable = "";
                var summLine = "";
                var accordion = "";
                var finalAccordion = '<ul class="collapsible" data-collapsible="expandable">';
                var eventLevelTable = "";
                // var summLine = getSummaryLine(key,itemHash['invoice'][0]['shipment_id']);
                $.each(itemHash, function(eventName, data) {
                    // console.log("DEBUG - eventData: "+JSON.stringify(data));
                    //accordion creation
                    accordion = "";
                    accordion += '<li>\
                <div class="collapsible-header sub-sub-heading" style="color: white"> Event : '+eventName+'</div>';

                    var eventLine = getEventLine(eventName);
                    var invoice_table = '';
                    var accrual_table = '';


                    if(data['invoice'] != undefined)
                    {

                        //if(eventName.substring(0,8) == "shipment") {
                            //console.log("shipID:"+eventName.substring(0,8));
                        summLine = getSummaryLine(itemID, data['invoice'][0]['shipment_id']);
                        //}
                        invoice_table = getInvoiceTable(data['invoice']);
                    }

                    if(data['accrual'] != undefined)
                    {
                        accrual_table = getAccrualTable(data['accrual'],itemID,eventName);
                    }

                    // eventLevelTable += eventLine+invoice_table+accrual_table;
                    accordion += '<div class="collapsible-body">'+invoice_table+accrual_table+'</div>\
                    </li>';

                    finalAccordion += accordion;
                    // console.log(accordion);
                    $('.collapsible').collapsible();
                });
                finalAccordion += '</ul>';
                finalTable += summLine + finalAccordion;
                $('#divTableData').append(finalTable);
            }
        });

        $('.collapsible').collapsible();
        $('#divPreLoader').css('display','none');
        // console.log("responseData: "+ JSON.stringify(responseData));
    }

}

function fetchInvoiceDetails() {
    fetchRCN();

    fetchPDN();

    fetchPcnData();

    fetchRdnData();

    fetchSummaryTableData();

}

function fetchRevenueAccrual(searchId, searchType) {
    ++syncAccrualCount;
    console.log("calling Revenue Accrual");
    $.get('/racc',{id:searchId,type:searchType,BU:buName}).done(function (data) {
        //Materialize.toast('Revenue Accrual Details found!', 4000);
        //console.log(JSON.stringify(data));
        $.each(data,function(itemId, dataArray) {
            $.each(dataArray,function (eventName,eventData) {
                $.each(eventData,function (index) {
                    if(eventData[index]["invoice_id"] != null) {
                        if (invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId] == undefined) {
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId] = {};
                            console.log("item id is : " + itemId + " and eventName :" + eventName);
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] = itemId + "-" + eventName + "-" + index;
                        } else {
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] = invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] + "-" + index;
                        }
                    }
                });
            });
            //console.log("dataArray"+JSON.stringify(dataArray))
            updateResultData(itemId, dataArray);
        });

        --syncAccrualCount;
        if(syncAccrualCount == 0) {
        //     // generateTable();
            console.log("syncAccrualCount to zero, invoice hash is is: "+ JSON.stringify(invoiceIdHash));
            fetchAccrualInvoiceData("revenue_accrual_invoice");
        }
        // closeTable();
    }).fail(function(data) {
        console.log("failed while fetching RCN");
        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            console.log("syncAccrualCount to zero, invoice hash is is: "+ JSON.stringify(invoiceIdHash));
        //     // generateTable();
            fetchAccrualInvoiceData("revenue_accrual_invoice");
        }
    });
}

function fetchRevenueReversalAccrual(searchId, searchType) {
    ++syncAccrualCount;
    console.log("calling Revenue reverse Accrual");
    $.get('/rracc',{id:searchId,type:searchType,BU:buName}).done(function (data) {
        //Materialize.toast('Revenue Accrual Details found!', 4000);
        //console.log(JSON.stringify(data));
        $.each(data,function(itemId, dataArray) {
            $.each(dataArray,function (eventName,eventData) {
                $.each(eventData,function (index) {
                    if(eventData[index]["invoice_id"] != null) {
                        if (invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId] == undefined) {
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId] = {};
                            console.log("item id is : " + itemId + " and eventName :" + eventName);
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] = itemId + "-" + eventName + "-" + index;
                        } else {
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] = invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] + "-" + index;
                        }
                    }
                });
            });
            //console.log("dataArray"+JSON.stringify(dataArray))
            updateResultData(itemId, dataArray);
        });

        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            //     // generateTable();
            console.log("syncAccrualCount to zero, invoice hash is is: "+ JSON.stringify(invoiceIdHash));
            fetchAccrualInvoiceData("revenue_reversal_accrual_invoice");
        }
        // closeTable();
    }).fail(function(data) {
        console.log("failed while fetching reverse revenue");
        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            console.log("syncAccrualCount to zero, invoice hash is is: "+ JSON.stringify(invoiceIdHash));
            //     // generateTable();
            fetchAccrualInvoiceData("revenue_reversal_accrual_invoice");
        }
    });
}


function fetchCostAccrual(searchId, searchType) {
    ++syncAccrualCount;
    console.log("calling Cost Accrual");
    $.get('/cacc',{id:searchId,type:searchType,BU:buName}).done(function (data) {
        //Materialize.toast('Revenue Accrual Details found!', 4000);
        //console.log(JSON.stringify(data));
        $.each(data,function(itemId, dataArray) {
            $.each(dataArray,function (eventName,eventData) {
                $.each(eventData,function (index) {

                   if(eventData[index]["invoice_id"] != null ) {
                        if (invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId] == undefined) {
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId] = {};
                            console.log("item id is : " + itemId + " and eventName :" + eventName);
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] = itemId + "-" + eventName + "-" + index;
                        } else {
                            invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] = invoiceIdHash[eventData[index]["invoice_id"] + "#" + itemId]["indexes"] + "-" + index;
                        }
                    }

                });
            });
            //console.log("dataArray"+JSON.stringify(dataArray))
            updateResultData(itemId, dataArray);
        });

        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            //     // generateTable();
            console.log("syncAccrualCount to zero, invoice hash is is: "+ JSON.stringify(invoiceIdHash));
            fetchAccrualInvoiceData("cost_accrual_invoice");
        }
        // closeTable();
    }).fail(function(data) {
        console.log("failed while fetching cost");
        --syncAccrualCount;
        if(syncAccrualCount == 0) {
            console.log("syncAccrualCount to zero, invoice hash is is: "+ JSON.stringify(invoiceIdHash));
            //     // generateTable();
            fetchAccrualInvoiceData("cost_accrual_invoice");
        }
    });
}

function updateResultData(itemId, eventData) {
    if ( responseData[itemId] == undefined ) {
        responseData[itemId] = {};
    }
    $.each(eventData,function(eventName, eventArray) {
        if( responseData[itemId][eventName] == undefined ) {
            responseData[itemId][eventName] = {};
        }
        $.each( eventArray, function(index) {
            if ( eventArray[index]["Type"] == "payable_debit_note" || eventArray[index]["Type"] == "receivable_credit_note" || eventArray[index]["Type"] == "receivable_debit_note" || eventArray[index]["Type"] == "payable_credit_note" ) {
                if ( $.inArray(eventArray[index]["shipment_id"],shipmentIds ) < 0 ) {
                    shipmentIds.push(eventArray[index]["shipment_id"]); //these Id's will be used to fetch Accruals
                }
                if ( responseData[itemId][eventName]["invoice"] == undefined ) {
                    responseData[itemId][eventName]["invoice"] = [];
                    responseData[itemId][eventName]["invoice"].push(eventArray[index]);
                    // console.log("res:"+responseData);
                } else {
                    responseData[itemId][eventName]["invoice"].push(eventArray[index]);
                }
            } else if ( eventArray[index]["Type"] == "revenue_accrual" || eventArray[index]["Type"] == "cost_accrual" || eventArray[index]["Type"] == "revenue_reversal_accrual" || eventArray[index]["Type"] == "cost_reversal_accrual") {
                if ( responseData[itemId][eventName]["accrual"] == undefined ) {
                    responseData[itemId][eventName]["accrual"] = [];
                    responseData[itemId][eventName]["accrual"].push(eventArray[index]);
                } else {
                    responseData[itemId][eventName]["accrual"].push(eventArray[index]);
                }
            }
        });
    });
    // fetchAccrualInvoiceData();
    // console.log("in updating : "+ JSON.stringify(responseData));
}

function fetchRCN() {
    ++syncInvoiceCount;
    console.log("calling RCN");
    $.get('/rcn',{id:trackId,type:searchType,BU:buName}).done(function (data) {
        //Materialize.toast('RCN Details found!', 4000);
        // responseData['invoice']['receivable_credit_note'] = data['receivable_credit_note'];
        // fillInvoiceRow(responseData['invoice']['receivable_credit_note']);
        // console.log(JSON.stringify(data));
        $.each(data,function(itemId, eventData) {
           updateResultData(itemId, eventData);
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
    $.get('/rdn', {id: trackId, type: searchType, BU: buName}).done(function (data) {
        //Materialize.toast('RDN Details found!', 4000);
        // responseData['invoice']['receivable_debit_note'] = data['receivable_debit_note'];
        $.each(data,function(itemId, eventData) {
            updateResultData(itemId, eventData);
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
    $.get('/pcn',{id:trackId,type:searchType,BU:buName}).done(function (data) {
        //Materialize.toast('PCN Details found!', 4000);
        $.each(data,function(itemId, eventData) {
            updateResultData(itemId, eventData);
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
    $.get('/pdn',{id:trackId,type:searchType,BU:buName}).done(function (data) {
        //Materialize.toast('PDN Details found!', 4000);
        // responseData['invoice']['payable_debit_note'] = data['payable_debit_note'];
        // fillInvoiceRow(responseData['invoice']['payable_debit_note']);
        // closeTable();
        $.each(data, function(itemId,eventData) {
           updateResultData(itemId,eventData);
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

function fetchSummaryTableData() {

    $.get('/summaryTable',{id:trackId,type:searchType,BU:buName}).done(function (data) {
        //Materialize.toast('Summary Details found!', 4000);
        responseData["summary_detail"] = data;
        var summaryHead = $('#divSummaryHead');
        summaryHead.text("Summary of "+searchDisplay+": "+trackId);
        summaryHead.show();
        fillSummaryTableData(); //should move this to other function
        $('#divOrderSummary').show();

    }).fail(function(data) {
        console.log("failed while fetching summary Details");
    });
}

//clears the data if it does not found any data
function clearAllInputs() {

    $('#inpBuId').val(" ").change();
    $('#inpTrackingId').val(" ").change;
    $('#inpSearchType').val(" ").change;
    $('#divPreLoader').css('display','none');
    $('#divSummaryHead').hide();
    $('#divOrderSummary').hide();
    $('#divTableData').hide();

    if( history.pushState )
    {
        var newURL = location.protocol + "//" + location.host + location.pathname
        history.pushState({path:newURL}, '', newURL);
        console.log("newURL"+newURL);
    }
    else {
        console.log("History pushState absent");
    }
}

//TODO
function fetchAccrualData() {
    console.log("shipment: "+JSON.stringify(shipmentIds));
    invoiceIdHash = {};
    try {
        if (shipmentIds.length == 0) {
            throw("No data found for this id");
        }
    }
    catch (e)
    {
        alert("No data found for given id, seems it would have archived");
        clearAllInputs();
        return;
    }

    $.each(shipmentIds, function (index) {
        //do the accrual calls
        fetchRevenueAccrual(shipmentIds[index], "shipment_id");
        fetchRevenueReversalAccrual(shipmentIds[index], "shipment_id");
        fetchCostAccrual(shipmentIds[index], "shipment_id");

    });

}

function fetchAccrualInvoiceData(accrualType)
{
    console.log("this is called");
    console.log("the invoice hash is: "+JSON.stringify(invoiceIdHash));
    var keyArray = Object.keys(invoiceIdHash);
    $.each( keyArray , function (index) {
        fetchAccrualInvoice(keyArray[index],"invoice_id",accrualType);
        });

}

function fetchAccrualInvoice(invoiceId, searchType, accrualType)
     {
        // ++synAccrualInvoiceCount;
        console.log("calling Revenue invoice : "+ accrualType);
        $.get('/accIn',{id:invoiceId.split('#')[0],type:searchType,BU:buName,accrualType:accrualType}).done(function (data) {
            ++invoiceIdFetchCount;
            //Materialize.toast('Revenue invoice Details found!', 4000);
            console.log("da:"+JSON.stringify(data));
            // $.extend(invoiceIdHash[invoiceId],data);
            // $.each(invoiceIdHash,)
            var splitArray = invoiceIdHash[invoiceId]["indexes"].split('-');
            for( var i = 2; i< splitArray.length; i++ ) {
                responseData[splitArray[0]][splitArray[1]]["accrual"][splitArray[i]]["Due Date"] = data["Due Date"];
                responseData[splitArray[0]][splitArray[1]]["accrual"][splitArray[i]]["Settled Date"] = data["Settled Date"];
            }
                generateTable();

        }).fail(function(data) {
            console.log("failed while Revenue invoice for : "+ invoiceId);
        });

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

    var summTable = $('#summaryTable');
    $.each(responseData["summary_detail"],function (rowKey,rowValue) {
        $('#'+rowKey).html(rowValue);
        console.log("value of row:" + rowValue);

    });
    //console.log("summary detail while filling :"+ JSON.stringify(summaryDetail));
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
    $('.collapsible').collapsible();
});


