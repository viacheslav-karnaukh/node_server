define([
    'backbone'
    , 'jquery'
    , 'bootstrap'
    , 'text!app/users-form.tpl'
    , 'app/users-model'
], function(Backbone, $, bootstrap, tpl, Model){
    return Backbone.View.extend({
        className: 'users-form',

        template: _.template(tpl),

        events: {
            'submit form': '_saveUser'
        },

        _saveUser: function(e){
            e.preventDefault();

            var data = {};
            _.each(this.$('input'), function(input){
                data[$(input).attr('name')] = $(input).val();
            });

            this.model.save(data);
        },

        showPopup: function(id){
            this.model = new Model();

            this.listenTo(this.model, 'error', function(){
                alert('error');
            });

            if(_.isUndefined(id)){
                this.render();
                this.$('.modal').modal('show');

                this.listenTo(this.model, 'sync', this._saveSuccessHandler);

            } else{
                this.model.set('id', id);

                this.listenToOnce(this.model, 'sync', this._fetchSuccessHandler);

                this.model.fetch();
            }
        },

        _fetchSuccessHandler: function(){
            this.render();
            this.$('.modal').modal('show');

            this.listenTo(this.model, 'sync', this._saveSuccessHandler)
        },

        _saveSuccessHandler: function(){
            this.$('.modal').one('hidden.bs.modal', function(){
                Backbone.Events.trigger('userWasSaved');
            });

            this.closePopup();
        },

        closePopup: function(model){
            this.$('.modal').modal('hide');
            this.stopListening(this.model);
        },

        render: function(){
            this.$el.html(this.template({user: this.model.toJSON()}));

            return this;
        }
    });
});