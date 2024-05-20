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
