import React from "react";

const SubmitButton = ({ className, onClick, label, disabled }) => {
  return (
    <button
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
