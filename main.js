function Prom(exec) {
    this.status = Prom.statusTypes.PENDING;
    this.value = undefined;
    this.yayQueue = [];
    this.nayQueue = [];
    exec && exec(this.resolve.bind(this), this.reject.bind(this));
}

Prom.prototype.resolve = function(val) {
    if (this.status !== Prom.statusTypes.PENDING) {
        return;
    }
    if (this === val) {
        this.reject(new TypeError("Promise cannot be resolved with itself"));
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
    if (this === reason) {
        this.reject(new TypeError("Promise cannot be rejected with itself"));
        return;
    }
    this.value = reason;
    this.status = Prom.statusTypes.REJECTED;
    this._runQueue();
};

Prom.prototype._runQueue = function() {
    if (this.status === Prom.statusTypes.PENDING) {
        return;
    }
    if (this.value) {
        try {
            var then = this.value.then;
        } catch (e) {
            this.reject(e);
        }
        if (typeof then === 'function' && this.status === Prom.statusTypes.RESOLVED) {
            while (this.yayQueue.length) { then.call(this.value, this.yayQueue.shift(), this.nayQueue.shift()); }
            return;
        }
    }
    var q = this.status === Prom.statusTypes.RESOLVED ? this.yayQueue : this.nayQueue;
    while (q.length) {
        var fn = q.shift();
        var val = this.value;
        setTimeout((function(fn, val){ return function(){ fn(val); } })(fn, val), 0);
    }
}

Prom.prototype.then = function(yayFn, nayFn) {
    var prom = new Prom();
    this.yayQueue.push(function(val) {
        try {
            prom.resolve(typeof yayFn === 'function' ? yayFn(val) : val);
        } catch(e) {
            prom.reject(e);
        }
    });
    this.nayQueue.push(function(val) {
        try {
            if (typeof nayFn === 'function') {
                prom.resolve(nayFn(val));
            } else {
                prom.reject(val);
            }
        } catch (e) {
            prom.reject(e);
        }
    });
    this._runQueue();
    return prom;
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
