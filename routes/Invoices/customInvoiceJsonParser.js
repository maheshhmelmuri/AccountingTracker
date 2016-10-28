/**
 * Created by mahesh.melmuri on 27/10/16.
 */
module.exports =
{
    customInvJParser: function customInvoiceJsonParser(rawJson) {
        var jsonReader = JSON.parse(rawJson);
        var jsonOutput = {};
        for (var i = 0; i < jsonReader.invoices.length; i++) {
            jsonOutput["Type"] = jsonReader.invoices[i].type;
            jsonOutput["SubType"] = "Sale";
            jsonOutput["Amount"] = jsonReader.invoices[i].total_amount;
            jsonOutput["Created date"] = dateFormatter(jsonReader.invoices[i].created_at);
            jsonOutput["Updated date"] = dateFormatter(jsonReader.invoices[i].updated_at);
            jsonOutput["Due date"] = dateFormatter(jsonReader.invoices[i].due_date);
            jsonOutput["Status"] = jsonReader.invoices[i].status;
            jsonOutput["Setteled Date"] = dateFormatter(jsonReader.invoices[i].due_date);
            jsonOutput["Payment/disbursement id"] = "null";
            jsonOutput["is Datafix"] = "Manual";

        }
        return JSON.stringify(jsonOutput);

    },

}
function dateFormatter(inputDate) {
    return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();
}