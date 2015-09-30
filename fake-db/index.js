function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 36; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var db = [];


module.exports = {
    getCollection: function(cb) {
        cb(null, db);
    },
    getById: function(id, cb) {
        var matchedEntries = db.filter(function(entry) {
            return entry.id === id;
        });

        if (matchedEntries.length) {
            cb(null, matchedEntries[0]);
        } else {
            cb(new Error('There is no such record in DB'), null);
        }
    },
    create: function(model, cb) {
        model.id = makeid();
        db.push(model);

        cb(null, model);
    },
    update: function(model, cb) {
        var matchedModel = db.filter(function(entry) {
            return entry.id === model.id;
        })[0];

        if (matchedModel) {
            db[db.indexOf(matchedModel)] = model;
            cb(null, model);
        } else {
            cb(new Error('There is no such model'), null)
        }
    },
    remove: function(id, cb) {
        var matchedModel = db.filter(function(entry) {
            return entry.id === id;
        })[0];

        if (matchedModel) {
            db.splice(db.indexOf(matchedModel), 1)
            cb(null);
        } else {
            cb(new Error('There is no such model'))
        }
    }
};