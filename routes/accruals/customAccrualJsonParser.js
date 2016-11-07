/**
 * Created by mahesh.melmuri on 27/10/16.
 */

module.exports =
{
    customAccJParser: function customAccrualJsonParser(rawJson) {
        var jsonReader = JSON.parse(rawJson);
        var jsonOutput = {};
        var jsonDataOrderItemEvent = {};
        var extraDetails = {};
        if(jsonReader.accruals != null || jsonReader.accruals != undefined ) {
            for (var i = 0; i < jsonReader.accruals.length; i++) {
                jsonOutput = {};
                extraDetails = {};
                var event = jsonReader.accruals[i].comments.toString().split(":")[1].trim();
                if(jsonDataOrderItemEvent[jsonReader.accruals[i].accrual_ref_3] == undefined)
                {
                    jsonDataOrderItemEvent[jsonReader.accruals[i].accrual_ref_3] = {};
                }
                if(jsonDataOrderItemEvent[jsonReader.accruals[i].accrual_ref_3][event] == undefined)
                {
                    jsonDataOrderItemEvent[jsonReader.accruals[i].accrual_ref_3][event] = [];
                }

                jsonOutput["Type"] = jsonReader.accruals[i].accrual_items[0].accrual_type;
                jsonOutput["Fee name"] = jsonReader.accruals[i].accrual_ref_5;
                jsonOutput["Amount"] = jsonReader.accruals[i].accrual_items[0].total_amount;
                jsonOutput["Tax"] = jsonReader.accruals[i].accrual_items[0].sub_items[0].total_amount;
                jsonOutput["Total Amount"] = jsonReader.accruals[i].total_amount;
                jsonOutput["Created date"] = dateFormatter(jsonReader.accruals[i].created_at);
                jsonOutput["Updated date"] = dateFormatter(jsonReader.accruals[i].updated_at);
                jsonOutput["Due date"] = "null";
                jsonOutput["Setteled Date"] = "null";
                jsonOutput["Status"] = jsonReader.accruals[i].status;
                //extra details
                extraDetails["FSN"] = jsonReader.accruals[i].accrual_attributes["fsn"];
                extraDetails["Order Date"] = dateFormatter(jsonReader.accruals[i].accrual_attributes["date"]);
                extraDetails["Service Profile"] = jsonReader.accruals[i].accrual_attributes["service_profile"];
                extraDetails["Vertical"] = jsonReader.accruals[i].accrual_attributes["vertical"];
                extraDetails["Zone"] = jsonReader.accruals[i].accrual_attributes["zone"];
                extraDetails["Invoice Type"] = jsonReader.accruals[i].accrual_attributes["invoice_type"];
                extraDetails["Weight"] = jsonReader.accruals[i].accrual_attributes["accrual_reporting_ref_9"];
                //extraDetails["Weight Upper Bound"] = jsonReader.accruals[i].accrual_attributes["weight_upper_bound"];
                //extraDetails["Weight Lower Bound"] = jsonReader.accruals[i].accrual_attributes["weight_lower_bound"];
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
                jsonDataOrderItemEvent[jsonReader.accruals[i].accrual_ref_3][event].push(jsonOutput);

            }
        }
        console.log("jsonDataUpdated2:"+JSON.stringify(jsonDataOrderItemEvent));
        return jsonDataOrderItemEvent;

    }

};
function dateFormatter(inputDate) {
    return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();
}
