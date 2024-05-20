import * as React from "react";

export const ForwarededRefLikeArrow = React.forwardRef(() => {
  return <h1>Hello from typescript transformer</h1>;
});

export const ForwarededRefLikeFunction = React.forwardRef(function () {
  return <h1>Hello from typescript transformer</h1>;
});
