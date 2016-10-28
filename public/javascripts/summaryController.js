/**
 * Created by mahesh.melmuri on 27/10/16.
 */

var app = angular.module('main', []).
controller('SummaryCtrl', function($scope) {
    $scope.name="abcd"
    $scope.names =['Vendor_Tracking_ID','Merchant_Ref_ID']
    $scope.ids =['a','b','c']
    $scope.selectedName=$scope.names[0]
});