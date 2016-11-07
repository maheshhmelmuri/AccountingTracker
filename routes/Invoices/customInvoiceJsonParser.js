/**
 * Created by mahesh.melmuri on 27/10/16.
 */
module.exports =
{
    customInvJParser: function customInvoiceJsonParser(rawJson) {
        var jsonReader = JSON.parse(rawJson);
        //console.log("rawjson"+rawJson);
        var jsonOutput = {};
        var jsonDataOrderItemEvent = {};
        if( jsonReader.invoices != null || jsonReader.invoices != undefined ) {
            for (var i = 0; i < jsonReader.invoices.length; i++) {
                jsonOutput = {};
                var event = jsonReader.invoices[i].comments.toString().split(":")[1].trim();
                if(jsonDataOrderItemEvent[jsonReader.invoices[i].invoice_ref_3]  == undefined)
                {
                    jsonDataOrderItemEvent[jsonReader.invoices[i].invoice_ref_3] = {};

                }
                if(jsonDataOrderItemEvent[jsonReader.invoices[i].invoice_ref_3][event]  == undefined)
                {
                    jsonDataOrderItemEvent[jsonReader.invoices[i].invoice_ref_3][event] = [];

                }

                jsonOutput["Type"] = jsonReader.invoices[i].type;
                jsonOutput["SubType"] = jsonReader.invoices[i].invoice_ref_4;
                jsonOutput["Amount"] = jsonReader.invoices[i].total_amount;
                jsonOutput["Created date"] = dateFormatter(jsonReader.invoices[i].created_at);
                jsonOutput["Updated date"] = dateFormatter(jsonReader.invoices[i].updated_at);
                jsonOutput["Due date"] = dateFormatter(jsonReader.invoices[i].due_date);
                jsonOutput["Status"] = jsonReader.invoices[i].status;
                jsonOutput["Setteled Date"] = dateFormatter(jsonReader.invoices[i].invoice_ref_date_3);
                jsonOutput["shipment_id"] = jsonReader.invoices[i].external_ref_id;
                jsonDataOrderItemEvent[jsonReader.invoices[i].invoice_ref_3][event].push(jsonOutput);
            }
        }
        return jsonDataOrderItemEvent;

    }

};
function dateFormatter(inputDate) {
    return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();
}