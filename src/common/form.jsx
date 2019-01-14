import React, { Component } from "react";
import Joi from "joi-browser";
import SubmitButton from "./../common/submitButton";
import Input from "../common/input";
import LinkButton from "./../common/linkButton";

/*
    Interfejs formularza.
    Klasa, która po nim dziedziczy musi posiadać
     - w state: 
        obiekt "data" do przechowywania danych pobranych z formularza,
        obiekt "errors" do przechowywanie komunikatów błędów wynikających z walidacji wpisanych danych,
    - poza state:
        obiekt "schema" zawierający reguły walidacji Joi dla poszczególnych pól obiektu "data",
    - metodę "doSubmit()" wykonującą kod po kliknięciu w submit button,
    - metodę render

*/
class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate() {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    error.details.map(item => (errors[item.path[0]] = item.message));
    return errors;
  }

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({
      data,
      errors
    });
  };

  renderSubmitButton = label => {
    return (
      <SubmitButton
        className="btn btn-dark mr-2"
        onClick={this.handleSubmit}
        label={label}
        disabled={this.validate()}
      />
    );
  };

  renderCancelButton = link => {
    return (
      <LinkButton className="btn btn-secondary" to={link} label="Anuluj" />
    );
  };

  renderInput = (name, label, type = "text", placeholder = "", list = "") => {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
        placeholder={placeholder}
        list={list}
      />
    );
  };
}

export default Form;
