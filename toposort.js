function toposort(nodes, edges) {
    var nodes = nodes.slice(0);
    var edges = edges.slice(0);
    var incomingEdgeIds = edges.reduce(function(p,c){
        p.indexOf(c.b) === -1 && p.push(c.b);
        return p;
    }, []);
    var nodesById = nodes.reduce(function(p,c){
        p[c.id] = c;
        return p;
    }, {});
    var L = [];
    var S = nodes.filter(function(node){
        return incomingEdgeIds.indexOf(node.id) === -1;
    });
    while (S.length) {
        var n = S.shift();
        L.push(n);
        edges = edges.reduce(function(p, edge) {
            if (edge.a === n.id) {
                var m = edge.b;
                var incoming = edges.filter(function(edgeB){
                    return edgeB.b === m && edgeB !== edge;
                });
                if (incoming.length === 0) {
                    S.push(nodesById[m]);
                }
                return p;
            }
            p.push(edge);
            return p;
        }, []);
    }
    if (edges.length > 0) {
        throw "Graph has at least once cycle";
    }
    return L;
}

if (typeof module !== 'undefined') {
    module.exports = toposort;
}
