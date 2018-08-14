import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formats from './formats';

/**
 * CurrencyInput component
 *
 * Current limitations:
 *
 * - User is not allowed to type thousands seperator in
 * the selected currency (comma or dot, depends on the locale/currency)
 * - Negative values are not allowed (Work in progress)
 * @export CurrencyInput
 * @class CurrencyInput
 * @extends {Component}
 */
export default class CurrencyInput extends Component {
  static defaultProps = {
    className: '',
    currency: 'EUR',
    currencyDisplay: 'code',
    formatOnEnter: true,
    formats,
    locale: 'de-DE',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    onChange: () => null
  };

  static propTypes = {
    /** A css class to apply on the input */
    className: PropTypes.string,

    /**
     * The currency to use in currency formatting.
     * Possible values are the ISO 4217 currency codes,
     * such as "USD" for the US dollar, "EUR" for the euro
     */
    currency: PropTypes.string,

    /**
     * How to display the currency in currency formatting.
     * Possible values are "symbol" to use a localized currency symbol
     * such as €, "code" to use the ISO currency code, "name"
     * to use a localized currency name such as "dollar".
     */
    currencyDisplay: PropTypes.oneOf([ 'code', 'symbol', 'name' ]),

    /** If true it formats the input when the Enter button is pressed */
    formatOnEnter: PropTypes.bool,

    /** @ignore */
    formats: PropTypes.object,
    initialValue: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),

    /** A string with a BCP 47 language tag */
    locale: PropTypes.string,

    /** The maximum number of digits after the decimal separator. */
    maximumFractionDigits: PropTypes.number,

    /** The minimum number of digits after the decimal separator. */
    minimumFractionDigits: PropTypes.number,

    /**
     * Gets called when the user types on the input field
     *
     * @param {SyntheticEvent} event The react `SyntheticEvent`
     * @param {number} value The value of the input
     * @param {string} maskedValue The value of the input with currency and seperators
     */
    onChange: PropTypes.func
  };

  state = {
    maskedValue: '',
    value: ''
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.formatCurrency = new Intl.NumberFormat(this.props.locale, {
      ...this.props.formats[this.props.currency],
      currencyDisplay: this.props.currencyDisplay,
      maximumFractionDigits: this.props.maximumFractionDigits,
      minimumFractionDigits: this.props.minimumFractionDigits
    }).format;
  }

  componentDidMount() {
    if (this.props.initialValue !== null && this.props.initialValue !== undefined) {
      this.setState({
        maskedValue: this.formatCurrency(Number(this.props.initialValue))
      });
    }
  }

  /**
   * Prevent user from typing non-allowed characters
   *
   * @param {string} str
   * @returns {string}
   */
  ignoreCharacters(str) {
    const { allowedInput } = this.props.formats[this.props.currency];
    return str.replace(allowedInput, '');
  }

  /**
   * Parse input value, ignore more than one centsSeperator
   *
   * @param {string} str
   * @returns {string}
   */
  parseValue(str) {
    const { centsSeperator } = this.props.formats[this.props.currency];
    return str
      .split(centsSeperator)
      .map(value => value.replace(/[^0-9]/g, ''))
      .slice(0, 2) // in case the user types more than one centsSeperator, ignore it
      .join('.');
  }

  /**
   * Handle onChange event
   *
   * @param {SyntheticEvent} event The react `SyntheticEvent`
   */
  handleChange(event) {
    event.preventDefault();
    const value = this.parseValue(`${ event.target.value }`);
    const maskedValue = this.ignoreCharacters(event.target.value);
    this.setState(
      {
        value,
        maskedValue
      },
      () => this.props.onChange(event, value, maskedValue)
    );
  }

  /**
   * Handle onBlur event
   *
   * @param {SyntheticEvent} event The react `SyntheticEvent`
   */
  handleBlur(event) {
    event.preventDefault();
    this.setState({
      maskedValue: this.formatCurrency(this.state.value)
    });
  }

  /**
   * Handle onKeyUp event
   *
   * @param {SyntheticEvent} event The react `SyntheticEvent`
   */
  handleKeyUp(event) {
    event.preventDefault();
    const ENTER_KEY = 13;

    if (event.which === ENTER_KEY && this.props.formatOnEnter) {
      this.setState({
        maskedValue: this.formatCurrency(this.state.value)
      });
    } else {
      this.setState({
        maskedValue: event.target.value
      });
    }
  }

  /**
   * Return the masked value
   *
   * @returns {string}
   */
  getMaskedValue() {
    return this.state.maskedValue;
  }

  /**
   * Render component
   *
   * @returns {JSX.Element}
   */
  render() {
    return (
      <input
        className={this.props.className}
        value={this.getMaskedValue()}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onKeyUp={this.handleKeyUp}
      />
    );
  }
}
