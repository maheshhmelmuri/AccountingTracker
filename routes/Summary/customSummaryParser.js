/**
 * Created by mahesh.melmuri on 07/11/16.
 */

/**
 * Created by mahesh.melmuri on 27/10/16.
 */
module.exports =
{
    customSummaryParser: function customSummaryParser(rawJson,searchId) {
        var jsonReader = JSON.parse(rawJson);
        //console.log("rawjson"+rawJson);
        var jsonSummaryOutput = {};
        var jsonOutput = {};
        if( jsonReader.invoices != null || jsonReader.invoices != undefined ) {

            jsonOutput["search_id"] = searchId;
            jsonOutput["service_type"] = jsonReader.invoices[0].invoice_ref_7;
            jsonOutput["payment_type"] = jsonReader.invoices[0].invoice_ref_5;
            jsonOutput["seller_id"] = jsonReader.invoices[0].party_id_from;

        }
        return jsonOutput;

    }

};
function dateFormatter(inputDate) {
    return inputDate.toString().substring(0, 10) + " " + inputDate.toString().substring(11, 19).toString();
}
