var $canvas = window.canvas;
var ctx = $canvas.getContext('2d');
var width = document.body.clientWidth;
var height = document.body.clientHeight;
$canvas.width = width;
$canvas.height = height;

function logger(fn) {
    return function() {
        console.log(arguments);
        return fn.apply(this, arguments);
    }
}

ctx.moveTo = logger(ctx.moveTo).bind(ctx);
ctx.lineTo = logger(ctx.lineTo).bind(ctx);

var tile = {
    width: 100,
    height: 100,
    center: { x: 50, y: 50 }
};

tile.unit = tile.width / 10;

function promiseArc(letter) {
    var x = tile.center.x,
        y = tile.center.y,
        r = tile.unit * 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 360);
    ctx.stroke();
    ctx.closePath();
    ctx.font = (tile.unit * 4) + "px arial";
    ctx.textAlign = "center";
    ctx.fillText(letter, x, y + (tile.unit*1.4));
}

var tiles = {
    promise: {
        pending: function(){
            promiseArc("?");
        },
        fulfilled: function(){
            promiseArc("F");
        },
        rejected: function(){
            promiseArc("R");
        },
    },
    thenable: {
        pending: function() {
            ctx.beginPath();
            ctx.arc(tile.center.x-tile.unit, tile.center.y, tile.unit, 0, 360);
            ctx.moveTo(tile.center.x+(tile.unit*2), tile.center.y);
            ctx.arc(tile.center.x+tile.unit, tile.center.y, tile.unit, 0, 360);
            ctx.stroke();
            ctx.closePath();
            ctx.font = (tile.unit) + "px arial";
            ctx.textAlign = "center";
            ctx.fillText("THEN", tile.center.x, tile.unit*3);
        }
    },
    edge: {
        fromRight: function() {
            ctx.beginPath();
            ctx.moveTo(tile.width-tile.unit, tile.center.y);
            ctx.lineTo(tile.width, tile.center.y);
            ctx.stroke();
            ctx.closePath();
        },
        toLeft: function() {
            ctx.beginPath();
            ctx.moveTo(0, tile.center.y);
            ctx.lineTo(tile.unit, tile.center.y);
            ctx.lineTo(0, tile.center.y-tile.unit);
            ctx.moveTo(tile.unit, tile.center.y);
            ctx.lineTo(0, tile.center.y+tile.unit);
            ctx.stroke();
            ctx.closePath();
        },
        fromTopRight: function() {
            ctx.beginPath();
            ctx.moveTo(tile.width-(tile.unit*2), tile.unit*2);
            ctx.lineTo(tile.width, 0);
            ctx.stroke();
            ctx.closePath();
        },
        toBottomLeft: function() {
            ctx.beginPath();
            ctx.moveTo(0, tile.height);
            ctx.lineTo(tile.unit*2, tile.height-(tile.unit*2));
            ctx.lineTo(tile.unit*0.5, tile.height-(tile.unit*2));
            ctx.moveTo(tile.unit*2, tile.height-(tile.unit*2));
            ctx.lineTo(tile.unit*2, tile.height-(tile.unit*0.5));
            ctx.stroke();
            ctx.closePath();
        }
    }
};

function renderTileCatalog() {
    ctx.lineWidth = 1;
    ctx.translate(0.5, tile.height+0.5);
    tiles.edge.fromRight();
    ctx.translate(tile.width, 0);
    tiles.promise.fulfilled();
    tiles.edge.toLeft();
    tiles.edge.fromRight();
    ctx.translate(tile.width, 0);
    tiles.promise.pending();
    tiles.edge.toLeft();
    tiles.edge.fromTopRight();
    ctx.translate(tile.width, -tile.height);
    tiles.thenable.pending();
    tiles.edge.toBottomLeft();
}

renderTileCatalog();
