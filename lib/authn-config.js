/**
 * Created by mahesh.melmuri on 26/10/16.
 * private key path on prod : /home/eklasl/NodeJsProject/keys
 */


module.exports= {
    useAuthN: true,
    disableCAS: false,
    clientId: "AccontingTracker",
    authnUrl: "http://10.85.50.5",
    serviceUrl: "AccountingTracker",
    privateKeyPath: "/Users/mahesh.melmuri/IdeaProjects/NodeJsProject/keys/myservice.pem",
    timeSkewAllowance: 300000
};