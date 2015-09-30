define([
    'backbone'
    , 'app/users-model'
], function(Backbone, UsersModel){
    return Backbone.Collection.extend({

        model: UsersModel,
        url: '/api/users',

        initialize: function(){

        }
    });
});