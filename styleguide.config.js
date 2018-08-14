const path = require('path');

module.exports = {
  require: [
    'babel-polyfill',
    path.join(__dirname, 'styleguide/styles.css')
  ],
  components: 'src/index.js',
  exampleMode: 'expand',
  usageMode: 'expand',
  title: 'CurrencyInput',
  styleguideDir: path.join(__dirname, '/docs'),
  ribbon: {
    // Link to open on the ribbon click (required)
    url: 'https://github.com/AvraamMavridis/currency-input',
    // Text to show on the ribbon (optional)
    text: 'Fork me on GitHub'
  },
  showSidebar: false,
  theme: {
    color: {
      base: '#BE3C3A',
      light: '#BE3C3A',
      lightest: '#BE3C3A',
      ribbonBackground: '#BE3C3A',
      link: '#BE3C3A',
      linkHover: '#4BAE97',
      baseBackground: '#F3F4E4',
      border: '#4BAE97'
    }
  },
  editorConfig: {
    theme: 'dracula',
  }
};
