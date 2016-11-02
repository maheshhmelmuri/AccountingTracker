/**
 * Created by niyazulla.khan on 02/11/16.
 */
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
