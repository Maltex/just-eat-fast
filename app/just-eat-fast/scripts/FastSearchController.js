angular
  .module('just-eat-fast')
  .controller('FastSearchController', function($scope, supersonic, $http, $q) {
    $scope.Restaurants = {};
    $scope.MaxPrice = {};
    $scope.AreRestaurantsAvailable = true;
    $scope.MealSelected = false;
    $scope.MealIndex = 0;
    $scope.Postcode = {};

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
            console.error('Postcode API error', error);
          });
      });
    };

    $scope.SimulatedMeals = {
      indian: {
        starters: ['Popadoms', 'Onion Bhajees', 'Samosas'],
        mains: ['Korma', 'Tikka-Misala', 'Jalfrezi'],
        drinks: ['Coca-Cola', 'Pepsi', 'Lemonade']
      },
      italian: {
        starters: ['Olives', 'Garlic Bread', 'Bruschetta'],
        mains: ['Lasagne', 'Cannelloni', 'Margherita Pizza'],
        drinks: ['7-up', 'Tango', 'Coca-Cola']
      }
    };

    $scope.Random = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /// Simulate a max price strategy on the list of restaurants
    $scope.FilterMaxPrice = function(restaurants, maxPrice) {
      restaurants = restaurants.splice(0, 50);
      var openRestaurants = [];

      // simulate meal items and prices
      angular.forEach(restaurants, function(value, key) {

        // check delivery
        if(value.IsOpenNowForDelivery) {
          // only include delivery
          var restaurant = value;
          var cuisine = restaurant.CuisineTypes[0];
          restaurant.Meal = { Cuisine: 'indian'};
          restaurant.Meal.Starter = {
            name: $scope.SimulatedMeals['indian'].starters[$scope.Random(0, 2)],
            price: Math.min(((maxPrice / 4) * $scope.Random(1,1.5).toFixed(2)).toFixed(2), 3)
          };
          restaurant.Meal.Main = {
            name: $scope.SimulatedMeals['indian'].mains[$scope.Random(0, 2)],
            price: Math.min(((maxPrice / 4) * $scope.Random(1.5, 2)).toFixed(2), 5)
          };
          restaurant.Meal.Drink = {
            name: $scope.SimulatedMeals['indian'].drinks[$scope.Random(0, 2)],
            price: Math.min(((maxPrice / 4) * $scope.Random(0.5,0.75)).toFixed(2), 2)
          };

          restaurant.Meal.Total = restaurant.Meal.Starter.price + restaurant.Meal.Main.price + restaurant.Meal.Drink.price;
          openRestaurants.push(restaurant);
        }
      });

      // reset restaurants
      restaurants = openRestaurants;

      return restaurants;
    };

    $scope.GetRestaurantsAndMeals = function (postcode, maxPrice) {
      return $q(function (resolve, reject) {
        console.log(postcode, maxPrice);
        $http({
          method: 'GET',
          url: 'http://api-interview.just-eat.com/restaurants',
          params: {'q': postcode},
          headers: {
            'Content-Type': 'application/json',
            'Accept-Tenant': 'uk',
            'Accept-Language': 'en-GB',
            'Authorization': 'Basic VGVjaFRlc3RBUEk6dXNlcjI=',
            // 'Host': 'api-interview.just-eat.com' // Angular will not set host header as it is deemed unsafe.
         },
        }).then(function (response) {
            var restaurants = $scope.FilterMaxPrice(response.data.Restaurants, maxPrice);
            resolve(restaurants);
          }, function (error) {
            $scope.AreRestaurantsAvailable = false;
            reject(error);
          });
      });
    };

    supersonic.ui.views.current.whenVisible(function () {
        var postcode = steroids.view.params.postcode || 'SE19';
        $scope.Postcode = postcode.replace(' ','');
        $scope.MaxPrice = steroids.view.params.maxPrice || 10;

        $scope.GetRestaurantsAndMeals($scope.Postcode, $scope.MaxPrice).then(function(restaurants){
          $scope.Restaurants = restaurants;
          console.log($scope.Restaurants[$scope.MealIndex]);
        }, function(error) {
          console.error(error);
        });
    });

    // move through available meals
    $scope.NextMeal = function() {
      console.log(123);
        if($scope.MealIndex == $scope.Restaurants.length - 1) {
            $scope.AreRestaurantsAvailable = false;
            return;
        }

        $scope.MealIndex += 1;
    };
  });
