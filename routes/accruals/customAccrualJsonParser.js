/**
 * Created by mahesh.melmuri on 27/10/16.
 */

module.exports =
{
    customAccJParser: function customAccrualJsonParser(rawJson) {
        var jsonReader = JSON.parse(rawJson);
        var jsonOutput = {};
        console.log(jsonReader.accruals.length);
        console.log(jsonReader.accruals[0].accrual_items[0].accrual_type);
        //for (var i = 0; i < jsonReader.accruals.length; i++) {
            jsonOutput["Type"] = jsonReader.accruals[0].accrual_items[0].accrual_type;
            jsonOutput["Fee name"] = "Commission";
            jsonOutput["Amount"] = "null";
            // jsonOutput["Tax"] = jsonReader.accruals[i].accrual_items[i].tax_rate;
            // jsonOutput["Total Amount"] = jsonReader.accruals[i].accrual_items[i].total_amount;
            // jsonOutput["Created date"] = dateFormatter(jsonReader.accruals[0].created_at);
            // jsonOutput["Updated date"] = dateFormatter(jsonReader.accruals[0].updated_at);
            // jsonOutput["Due date"] = dateFormatter(jsonReader.accruals[0].due_date);
            // jsonOutput["Setteled Date"] = "null";
            // jsonOutput["Status"] = jsonReader.accruals[0].status;
            jsonOutput["Payment/disbursement id"] = "null";
            jsonOutput["is Datafix"] = "Manual";

        //}

        return JSON.stringify(jsonOutput);

    },

}
function dateFormatter(inputDate) {
    return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();
}