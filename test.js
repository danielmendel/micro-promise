var test = require('promises-aplus-tests');
var Prom = require('./take2');

adapter = {
    resolved: function(value) {
        var p = new Prom();
        p.resolve(value);
        return p;
    },
    rejected: function(reason) {
        var p = new Prom();
        p.reject(reason);
        return p;
    },
    deferred: function() {
        var p = new Prom();
        return {
            promise: p,
            resolve: function(value){
                p.resolve(value);
            },
            reject: function(reason){
                p.reject(reason);
            }
        }
    }
};

test(adapter, function(err) {
    console.log(err);
});
