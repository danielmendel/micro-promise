var data = [
    {
        nodes: [
            { id: 1, state: "PENDING", value: undefined },
            { id: 2, state: "PENDING", value: undefined },
        ],
        edges: [
            { a: 1, b: 2, type: "THEN", handlers: [true, false] },
        ]
    }
];

function mapByKey(arr, key) {
    return arr.reduce(function(p,c){
        p[c[key]] = c;
        return p;
    }, {});
}

function mapByKeyMulti(arr, key) {
    return arr.reduce(function(p,c){
        p = [c[key]] || [];
        p[c[key]].push(c);
        return p;
    }, {});
}

function render(data) {
    data = data[0];
    nodeById = mapByKey(data.nodes, 'id');
    edgesByA = mapByKeyMulti(data.edges, 'a');
    edgesByB = mapByKeyMulti(data.edges, 'b');

    data.nodes.forEach(function(node){
        
    });
    data.edges.forEach(function(edge){
        var a = nodeById[edge.a];
        var b = nodeById[edge.b];
    });
}
