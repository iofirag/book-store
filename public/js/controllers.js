angular.module('bookstore.controllers', [])

.controller('loginCtrl',
    function ($scope, $http, $state, authProvider){
        $scope.user = {
            username : 'myadmin',
            password : '1234'
        }
        $scope.login = ()=>{
            console.log('login')
            $http.post('/api/auth', $scope.user)
                .success(function(data) {
                    //console.log(data)
                    authProvider.setUser(data.user)
                    authProvider.setToken(data.token)
                    console.log('token is: '+authProvider.getToken('token'))

                    $state.go('restrictedPage');
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
        

        // console.log($state.current.data)

    }
)
.controller('restrictedPageCtrl',
    function ($scope, $http, $state, authProvider){
        
        $scope.init = function(){
            // init
            $scope.token = authProvider.getToken();
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $scope.token;
            $scope.bookResult = [];
            $scope.allGenres = {};
            $scope.user = {
                role : authProvider.getUserRole().toLowerCase(),
                username : authProvider.getUserName()
            }
            $scope.book = {
                id : '57bdca4bf36d283b6d8ca8ca',
                name : 'my new book 546',
                genre : 'comic'
            }
            $scope.genre = {
                id : '57bd35b1f36d283b6d8c7205',
                name : 'comic'
            }

            $http.get('/api/get_allGenres')
                .success(function(res) {
                    if (res.success==1){
                        for (var i in res.data){
                            $scope.allGenres[res.data[i].name] = res.data[i].id
                        }
                    }else{
                        authProvider.logOut()
                        $state.go('login')
                    }
                    
                })
                .error(function(res) {
                    console.log('Error: ' + res);
                    authProvider.logOut()
                    $state.go('login')
                });
            console.log($scope.user.role)
        }

        $scope.logout = ()=>{
            authProvider.logOut()
            $state.go('login')
        }


        $scope.get_bookById = ()=>{
            $scope.createGetReq('/api/get_bookById?bookId='+$scope.book.id,'book');
        }
        $scope.get_bookByName = ()=>{
            $scope.createGetReq('/api/get_bookByName?bookName='+$scope.book.name,'book');
        }
        $scope.get_genreById = ()=>{
            $scope.createGetReq('/api/get_genreById?genreId='+ $scope.genre.id,'genre');
        }
        $scope.get_genreByName = ()=>{
            $scope.createGetReq('/api/get_genreByName?name='+$scope.genre.name,'genre');
        }
        $scope.get_allGenres = ()=>{
            $scope.createGetReq('/api/get_allGenres','genre');
        }
        $scope.get_bookNamesByGenre = ()=>{
            $scope.createGetReq('/api/get_bookNamesByGenre?name='+$scope.genre.name,'book');
        }
        $scope.get_bookDescriptionByBookId = ()=>{
            $scope.createGetReq('/api/get_bookDescriptionByBookId?bookId='+$scope.book.id,'book');
        }


        $scope.delete_bookById = ()=>{
            $scope.createDeleteReq('/api/delete_bookById?bookId='+$scope.book.id,'book')
        }
        $scope.delete_genreByName = ()=>{
            $scope.createDeleteReq('/api/delete_genreByName?name='+$scope.genre.name,'genre')
        }


        // create modal
        // app.put('/api/create_book', authenticationMiddleware(role.admin), handler.create_book);
        // app.put('/api/create_genre', authenticationMiddleware(role.admin), handler.create_genre);
        // app.post('/api/update_bookById', authenticationMiddleware(role.admin), handler.update_bookById);
        // app.post('/api/update_genreById', authenticationMiddleware(role.admin), handler.update_genreById);

        $scope.createGetReq = (endpoint,type)=>{
            $scope.bookResult = []
            $scope.genreResult =[];
            $scope.response = '';

            $http.get(endpoint)
                .success(function(res) {
                    if (res.success==1){
                        $scope.response = res;

                        if (typeof(res.data)=='object'){    // object/array
                            var isArray = res.data.length
                            if (!!isArray){
                                if (type=='book') $scope.bookResult = res.data;
                                if (type=='genre')  $scope.genreResult = res.data
                            }else{
                                if (type=='book'){
                                    $scope.bookResult.push(res.data)
                                }
                                if (type=='genre')  $scope.genreResult.push(res.data)
                            }
                        }else if(typeof(res.data)=='string'){
                            alert(res.data)
                        }
                    }else{
                        authProvider.logOut()
                        $state.go('login')
                    }
                })
                .error(function(res) {
                    console.log('Error: ' + res);
                    authProvider.logOut()
                    $state.go('login')
                });
        }

        $scope.createDeleteReq = (endpoint,type)=>{
            $scope.bookResult = []
            $scope.genreResult =[];
            $scope.response = '';

            $http.delete(endpoint)
                .success(function(res) {
                    console.log(res)
                    if (res.success==1){
                        $scope.response = res;
                        if (type=='genre') alert('success delete genre')
                        else if (type=='book') alert('success delete book: '+res.data.name)
                    }else{
                        authProvider.logOut()
                        $state.go('login')
                    }
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    authProvider.logOut()
                    $state.go('login')
                });
        }

        $scope.createPostReq = (data,type)=>{
            console.log('login')
            $http.post(endpoint, data)
                .success(function(res) {
                    console.log(data)
                    if (res.success==1){
                        $scope.response = res;
                        if (type=='genre'){
                            // Still not implemented
                        }
                        else if (type=='book'){
                            // Still not implemented
                        }
                    }else{
                        authProvider.logOut()
                        $state.go('login')
                    }
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }
)