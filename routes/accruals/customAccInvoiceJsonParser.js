/**
 * Created by mahesh.melmuri on 08/11/16.
 */
var Set = require("collections/set");

module.exports =
{
    customAccInvoiceJParser: function customAccInvoiceJParser(rawJson) {
        var jsonReader = JSON.parse(rawJson);
        var invoiceIds = new Set();
        var jsonFinalOutput = {};
        if(jsonReader.accruals != null || jsonReader.accruals != undefined ) {
            for(var i=0;i<jsonReader.accruals.length;i++)
            {
                console.log("invoice_id:"+jsonReader.accruals[i].invoice_id);
                invoiceIds.add(jsonReader.accruals[i].invoice_id);

            }
        }
        return invoiceIds;

    }
};