angular
  .module('just-eat')
  .controller('SearchController', function($scope, supersonic, $http, $q) {

    $scope.restaurants = {};
    $scope.MaxPrice = {};

    $scope.simulatedMeals = {
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

    $scope.random = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /// Simulate a max price strategy on the list of restaurants
    $scope.filterMaxPrice = function(restaurants, maxPrice) {
      // simulate 3 restaurants found for maxPrice
      restaurants = restaurants.splice(0, 3);

      // simulate meal items and prices
      angular.forEach(restaurants, function(value, key) {
        var restaurant = value;
        var cuisine = restaurant.CuisineTypes[0];
        restaurant.Meal = { Cuisine: 'indian'};
        restaurant.Meal.Starter = {
          name: $scope.simulatedMeals['indian'].starters[$scope.random(0, 2)],
          price: Math.min(((maxPrice / 4) * $scope.random(1,1.5).toFixed(2)).toFixed(2), 3)
        };
        restaurants[key].Meal.Main = {
          name: $scope.simulatedMeals['indian'].mains[$scope.random(0, 2)],
          price: Math.min(((maxPrice / 4) * $scope.random(1.5, 2)).toFixed(2), 5)
        };
        restaurants[key].Meal.Drink = {
          name: $scope.simulatedMeals['indian'].drinks[$scope.random(0, 2)],
          price: Math.min(((maxPrice / 4) * $scope.random(0.5,0.75)).toFixed(2), 2)
        };
      });

      return restaurants;
    };

    $scope.getRestaurantsAndMeals = function (postcode, maxPrice) {
      return $q(function (resolve, reject) {
        console.log("HERE");
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
            console.log("API success", response);
            var restaurants = $scope.filterMaxPrice(response.data.Restaurants, maxPrice);
            resolve(restaurants);
          }, function (error) {
            console.error("API fail")
            reject(error);
          });
      });
    };

    supersonic.ui.views.current.whenVisible(function () {
      (function init() {
        var postcode = steroids.view.params.postcode || 'SE19';
        var maxPrice = steroids.view.params.maxPrice || 10;
        $scope.MaxPrice = maxPrice;
        $scope.getRestaurantsAndMeals(postcode, maxPrice).then(function(restaurants) {
          console.log('here12');
          console.log(restaurants);
          $scope.restaurants = restaurants;
        }, function(error) {
          console.log('hereeerrror');
          console.log(error);
        });
      })();
    });

    $scope.navbarTitle = "API More";
  });
