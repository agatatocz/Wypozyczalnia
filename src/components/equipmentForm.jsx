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
      id: "",
      startDate: "",
      endDate: ""
    },
    errors: {}
  };

  schema = {
    category: Joi.string()
      .required()
      .label("Kategoria"),
    producer: Joi.any(),
    model: Joi.any(),
    id: Joi.any(),
    startDate: Joi.any(),
    endDate: Joi.any()
  };

  setError = (name, value) => {
    const errors = { ...this.state.errors };
    errors[name] = value;
    this.setState({ errors });
  };

  validateDates = () => {
    const { startDate, endDate } = this.state.data;
    const today = new Date();
    const chosenStartDate = new Date(startDate);
    const chosenEndDate = new Date(endDate);
    let properDates = false;

    //sprawdzenie czy podane daty mają sens
    if (
      (startDate ? !endDate : endDate) ||
      chosenEndDate.getTime() < today.getTime() ||
      chosenEndDate.getTime() <= chosenStartDate.getTime() ||
      (chosenStartDate.getTime() < today.getTime() &&
        !areTheSameDates(chosenStartDate, today))
    ) {
      this.setError("dates", "Błędny przedział czasowy");
    } else if (daysBetween(chosenStartDate, chosenEndDate) > 30) {
      this.setError(
        "dates",
        "Okres wypożyczenia nie może być dłuższy niż 30 dni"
      );
    } else if (daysBetween(today, chosenStartDate) > 20) {
      this.setError(
        "dates",
        "Rezerwacji można dokonać z maksymalnie 20-dniowym wyprzedzeniem"
      );
    } else properDates = true;

    if (properDates) {
      console.log("OK");
      return;
    }
  };

  doSubmit = () => {
    this.validateDates();
    //  console.log("cycyce");
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

          <div className="availability-check">
            <h6>Sprawdź dostępność:</h6>
            <div className="form-row">
              <Input
                type="date"
                name="startDate"
                label="Data początkowa"
                value={data.startDate}
                onChange={this.handleChange}
              />
              <Input
                type="date"
                name="endDate"
                label="Data końcowa"
                value={data.endDate}
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
