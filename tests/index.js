import React from 'react';
import { mount } from 'enzyme';
import CurrencyInput from '../src';

const formatWhiteSpace = value => value.replace(/\s/g, ' ');

describe('CurrencyInput', () => {
  it('it should not display an initial value if not provided', () => {
    const wrapper = mount(<CurrencyInput />);
    expect(wrapper.find('input').text()).toEqual('');
  });

  it('should display the initial value formated', () => {
    const wrapper = mount(<CurrencyInput initialValue={100} />);
    const value = formatWhiteSpace(wrapper.find('input').props().value);
    expect(value).toBe('EUR 100.00');
  });

  it('should display the initial value formated', () => {
    const wrapper = mount(
      <CurrencyInput
        initialValue={100}
        currencyDisplay="symbol"
        currency="USD"
        locale="en-US" />
    );
    const value = formatWhiteSpace(wrapper.find('input').props().value);
    expect(value).toBe('$100.00');
  });
});
