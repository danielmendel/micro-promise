function Prom(exec) {
    this.status = Prom.statusTypes.PENDING
    this.value = undefined;
    this.catcher = function(err){
        console.error("(in promise) " + err);
    };
    this.queue = [];
    exec && exec(this.resolve.bind(this), this.reject.bind(this));
}

Prom.prototype.resolve = function(val) {
    this.value = val;
    this.status = Prom.statusTypes.RESOLVED;
    this._runQueue();
};

Prom.prototype.reject = function(reason) {
    this.value = reason;
    this.status = Prom.statusTypes.REJECTED;
    this.catcher(reason);
};

Prom.prototype._add = function(fn) {
    this.queue.push(fn);
};

Prom.prototype._runQueue = function() {
    if (this.status === Prom.statusTypes.RESOLVED) {
        while (this.queue.length) {
            if (this.value instanceof Prom) {
                this.value.then(this.queue.pop()).catch(this.catcher);
            } else {
                this.queue.pop()(this.value);
            }
        }
    }
}

Prom.prototype.then = function(fn) {
    var prom = new Prom();
    this._add(function(val) { return prom.resolve(fn(val)); });
    this.catcher = function (err){ prom.catcher(err); }
    this._runQueue();
    return prom;
};

Prom.prototype.catch = function(fn) {
    this.catcher = fn;
    if (this.status === Prom.statusTypes.REJECTED) {
        this.catcher(this.value);
    }
};

Prom.statusTypes = Object.freeze({
    PENDING: "pending",
    RESOLVED: "resolved",
    REJECTED: "rejected"
});

Prom.all = function(iter) {
    var vals = [];
    var p = new Prom();
    iter.forEach(function(prom) {
        prom.then(function(v) {
            vals.push(v);
            if (vals.length === iter.length) {
                p.resolve(vals);
            }
        }).catch(function(reason){
            p.reject(reason);
        });
    });
    return p;
}

module.exports = Prom;
