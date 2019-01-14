import React from "react";
import Form from "./../common/form";
import Joi from "joi-browser";
import Input from "../common/input";
import Select from "../common/select";
import SubmitButton from "./../common/submitButton";
import { daysBetween, areTheSameDates } from "../common/myUtilityFuncs";

class EquipmentForm extends Form {
  state = {
    data: {
      category: "",
      producer: "",
      model: "",
      id: ""
    },
    errors: {}
  };

  schema = {
    category: Joi.string()
      .required()
      .label("Kategoria"),
    producer: Joi.any(),
    model: Joi.any(),
    id: Joi.any()
  };

  doSubmit = () => {
    const { category, producer, model, id } = this.state.data;
    let formData = new FormData();
    formData.append("category", category);
    formData.append("producer", producer);
    formData.append("model", model);
    formData.append("id", id);

    fetch("http://localhost/BD2/api/2.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.props.setEquipmentList(response);
        this.props.setSubmitted(true);
      })
      .catch(error => console.log(error));

  };

  render() {
    const { data } = this.state;
    return (
      <div className="container">
        <h3>Przeglądanie katalogu sprzętu</h3>

        <form className="searchForm">
          <h6>Wybierz filtry:</h6>
          <div className="form-row">
            <div className="col">
              <Select
                name="category"
                label="Kategoria"
                values={this.props.categories}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <Select
                name="producer"
                label="Producent"
                values={this.props.producers}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <Select
                name="model"
                label="Model"
                values={this.props.models}
                onChange={this.handleChange}
              />
            </div>

            <div className="col">
              <Input
                type="text"
                name="id"
                label="ID"
                value={data.id}
                onChange={this.handleChange}
              />
            </div>
          </div>

          <SubmitButton
            className="btn btn-dark"
            onClick={this.handleSubmit}
            label="Szukaj"
          />
        </form>
        {this.state.errors && (
          <p style={{ color: "red", textAlign: "center" }}>
            {Object.values(this.state.errors)[0]}
          </p>
        )}
      </div>
    );
  }
}

export default EquipmentForm;
