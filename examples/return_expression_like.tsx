import * as React from "react";

export function ReturnExpressFragmentLike() {
  function InnerFunctionComponent() {
    return <h2></h2>;
  }

  return (
    <>
      <InnerFunctionComponent />
      <h1>Hello from typescript transformer</h1>
    </>
  );
}

export function ReturnExpressTerenaryLeftLike() {
  function InnerFunctionComponent() {
    return <h2></h2>;
  }

  return true ? (
    <div>
      <InnerFunctionComponent />
      <h1>Hello from typescript transformer</h1>
    </div>
  ) : (
    <div>Conditional Expression</div>
  );
}

export function ReturnExpressTerenaryRightLike() {
  return true ? null : <div>Conditional Expression</div>;
}

export function ReturnBinaryExpressionLike() {
  function InnerFunctionComponent() {
    return <h2></h2>;
  }

  return (
    true && (
      <div>
        <InnerFunctionComponent />
        <h1>Hello from typescript transformer</h1>
      </div>
    )
  );
}

export function ReturnExpressionClosureFunctionLike() {
  function render() {
    return true ? null : <div>Conditional Expression</div>;
  }

  return render();
}

export function ReturnExpressionClosureArrowFunctionLike() {
  const arrow_render = () => (true ? null : <div>Conditional Expression</div>);

  return arrow_render();
}
