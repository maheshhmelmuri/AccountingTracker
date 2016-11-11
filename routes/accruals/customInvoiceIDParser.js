/**
 * Created by mahesh.melmuri on 08/11/16.
 */

module.exports =
{
    customInvoiceIDParser: function customInvoiceIDParser(rawJson) {
        var jsonReader = JSON.parse(rawJson);
        var jsonOutput = {};
        if(jsonReader.invoices != null || jsonReader.invoices != undefined ) {
            if(jsonReader.invoices[0] != undefined)
            {
                jsonOutput["Due Date"] = dateFormatter(jsonReader.invoices[0].due_date);
                jsonOutput["Settled Date"] = dateFormatter(jsonReader.invoices[0].invoice_ref_date_3);
            }
            else
            {
                jsonOutput["Due Date"] = "null";
                jsonOutput["Settled Date"] = "null";

            }


        }
        return jsonOutput;

    }
};

function dateFormatter(inputDate) {
    if(inputDate == "" || inputDate == null ) {
        return "null";
    } else  {
        return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();
    }
}