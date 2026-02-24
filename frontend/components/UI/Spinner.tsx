import React from "react";

type SpinnerProps = {
  size?: number;
  color?: string;
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "border-blue-500",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-gray-200 ${color}`}
      style={{
        width: size,
        height: size,
        borderTopColor: "transparent",
      }}
    />
  );
};

export default Spinner;
