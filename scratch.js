var Prom = require('./take2');
/* var p = new Prom();
p.then(function(){
    console.log("a");
});
p.then(function(){
    console.log("b");
});
console.log(p);
setTimeout(function(){
    console.log(p);
    p.resolve("hi");
}, 100);
*/
/*
var p = new Prom();
p.reject(10);
p.then(function(){}, null).then(null, function(){
    console.log("THIS SHOULD FIRE");
});

var c = new Prom();
c.resolve("foo");
c.then(function(){
    console.log("1");
    c.then(function(){
        console.log("3");
    });
    console.log("2");
});

*/

/*
var p = new Prom();
var s = new Prom();
p.resolve("foo");
p.then(function(){
    return s;
}).then(null, function(r){
    console.log(r);
});

s.reject("butts");
*/

/* var p = new Prom(function(r){
    r(new Prom(function(r) {
        throw "fuck";
        r(new Prom(function(r) {
            r("foo");
        }));
    }));
}).then(console.log, console.log);
*/

/*
var p = new Prom();
var x = new Prom();
var y = new Prom();
p.then(console.log);
p.resolve(x);
x.resolve(y);
y.resolve(null);
*/

var p = new Prom();
var x = new Prom();
var y = new Prom();
var z = new Prom();
z.resolve(100);
p.then(console.log);
p.resolve(x);
x.resolve(y);
y.resolve({
    then: r => setTimeout(() => r(z), 10)
});
