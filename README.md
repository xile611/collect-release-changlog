# collect-release-changlog

## Usage

The following parameters are supported

| name      | description                               | required |
| --------- | ----------------------------------------- | -------- |
| token     | the token of GitHub                       | true     |
| folder    | The folder of changelog                   | false    |
| langs     | the langs of changelog                    | false    |
| file_name | the filename to update changelog Markdown | false    |
| tag_name  | the tag name of release                   | false    |

## development

- Install the dependencies

```bash
npm install
```

- Package the TypeScript for distribution

```bash
npm run bundle
```

- Run the tests

```bash
$ npm test

PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

- format and test and build the action

  ```bash
  npm run all
  ```
