module.exports = {
    env: {
        "browser": true,
        "es6": true,
        "node": true,
        "jest/globals": true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        "ecmaVersion": 2015,
    },
    plugins: [
        '@typescript-eslint',
        "jest",
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:jest/recommended"
    ],
    root: true,
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },
    overrides: [
        {
          "files": [ "tests/**/*.?s", "tests/**/*.?s" ],
          "rules": {
            "sno-empty-function":  "off",
            "@typescript-eslint/no-empty-function":  "off",
          }
        }
    ]
};