import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import formats from './formats';

export default class CurrencyInput extends Component {
  static defaultProps = {
    onChange: () => null,
    locale: 'de-DE',
    currency: 'EUR',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    formatOnEnter: true,
    formats,
  };

  static propTypes = {
    onChange: PropTypes.func,
    locale: PropTypes.string,
    currency: PropTypes.string,
    currencyDisplay: PropTypes.string,
    minimumFractionDigits: PropTypes.number,
    maximumFractionDigits: PropTypes.number,
    formatOnEnter: PropTypes.bool,
  };

  state = {
    maskedValue: '',
    value: ''
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.formatCurrency = new Intl.NumberFormat(this.props.locale, {
      currencyDisplay: this.props.currencyDisplay,
      maximumFractionDigits: this.props.maximumFractionDigits,
      minimumFractionDigits: this.props.minimumFractionDigits,
      ...this.props.formats[this.props.currency]
    }).format;
  }

  componentDidMount() {
    if (this.props.initialValue !== null && this.props.initialValue !== undefined) {
      this.setState({
        maskedValue: this.formatCurrency(Number(this.props.initialValue))
      });
    }
  }

  normalizeInput(str) {
    const { allowedInput } = this.props.formats[this.props.currency];
    return str.replace(allowedInput, '');
  }

  normalizeValue(str) {
    return Number(str.replace(/[^0-9-]/g, ''));
  }

  parseValue(str) {
    const { centsSeperator } = this.props.formats[this.props.currency];
    return str
      .split(centsSeperator)
      .slice(0, 2)
      .join('.');
  }

  handleChange(event) {
    event.preventDefault();
    this.setState(
      {
        value: this.parseValue(`${ event.target.value }`),
        maskedValue: this.normalizeInput(event.target.value)
      },
      () => this.props.onChange({ event, ...this.state })
    );
  }

  handleBlur(event) {
    event.preventDefault();
    this.setState({
      maskedValue: this.formatCurrency(this.state.value)
    });
  }

  handleKeyPress(event) {
    const ENTER_KEY = 13;
    if (event.which === ENTER_KEY && this.props.formatOnEnter) {
      event.preventDefault();
      this.setState({
        maskedValue: this.formatCurrency(this.state.value)
      });
    } else {
      this.setState({
        maskedValue: event.target.value
      });
    }
  }

  getMaskedValue() {
    return this.state.maskedValue;
  }

  render() {
    return (
      <input
        value={this.getMaskedValue()}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onKeyUp={this.handleKeyPress}
      />
    );
  }
}
