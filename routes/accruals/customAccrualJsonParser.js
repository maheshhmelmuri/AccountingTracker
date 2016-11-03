/**
 * Created by mahesh.melmuri on 27/10/16.
 */

module.exports =
{
    customAccJParser: function customAccrualJsonParser(rawJson) {
        var jsonReader = JSON.parse(rawJson);
        var jsonOutput = {};
        var jsonOrderItem = {};
        if(jsonReader.accruals != null || jsonReader.accruals != undefined ) {
            for (var i = 0; i < jsonReader.accruals.length; i++) {
                jsonOutput = {};
                if(jsonOrderItem[jsonReader.accruals[i].accrual_ref_3] == undefined)
                {
                    jsonOrderItem[jsonReader.accruals[i].accrual_ref_3] = [];
                }
                jsonOutput["Type"] = jsonReader.accruals[i].accrual_items[0].accrual_type;
                jsonOutput["Fee name"] = "Commission";
                jsonOutput["Amount"] = "null";
                jsonOutput["Tax"] = jsonReader.accruals[i].accrual_items[0].tax_rate;
                jsonOutput["Total Amount"] = jsonReader.accruals[i].accrual_items[0].total_amount;
                jsonOutput["Created date"] = dateFormatter(jsonReader.accruals[i].created_at);
                jsonOutput["Updated date"] = dateFormatter(jsonReader.accruals[i].updated_at);
                jsonOutput["Due date"] = "null";
                jsonOutput["Setteled Date"] = "null";
                jsonOutput["Status"] = jsonReader.accruals[0].status;
                jsonOutput["Payment/disbursement id"] = "null";
                jsonOutput["is Datafix"] = "Manual";
                jsonOrderItem[jsonReader.accruals[i].accrual_ref_3].push(jsonOutput);

            }
        }
        console.log("Accrual JSON data:"+JSON.stringify(jsonOrderItem));
        return jsonOrderItem;

    }

};
function dateFormatter(inputDate) {
    return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();
}