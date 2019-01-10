import React from "react";

const SubmitButton = ({ className, onClick, label, disabled, ...rest }) => {
  return (
    <button
      {...rest}
      type="submit"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
