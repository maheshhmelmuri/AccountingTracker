/**
 * Created by mahesh.melmuri on 27/10/16.
 */

module.exports =
{
    customAccJParser: function customAccrualJsonParser(rawJson,bu) {
        var jsonReader = JSON.parse(rawJson);
        var jsonOutput = {};
        var jsonDataOrderItemEvent = {};
        var extraDetails = {};
        if(jsonReader.accruals != null || jsonReader.accruals != undefined ) {
            for (var i = 0; i < jsonReader.accruals.length; i++) {
                jsonOutput = {};
                extraDetails = {};
                var event = '';
                var itemId = '';

                if(bu == 'FKMP') {
                    event = jsonReader.accruals[i].comments.toString().split(":")[1].trim();
                    itemId = jsonReader.accruals[i].accrual_ref_3;

                }
                else if(bu == 'EKL')
                {
                    event = jsonReader.accruals[i].accrual_ref_3;
                    itemId =  jsonReader.accruals[i].external_ref_id;
                }

                if(jsonDataOrderItemEvent[itemId] == undefined)
                {
                    jsonDataOrderItemEvent[itemId] = {};
                }
                if(jsonDataOrderItemEvent[itemId][event] == undefined)
                {
                    jsonDataOrderItemEvent[itemId][event] = [];
                }

                jsonOutput["Type"] = jsonReader.accruals[i].accrual_items[0].accrual_type;
                jsonOutput["Fee name"] = jsonReader.accruals[i].accrual_ref_5;
                jsonOutput["Amount"] = jsonReader.accruals[i].accrual_items[0].total_amount;
                if(bu == 'FKMP')
                    jsonOutput["Tax"] = jsonReader.accruals[i].accrual_items[0].sub_items[0].total_amount;
                else
                    jsonOutput["Tax"] = jsonReader.accruals[i].accrual_items[0].tax_rate;
                jsonOutput["Total Amount"] = jsonReader.accruals[i].total_amount;
                jsonOutput["Created date"] = dateFormatter(jsonReader.accruals[i].created_at);
                jsonOutput["Updated date"] = dateFormatter(jsonReader.accruals[i].updated_at);
                jsonOutput["Due Date"] = "null";
                jsonOutput["Settled Date"] = "null";
                jsonOutput["Status"] = jsonReader.accruals[i].status;
                jsonOutput["invoice_id"] = jsonReader.accruals[i].invoice_id;
                //extra details
                extraDetails["FSN"] = jsonReader.accruals[i].accrual_attributes["fsn"];
                extraDetails["Order Date"] = dateFormatter(jsonReader.accruals[i].accrual_attributes["date"]);
                extraDetails["Service Profile"] = jsonReader.accruals[i].accrual_attributes["service_profile"];
                extraDetails["Vertical"] = jsonReader.accruals[i].accrual_attributes["vertical"];
                extraDetails["Zone"] = jsonReader.accruals[i].accrual_attributes["zone"];
                extraDetails["Invoice Type"] = jsonReader.accruals[i].accrual_attributes["invoice_type"];
                extraDetails["Weight"] = jsonReader.accruals[i].accrual_attributes["accrual_reporting_ref_9"];
                extraDetails["Seller ID"] = jsonReader.accruals[i].accrual_attributes["seller_id"];
                extraDetails["Accrual Ratio"] = jsonReader.accruals[i].accrual_attributes["accrualRatio"];
                extraDetails["height"] = jsonReader.accruals[i].accrual_attributes["height"];
                extraDetails["Length"] = jsonReader.accruals[i].accrual_attributes["length"];
                extraDetails["Breadth"] = jsonReader.accruals[i].accrual_attributes["breadth"];
                extraDetails["Agreement ID"] = jsonReader.accruals[i].accrual_attributes["accrual_reporting_ref_11"];
                extraDetails["is replacement"] = jsonReader.accruals[i].accrual_attributes["replacement"];
                extraDetails["Expression"] = jsonReader.accruals[i].accrual_attributes["expression"];
                extraDetails["Expression variables"] = jsonReader.accruals[i].accrual_attributes["parameters"];
                jsonOutput["extra_details"] = extraDetails;
                jsonDataOrderItemEvent[itemId][event].push(jsonOutput);

            }
        }
        //console.log("jsonDataUpdated2:"+JSON.stringify(jsonDataOrderItemEvent;
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

