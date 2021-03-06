'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.readAttrs = readAttrs;
exports.parseStyles = parseStyles;
exports.readStyles = readStyles;
exports.getAllChildren = getAllChildren;
exports.getPathAttributes = getPathAttributes;
exports['default'] = findSvgRoot;
exports['default'] = extractSvgPaths;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _pathConverter = require('./pathConverter');

var PathConverter = _interopRequireWildcard(_pathConverter);

function readAttrs(node) {
    var attrs = {};
    if (!node.attributes) {
        return attrs;
    }
    Object.keys(node.attributes).forEach(function (_key) {
        var val = node.attributes[_key];
        var key = _key.toLowerCase();
        switch (key) {
            case 'fill':
            case 'fill-opacity':
            case 'opacity':
            case 'stroke':
            case 'stroke-opacity':
            case 'stroke-width':
                attrs[key] = val;
        }
    });
    return attrs;
}

function parseStyles(styleString) {
    if (!styleString) {
        return [];
    }
    if (typeof styleString === "object") {
        return Object.keys(styleString).map(function (key) {
            return {
                prop: key,
                val: styleString[key]
            };
        });
    }
    return styleString.split(';').map(function (declaration) {
        var _declaration$split$map = declaration.split(':').map(function (p) {
            return p.replace(' ', '');
        });

        var _declaration$split$map2 = _slicedToArray(_declaration$split$map, 2);

        var prop = _declaration$split$map2[0];
        var val = _declaration$split$map2[1];

        return {
            prop: prop,
            val: val
        };
    });
}

function readStyles(node) {
    var style = {};
    if (!node.attributes || !node.attributes.style) {
        return {};
    }
    parseStyles(node.attributes.style).forEach(function (_ref) {
        var val = _ref.val;
        var key = _ref.key;

        switch (key) {
            case 'fill':
            case 'fill-opacity':
            case 'opacity':
            case 'stroke':
            case 'stroke-opacity':
            case 'stroke-width':
                style[key] = val;
        }
    });
    return style;
}

function getAllChildren(node) {
    var i = 0;
    var els = [];
    if (!node.children) {
        return els;
    }
    var len = node.children.length;
    for (; i < len; i++) {
        if (!node.children[i]) continue;
        var el = node.children[i];
        els.push(el);
        if (el.children && el.children.filter(Boolean).length > 0) {
            els = els.concat(getAllChildren(el));
        }
    }

    return els;
}

function getPathAttributes(node, defaultItem) {
    var item = _extends({
        trans: {
            rotate: [360, 12, 12]
        },
        transStr: 'rotate(360 12 12)'
    }, defaultItem);

    if (!node || !node.name) {
        return false;
    }

    var nodeName = node.name.toUpperCase();
    switch (nodeName) {
        case 'PATH':
            item.path = node.attributes.d;
            break;
        case 'CIRCLE':
            item.path = PathConverter.fromCircle(node.attributes);
            break;
        case 'ELLIPSE':
            item.path = PathConverter.fromEllipse(node.attributes);
            break;
        case 'RECT':
            item.path = PathConverter.fromRect(node.attributes);
            break;
        case 'POLYGON':
            item.path = PathConverter.fromPolygon(node.attributes);
            break;
        case 'LINE':
            item.path = PathConverter.fromLine(node.attributes);
            break;
        default:
            return false;
    }
    var attrs = readAttrs(node);
    var style = readStyles(node);
    item.attrs = _extends({}, item.attrs, attrs);
    item.style = _extends({}, item.style, style);
    return item;
}

function findSvgRoot(node) {
    if (!node || !node.name || node.name.toUpperCase() !== "SVG") {
        return node.children.find(function (child) {
            return findSvgRoot(child);
        });
    }

    return node;
}

function extractSvgPaths(root) {
    var svgRoot = findSvgRoot(root);
    var children = getAllChildren(svgRoot);
    var svg = _extends({}, svgRoot.attributes);
    var rootAttr = readAttrs(svgRoot);
    var rootStyles = readStyles(svgRoot);

    svg.paths = [];
    children.forEach(function (child) {

        var item = getPathAttributes(child, {
            attrs: _extends({}, rootAttr, readAttrs(child)),
            styles: _extends({}, rootStyles, readStyles(child))
        });
        if (item) {
            svg.paths.push(item);
        }
    });

    return svg;
}