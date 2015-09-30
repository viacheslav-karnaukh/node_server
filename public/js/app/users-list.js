define([
    'backbone'
    , 'app/users-collection'
    , 'text!app/users-list.tpl'
    , 'app/user-form'
], function(Backbone, UsersCollection, tpl, UserForm){
    return Backbone.View.extend({
        el: '.users-list',

        template: _.template(tpl),

        users: new UsersCollection,

        events: {
            'click .user-form': 'showUserForm',
            'click .delete-user': 'deleteUser'
        },

        initialize: function(){
            this.listenTo(this.users, 'sync', this.render);
            this.users.fetch();
            this._userForm = new UserForm()

            this.listenTo(this.users, 'destroy', function(){
                this.users.fetch();
            })

            this.listenTo(Backbone.Events, 'userWasSaved', function(){
                this.users.fetch();
            });
        },

        render: function(){
            this.$el.html(this.template({collection: this.users.toJSON()}));

            this._userForm.setElement(this.$('.' + this._userForm.className).get(0));

            return this;
        },

        showUserForm: function(e){
            this._userForm.showPopup($(e.target).data('id'));
        },

        deleteUser: function(e){
            this.users.get($(e.target).data('id')).destroy();
        }
    });
});