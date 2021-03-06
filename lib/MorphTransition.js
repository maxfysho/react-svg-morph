'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utilsNormalizeSvg = require('./utils/normalizeSvg');

var _utilsNormalizeSvg2 = _interopRequireDefault(_utilsNormalizeSvg);

var _utilsMorph = require('./utils/morph');

var _reactRenderToJson = require('react-render-to-json');

var _reactRenderToJson2 = _interopRequireDefault(_reactRenderToJson);

var MorphTransition = (function (_React$Component) {
    _inherits(MorphTransition, _React$Component);

    function MorphTransition(props) {
        _classCallCheck(this, MorphTransition);

        _get(Object.getPrototypeOf(MorphTransition.prototype), 'constructor', this).call(this, props);

        this.progress = 0;
        this.state = {
            current: [],
            viewBox: props.viewBox || [0, 0, props.width, props.height].join(' ')
        };
        this.svgCache = {};
        this.reset = true;
    }

    _createClass(MorphTransition, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.update(1);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.update(nextProps.progress / 100);
        }
    }, {
        key: 'update',
        value: function update(progress) {
            this.setChildren();
            this.normalize();
            var current = (0, _utilsMorph.getProgress)(this.from, this.to, progress);
            this.setState({ current: current });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props;
            var rotation = _props.rotation;
            var duration = _props.duration;
            var progress = _props.progress;
            var easing = _props.easing;
            var viewBox = _props.viewBox;

            var otherProps = _objectWithoutProperties(_props, ['rotation', 'duration', 'progress', 'easing', 'viewBox']);

            return _react2['default'].createElement(
                'svg',
                _extends({ viewBox: this.viewBox }, otherProps),
                this.state.current.map(function (item, index) {
                    return _react2['default'].createElement('path', _extends({ d: item.path, key: index }, item.attrs, { style: item.style, transform: item.transStr }));
                })
            );
        }
    }, {
        key: 'normalize',
        value: function normalize() {
            if (!this.reset) {
                return;
            }
            this.reset = false;
            var paths = (0, _utilsMorph.normalizePaths)(this.fromSvg.paths, this.toSvg.paths, { rotation: this.props.rotation });
            this.from = paths.from;
            this.to = paths.to;
        }
    }, {
        key: 'setChild',
        value: function setChild(type, child) {
            var key = child.key;
            // it's not changed
            if (this[type + 'Child'] && key === this[type + 'Child'].key) {
                return false;
            }
            this.reset = true;
            this[type + 'Child'] = child;
            this[type + 'Svg'] = this.getSvgInfo(child);
        }
    }, {
        key: 'setChildren',
        value: function setChildren() {
            if (!this.props.children.from || !this.props.children.to) {
                throw new Error("Please provide `from` and `to` React elements");
            }

            this.setChild('from', this.props.children.from);
            this.setChild('to', this.props.children.to);
        }
    }, {
        key: 'getSvgInfo',
        value: function getSvgInfo(child) {
            var key = child.key;
            if (this.svgCache[key]) {
                return this.svgCache[key];
            }
            var json = (0, _reactRenderToJson2['default'])(child);
            var svg = (0, _utilsNormalizeSvg2['default'])(json);
            if (svg.viewBox) {
                this.viewBox = svg.viewBox;
            }
            this.svgCache[key] = svg;
            return svg;
        }
    }]);

    return MorphTransition;
})(_react2['default'].Component);

exports['default'] = MorphTransition;

MorphTransition.propTypes = {
    rotation: _propTypes2['default'].oneOf(['clockwise', 'counterclock', 'none']),
    width: _propTypes2['default'].number,
    height: _propTypes2['default'].number,
    duration: _propTypes2['default'].number,
    progress: _propTypes2['default'].number,
    children: _propTypes2['default'].object,
    viewBox: _propTypes2['default'].string,
    preserveAspectRatio: function preserveAspectRatio(props, propName, componentName) {
        var regexp = /^(\s+)?(none|xMinYMin|xMidYMin|xMaxYMin|xMinYMid|xMidYMid|xMaxYMid|xMinYMax|xMidYMax|xMaxYMax)(\s+)?(meet|slice)?(\s+)?$/;
        if (!regexp.test(props[propName])) {
            return new Error('Validation failed. Invalid prop \'' + propName + '\' supplied to \'' + componentName + '\'.');
        }
    }
};

MorphTransition.defaultProps = {
    width: 40,
    height: 40,
    duration: 350,
    rotation: 'clockwise',
    progress: 0,
    preserveAspectRatio: 'xMidYMid meet',
    easing: function easing(t) {
        return t;
    }
};
module.exports = exports['default'];