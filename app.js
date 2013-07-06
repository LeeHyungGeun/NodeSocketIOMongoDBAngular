'use strict';
var app = angular.module('app', []);

app.config(['$httpProvider', function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

// Factory
app.factory('socket', function($rootScope){
    var socket = io.connect();
    return{
        on: function(eventName, callback){
            socket.on(eventName, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback){
            socket.emit(eventName, data, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket.args);
                    }
                });
            })
        }
    };
});

// Controller
function UserListCtrl($scope, socket){
    $scope.showEdit = false;
    $scope.showLabel = true;

    /* CRUD */
    //insert
    $scope.save = function(){
        var formData = {
            "username": this.username,
            "password": this.password,
            "email": this.email
        };
        this.username = '';
        this.password = '';
        this.email = '';

        socket.emit('insertUser', formData);
        return false;
    };
    //update
    $scope.update = function(){
        var userData = {
            "username": this.user.username,
            "password": this.user.password,
            "email": this.user.email,
            "_id": this.user._id
        };
        
        socket.emit('updateUser', userData);
        return false;
    };
    //delete
    $scope.remove = function(){
        var userData = {
            "username": this.user.username,
            "password": this.user.password,
            "email": this.user.email
        };
        
        socket.emit('removeUser', userData);
        return false;
    };
    //get
    socket.on('getUsers', function(users){
        $scope.users = users;
        console.log(users);
    });

    /* event */
    $scope.selectUser = function(){
        if(this.showEdit === false){
            this.showEdit = true;
            this.showLabel = false;
        }
    };

    socket.emit('getUsers');
}
