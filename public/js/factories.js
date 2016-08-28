  angular.module('bookstore.factories', ['ngStorage'])

  .factory('authProvider', function( $sessionStorage, $localStorage, $http) {
    //var user;
      return {
        setUser : function(logedInUser){
          $localStorage['user'] = logedInUser;
        },
        setToken : function(token){
          // save token in local storage
          // $http.defaults.headers.common['Authorization'] = 'Basic ' + token;
          $localStorage['token'] = token
        },
        getToken : function(){
          // get token from local storage
          return $localStorage['token'];
        },
        getUserRole : function(){
          return $localStorage['user'].role;
        },
        getUserName : function(){
          return $localStorage['user'].username;
        },
        isLoggedIn : function(){
          var user = $localStorage['user'];
          return(user)? user : false;
        },
        logOut : function(){
          delete $localStorage['token']
          delete $localStorage['user'];
        }
      };
  });