# ts-transform-react-display-name

Typescript [transformer](https://github.com/itsdouges/typescript-transformer-handbook) plugin for appending [display name](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md) property to React Components.

Works with [tspc](https://github.com/nonara/ts-patch), [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader#getcustomtransformers-string--program-tsprogram--tscustomtransformers--undefined-defaultundefined), [ts-loader](https://github.com/TypeStrong/ts-loader#getcustomtransformers), (until typescript comes up with built in [support](https://github.com/microsoft/TypeScript/issues/54276)).

## Supports

- [Arrow function components](https://github.com/Viijay-Kr/ts-transform-react-display-name/blob/main/examples/arrow_functions.tsx)
- [Normal function components](https://github.com/Viijay-Kr/ts-transform-react-display-name/blob/main/examples/function_components.tsx)
- [Forward ref components](https://github.com/Viijay-Kr/ts-transform-react-display-name/blob/main/examples/forwardref_like.tsx)
- [Memoized components](https://github.com/Viijay-Kr/ts-transform-react-display-name/blob/main/examples/memo_like.tsx)
- [Return Expression Variations](https://github.com/Viijay-Kr/ts-transform-react-display-name/blob/main/examples/return_expression_like.tsx)

## Usage

### Prerequisites

`npm install tspc ts-transform-react-display-name -D`

### TS Config

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "ts-transform-react-display-name",
        "prefix": "YOUR_PREFERRED_PREFIX"
      }
    ]
  }
}
```

### Run

Run `tspc` instead of `tsc`. The emitted files should be transformed with display name property

## Example

### Input

```tsx
// Component.tsx
import * as React from "react";

export const ArrowComponent = () => {
  const InnerArrowComponent: React.FC = () => <h2></h2>;

  return (
    <>
      <InnerArrowComponent />
      <h1>Hello from typescript transformer</h1>
    </>
  );
};

export const ArrowComponentSpan = () => {
  return <h1>Hello from typescript transformer</h1>;
};
```

### Output

```js
...
ArrowComponent.displayName = "TSTransform_ArrowComponent";
ArrowComponentSpan.displayName = "TSTransform_ArrowComponentSpan";
```

### Contributing

install dependencies:

```bash
bun install
```

To run:

```bash
bun run build:examples
```

To build Library:

```bash
bun run build
```
