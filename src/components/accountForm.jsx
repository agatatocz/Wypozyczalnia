import React from "react";
import Form from "./../common/form";
import Joi from "joi-browser";

class AccountForm extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      idNumber: "",
      street: "",
      homeNumber: "",
      town: "",
      zipCode: "",
      phoneNumber: "",
      username: "",
      password: "",
      confirmPassword: ""
    },
    errors: {}
  };

  schema = {
    firstName: Joi.string()
      .required()
      .label("Imię"),
    lastName: Joi.string()
      .required()
      .label("Nazwisko"),
    idNumber: Joi.string()
      .regex(/^[0-9]{11}$/)
      .required()
      .label("PESEL"),
    street: Joi.string()
      .required()
      .label("Ulica"),
    homeNumber: Joi.string()
      .required()
      .label("Nr domu / lokalu"),
    town: Joi.string()
      .required()
      .label("Miejscowość"),
    zipCode: Joi.string()
      .regex(/^[0-9]{2}-[0-9]{3}$/)
      .required()
      .label("Kod pocztowy"),
    phoneNumber: Joi.string()
      .regex(/^[0-9]{9}$/)
      .required()
      .label("Nr telefonu"),
    username: Joi.string()
      .required()
      .label("Login"),
    password: Joi.string()
      .required()
      .label("Password"),
    confirmPassword: Joi.string()
      .required()
      .label("Password confirmation")
    //Joi.any().valid(Joi.ref("password"))
    // .required()
    // .options({
    //   language: {
    //     any: {
    //       allowOnly: "!!Passwords do not match"
    //     }
    //   }
    // })
    // Joi.string()
    //   .valid(Joi.ref("password"))
    //   .required()
    //   .label("Password confirmation")
  };

  doSubmit = () => {
    const {
      firstName,
      lastName,
      idNumber,
      street,
      homeNumber,
      town,
      zipCode,
      phoneNumber,
      username,
      password,
      confirmPassword
    } = this.state.data;

    if (password !== confirmPassword) {
      const { errors } = this.state;
      errors.confirmPassword = "Passwords don't match";
      this.setState({ errors });
      return;
    }

    //kod tworzący konto
    let formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("idNumber", idNumber);
    formData.append("street", street);
    formData.append("homeNumber", homeNumber);
    formData.append("town", town);
    formData.append("zipCode", zipCode);
    formData.append("phoneNumber", phoneNumber);
    formData.append("username", username);
    formData.append("password", password);
    //wpisać odpowiedni adres
    fetch("http://localhost/BD2/api/4.php", {
      method: "POST",
      body: formData
    })
      //tu otrzymuję odpowiedź od serwera
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if (response.success) {
          alert("Konto zostało utworzone - możesz się zalogować.");
          console.log(response);
          this.props.history.replace(`/login`);
        } else {
          alert(response.message);
        }
      })
      .catch(error =>
        alert("Błąd połączenia, nie udało się dokonać operacji.")
      );
  };
  render() {
    return (
      <div className="container">
        <h1>Tworzenie konta</h1>
        <form className="accountForm">
          <div className="form-row">
            <div className="col">{this.renderInput("firstName", "Imię")}</div>
            <div className="col">
              {this.renderInput("lastName", "Nazwisko")}
            </div>
          </div>

          <div className="form-row">
            <div className="col">{this.renderInput("idNumber", "PESEL")}</div>
            <div className="col">{this.renderInput("street", "Ulica")}</div>
            <div className="col">
              {this.renderInput("homeNumber", "Nr domu/lokalu")}
            </div>
          </div>

          <div className="form-row">
            <div className="col">
              {this.renderInput("zipCode", "Kod pocztowy")}
            </div>
            <div className="col">{this.renderInput("town", "Miejscowość")}</div>
            <div className="col">
              {this.renderInput("phoneNumber", "Nr telefonu")}
            </div>
          </div>

          <div className="form-row">
            <div className="col">{this.renderInput("username", "Login")}</div>
            <div className="col">
              {this.renderInput("password", "Hasło", "password")}
            </div>
            <div className="col">
              {this.renderInput(
                "confirmPassword",
                "Potwierdź hasło",
                "password"
              )}
            </div>
          </div>
          {this.renderSubmitButton("Utwórz konto")}
          {this.renderCancelButton("/")}
        </form>
      </div>
    );
  }
}

export default AccountForm;
