function Prom(exec) {
    this.status = Prom.statusTypes.PENDING;
    this.value = undefined;
    this.catcher = function(err){
        // console.error("(in promise) " + err);
    };
    this.yayQueue = [];
    this.nayQueue = [];
    exec && exec(this.resolve.bind(this), this.reject.bind(this));
}

Prom.prototype.resolve = function(val) {
    if (this.status !== Prom.statusTypes.PENDING) {
        return;
    }
    this.value = val;
    this.status = Prom.statusTypes.RESOLVED;
    this._runQueue();
};

Prom.prototype.reject = function(reason) {
    if (this.status !== Prom.statusTypes.PENDING) {
        return;
    }
    this.value = reason;
    this.status = Prom.statusTypes.REJECTED;
    this.catcher(reason);
};

Prom.prototype._runQueue = function() {
    if (this.status !== Prom.statusTypes.PENDING) {
        var q = this.status === Prom.statusTypes.RESOLVED ? this.yayQueue : this.nayQueue;
        while (q.length) {
            if (this.value instanceof Prom) {
                this.value.then(q.shift()).catch(this.catcher);
            } else {
                var fn = q.shift();
                var val = this.value;
                setTimeout((function(fn, val){ return function(){ fn(val); } })(fn, val), 0);
            }
        }
    }
}

Prom.prototype.then = function(yayFn, nayFn) {
    var prom = new Prom();
    typeof yayFn === 'function' && this.yayQueue.push(function(val) { return prom.resolve(yayFn(val)); });
    typeof nayFn === 'function' && this.nayQueue.push(function(val) { return prom.reject(nayFn(val)); });
    this.catcher = function (err){ prom.catcher(err); }
    this._runQueue();
    if (this.status !== Prom.statusTypes.PENDING) {
        prom[this.status === Prom.statusTypes.REJECTED ? 'reject' : 'resolve'](this.value);
    }
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