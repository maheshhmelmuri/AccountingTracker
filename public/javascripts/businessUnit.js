/**
 * Created by niyazulla.khan on 26/10/16.
 */
// var buList=[];
// function fecthBusinessUnit() {
//     console.log("in fethc BU");
//     var buUrl = "/buList";
//     // var buUrl = "10.85.52.146:80/business_unit/";
//     $.get(buUrl)
//         .done(function(data) {
//            console.log("fetching bu list successful");
//             var buArray = JSON.parse(data);
//             $.each(buArray,function(bu) {
//                     buList.push(buArray[bu]["name"]);
//                     console.log(buArray[bu]["name"]);
//                 });
//             console.log(buList);
//             })
//
//         .fail(function(data){console.log("failed to fetch BU");})
//     ;
// }
// $(document).ready(function () {
//     // fecthBusinessUnit();
// });