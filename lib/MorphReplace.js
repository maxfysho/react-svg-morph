// request animation frame

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MorphTransition = require('./MorphTransition');

var _MorphTransition2 = _interopRequireDefault(_MorphTransition);

var MorphReplace = (function (_React$Component) {
    _inherits(MorphReplace, _React$Component);

    function MorphReplace(props) {
        _classCallCheck(this, MorphReplace);

        _get(Object.getPrototypeOf(MorphReplace.prototype), 'constructor', this).call(this, props);

        this.progress = 0;
        this.state = {
            current: [],
            viewBox: props.viewBox || [0, 0, props.width, props.height].join(' ')
        };
        this.transitionElement = _MorphTransition2['default'];
    }

    _createClass(MorphReplace, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.setState({ from: this.props.children, to: this.props.children });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({ from: this.props.children, to: nextProps.children, progress: 0 });
            this.progress = 0;
            cancelAnimationFrame(this.raf);
            this.startTime = undefined;
            this.animate();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            cancelAnimationFrame(this.raf);
            // TODO
            // not sure should we call componentWillUnomunt on childrens
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this = this;

            this.raf = requestAnimationFrame(function (timePassed) {
                if (!_this.startTime) {
                    _this.startTime = timePassed;
                }
                var progress = Math.min((timePassed - _this.startTime) / _this.props.duration, 1);
                progress = Math.round(progress * 100);
                _this.setState({ progress: progress });
                if (progress >= 100) {
                    return false;
                }
                _this.animate();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(this.transitionElement, _extends({}, this.props, {
                progress: this.state.progress
            }), {
                from: _react2['default'].cloneElement(this.state.from),
                to: _react2['default'].cloneElement(this.state.to)
            });
        }
    }]);

    return MorphReplace;
})(_react2['default'].Component);

exports['default'] = MorphReplace;

MorphReplace.propTypes = {
    rotation: _propTypes2['default'].oneOf(['clockwise', 'counterclock', 'none']),
    width: _propTypes2['default'].number,
    height: _propTypes2['default'].number,
    duration: _propTypes2['default'].number,
    children: _propTypes2['default'].element,
    viewBox: _propTypes2['default'].string,
    preserveAspectRatio: function preserveAspectRatio(props, propName, componentName) {
        var regexp = /^(\s+)?(none|xMinYMin|xMidYMin|xMaxYMin|xMinYMid|xMidYMid|xMaxYMid|xMinYMax|xMidYMax|xMaxYMax)(\s+)?(meet|slice)?(\s+)?$/;
        if (!regexp.test(props[propName])) {
            return new Error('Validation failed. Invalid prop \'' + propName + '\' supplied to \'' + componentName + '\'.');
        }
    }
};

MorphReplace.defaultProps = {
    width: 40,
    height: 40,
    duration: 350,
    rotation: 'clockwise',
    preserveAspectRatio: 'xMidYMid meet'
};
module.exports = exports['default'];