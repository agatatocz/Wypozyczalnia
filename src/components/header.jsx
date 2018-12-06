import React from "react";
import LinkButton from "./../common/linkButton";

const Header = props => {
  const {
    firstName,
    lastName,
    buttonLabel1,
    buttonLink1,
    onClick1,
    buttonDisplay1,
    buttonLabel2,
    buttonLink2,
    onClick2,
    buttonDisplay2
  } = props;
  let hello =
    firstName && lastName
      ? `Dzień dobry, ${firstName} ${lastName}!`
      : `Dzień dobry!`;
  return (
    <header>
      <div style={{ float: "right" }}>
        <LinkButton
          className="btn btn-outline-secondary mr-2"
          to={buttonLink1}
          label={buttonLabel1}
          onClick={onClick1}
          style={{ display: buttonDisplay1 }}
        />

        <LinkButton
          className="btn btn-outline-secondary"
          to={buttonLink2}
          label={buttonLabel2}
          onClick={onClick2}
          style={{ display: buttonDisplay2 }}
        />
      </div>
      <h1>Wypożyczalnia sprzętu górskiego</h1>
      <h2>{hello}</h2>
    </header>
  );
};

export default Header;
