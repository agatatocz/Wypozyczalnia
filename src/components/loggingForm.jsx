import React from "react";
import Joi from "joi-browser";
import Form from "./../common/form";

class LoggingForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Login"),
    password: Joi.string()
      .required()
      .label("Hasło")
  };

  doSubmit = () => {
    const { username, password } = this.state.data;
    // Przekazuję login i hasło
    var formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    fetch("http://localhost/BD2/api/3.php", {
      method: "POST",
      body: formData
    })
      //tu otrzymuję odpowiedź od serwera
      .then(response => response.json())
      .then(response => {
        let { success, accountType, firstName, lastName, userId } = response;
        let user = {
          accountType: accountType,
          firstName: firstName,
          lastName: lastName,
          userId: userId
        };
        this.props.setAppState(user);
        if (success) {
          this.props.history.replace(`/${accountType}`);
        } else {
          alert("Nie znaleziono użytkownika w bazie.");
        }
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div
        className="container"
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div className="loggingForm-div">
          <h1>Logowanie</h1>
          <form className="loggingForm">
            {this.renderInput("username", "Login")}
            {this.renderInput("password", "Hasło", "password")}
            {this.renderSubmitButton("Zaloguj")}
            {this.renderCancelButton("/")}
          </form>
        </div>
        <div className="loggingForm-icon-div">
          <i
            className="fa fa-users"
            aria-hidden="true"
            style={{ fontSize: 200 }}
          />
        </div>
      </div>
    );
  }
}

export default LoggingForm;
