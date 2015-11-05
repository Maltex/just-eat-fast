angular
  .module('just-eat')
  .controller('SearchController', function($scope, supersonic, $http, $q) {

    $scope.Restaurants = {};
    $scope.Postcode = {};
    $scope.NumberOfTakeawaysFound = {};

    $scope.GetPostcodeFromLatLon = function(lat, lon) {
      return $q(function (resolve, reject) {
        $http({
          method: 'GET',
          url: 'http://api.postcodes.io/postcodes',
          params: {
            'lon': lon,
            'lat': lat
          }
        }).then(function (response) {
          console.log(response);
          resolve(response.data.result[0].postcode);
        }, function(error) {
          reject(error);
        });
      });
    };

    $scope.GetPostcode = function() {
      supersonic.device.geolocation.getPosition().then(function(position) {
        $scope.GetPostcodeFromLatLon(position.coords.latitude, position.coords.longitude)
          .then(function (postcode) {
            $scope.Postcode = postcode;
          }, function (error) {
            console.log('Postcode API error', error);
          });
      });
    };

    $scope.GetRestaurants = function(postcode) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: 'http://api-interview.just-eat.com/restaurants',
          params: {
            'q': postcode
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept-Tenant': 'uk',
            'Accept-Language': 'en-GB',
            'Authorization': 'Basic VGVjaFRlc3RBUEk6dXNlcjI=',
            // 'Host': 'api-interview.just-eat.com' // AngularJS will not set host header as it is deemed unsafe.
          },
        }).then(function(response) {
          var restaurants = response.data.Restaurants;
          $scope.NumberOfTakeawaysFound = restaurants.length;
          resolve(restaurants);
        }, function(error) {
          reject(error);
        });
      });
    };

    supersonic.ui.views.current.whenVisible(function () {
      var postcode = steroids.view.params.postcode || 'SE19';
        $scope.Postcode = postcode.replace(' ','');
        $scope.GetRestaurants($scope.Postcode).then(function(restaurants) {
          $scope.Restaurants = restaurants;
        }, function(error) {
          console.error("API error.", error);
      });
    });
  });
