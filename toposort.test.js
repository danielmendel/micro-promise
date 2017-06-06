var toposort = require('./toposort');
var data = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
];

var edges = [
    { a: 0, b: 1 },
    { a: 2, b: 4 },
    { a: 2, b: 6 },
    { a: 3, b: 5 },
    { a: 5, b: 6 },
];

var topo = toposort(data, edges).map(c => c.id);
