module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  'rules': {        // allow paren-less arrow functions    
    'arrow-parens': 0,        // allow async-await   
    'generator-star-spacing': 0,        // allow debugger during development  
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-tabs': 0,
    'no-mixed-spaces-and-tabs': 0,
    'indent': ["off", "tab"],
    'no-unused-vars': 0,
    'no-trailing-spaces': 0,
    "eqeqeq": 0
  }




}
