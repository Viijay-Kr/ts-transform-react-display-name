import * as React from "react";

export const MemoizedArrowLike = React.memo(() => {
  return <h1>Hello from typescript transformer</h1>;
});

export const MemoizedFunctionLike = React.memo(function () {
  return <h1>Hello from typescript transformer</h1>;
});
