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
                jsonOutput["Payment/disbursement id"] = "null";
                jsonOutput["is Datafix"] = "Manual";
                //extra details
                extraDetails["Total Payable"] = "null";
                extraDetails["GMV"] = "null";
                extraDetails["Fee Exp"] = "null";
                extraDetails["AGM ID"] = "null";
                extraDetails["Vertical"] = "null";
                extraDetails["Brand"] = "null";
                extraDetails["Invoice Type"] = "null";
                extraDetails["FSN"] = "null";
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
