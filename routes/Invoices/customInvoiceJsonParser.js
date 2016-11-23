/**
 * Created by mahesh.melmuri on 27/10/16.
 */
module.exports =
{
    customInvJParser: function customInvoiceJsonParser(rawJson,bu) {
        var jsonReader = JSON.parse(rawJson);
        //console.log("rawjson"+rawJson);
        var jsonOutput = {};
        var jsonDataOrderItemEvent = {};
        if( jsonReader.invoices != null || jsonReader.invoices != undefined ) {
            for (var i = 0; i < jsonReader.invoices.length; i++) {
                jsonOutput = {};
                var event = "";
                var itemId ='';
                var type = jsonReader.invoices[i].type;

                if(bu == 'FKMP') {
                    event = jsonReader.invoices[i].comments.toString().split(":")[1].trim();
                    itemId = jsonReader.invoices[i].invoice_ref_3;
                }
                //to hard code the events for the invoices as the payload does not have it
                else if(bu == 'EKL') {
                    //getting events
                    console.log("in EKL event");
                    console.log("type:"+type);
                    switch (type) {
                        case('payable_debit_note'):
                            event = "shipment_received";
                            break;
                        case('payable_credit_note'):
                            event = "shipment_lost";
                            break;
                        case('receivable_credit_note'):
                            event = "shipment_shipped";
                            break;
                        case('receivable_debit_note'):
                            event = "shipment_lost";
                            break;
                        default:
                            event = " ";
                    }
                    //external ref id as item id
                    console.log("event:"+event);
                    itemId = jsonReader.invoices[i].external_ref_id;

                }

                if(jsonDataOrderItemEvent[itemId]  == undefined)
                {
                    jsonDataOrderItemEvent[itemId] = {};

                }
                if(jsonDataOrderItemEvent[itemId][event]  == undefined)
                {
                    jsonDataOrderItemEvent[itemId][event] = [];

                }

                jsonOutput["Type"] = jsonReader.invoices[i].type;
                jsonOutput["SubType"] = jsonReader.invoices[i].invoice_ref_4;
                jsonOutput["Amount"] = jsonReader.invoices[i].total_amount;
                jsonOutput["Created date"] = dateFormatter(jsonReader.invoices[i].created_at);
                jsonOutput["Updated date"] = dateFormatter(jsonReader.invoices[i].updated_at);
                jsonOutput["Due date"] = dateFormatter(jsonReader.invoices[i].due_date);
                jsonOutput["Status"] = jsonReader.invoices[i].status;
                jsonOutput["Settled Date"] = dateFormatter(jsonReader.invoices[i].invoice_ref_date_3);
                jsonOutput["shipment_id"] = jsonReader.invoices[i].external_ref_id;
                jsonDataOrderItemEvent[itemId][event].push(jsonOutput);
            }
        }
        return jsonDataOrderItemEvent;

    }

};
function dateFormatter(inputDate) {
    if(inputDate == "" || inputDate == null ) {
        return "null";
    } else  {
        return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();   
    }
}