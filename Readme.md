# 40Q CLI

## Installation
```
yarn global add @40q/40q-cli
```
or
```
npm install -g @40q/40q-cli
```

## Commands

### Setup
Setup is intended to scaffold tools configurations.

```
40q setup [tool]
```

Supported Tools:
* eslint

### Codegen
Codegen generates code for you.

```
40q codegen [type] [template]
```

Supported Types:
* block: generates code for Gutenberg blocks

Templates are optional, if empty, it creates an example boilerplate for a Gutenberg block.

For supported templates, run: `40q codegen block --help`
