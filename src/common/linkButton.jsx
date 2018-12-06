import React from "react";
import { Link } from "react-router-dom";

const LinkButton = ({ className, to, label, onClick, ...rest }) => {
  return (
    <button className={className} onClick={onClick} {...rest}>
      <Link to={to} style={{ color: "white", textDecoration: "none" }}>
        {label}
      </Link>
    </button>
  );
};

export default LinkButton;
