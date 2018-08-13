import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class Amount extends Component {
  static defaultProps = {
    onChange: () => null,
    locale: "de-DE",
    currency: "EUR",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    formats: {
      EUR: {
        centsSeperator: ",",
        style: "currency",
        currency: "EUR",
        allowedInput: /[^0-9-,]/g
      },
      GBP: {
        centsSeperator: ".",
        allowedInput: /[^0-9-.]/g,
        style: "currency",
        currency: "GBP"
      }
    }
  };

  state = {
    maskedValue: "0",
    value: ""
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

  normalizeInput(str) {
    const { allowedInput } = this.props.formats[this.props.currency];
    return str.replace(allowedInput, "");
  }

  normalizeValue(str) {
    return Number(str.replace(/[^0-9-]/g, ""));
  }

  parseValue(str) {
    const { centsSeperator } = this.props.formats[this.props.currency];
    console.log(
      str
        .split(centsSeperator)
        .slice(0, 2)
        .join(".")
    );
    // allow only one comma, ignore the rest
    return str
      .split(centsSeperator)
      .slice(0, 2)
      .join(".");
  }

  handleChange(event) {
    event.preventDefault();
    this.setState(
      {
        value: this.parseValue(`${event.target.value}`),
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
    if (event.which === ENTER_KEY) {
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

ReactDOM.render(
  <Amount locale="de-DE" currency="EUR" currencyDisplay="symbol" />,
  document.getElementById("euro1")
);
ReactDOM.render(
  <Amount locale="de-DE" currency="EUR" currencyDisplay="code" />,
  document.getElementById("euro2")
);

ReactDOM.render(
  <Amount locale="en-uk" currency="GBP" currencyDisplay="symbol" />,
  document.getElementById("gbp1")
);
ReactDOM.render(
  <Amount locale="en-uk" currency="GBP" currencyDisplay="code" />,
  document.getElementById("gbp2")
);
