import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import Select from "../../common/select";

class ReservationsForm extends Form {
  state = {
    data: {
      reservationId: "",
      startDate: "",
      endDate: "",
      equipmentId: "",
      clientId: "",
      status: "",
      decision: "",
      minCost: "",
      maxCost: ""
    },
    errors: {}
  };

  schema = {
    reservationId: Joi.number()
      .integer()
      .allow("")
      .label("ID rezerwacji"),
    startDate: Joi.date().allow(""),
    endDate: Joi.date().allow(""),
    equipmentId: Joi.number()
      .integer()
      .allow("")
      .label("ID egzemplarza"),
    clientId: Joi.string()
      .allow("")
      .label("ID klienta"),
    status: Joi.string().allow(""),
    decision: Joi.string().allow(""),
    minCost: Joi.number()
      .integer()
      .allow("")
      .label("Koszt"),
    maxCost: Joi.number()
      .integer()
      .allow("")
      .label("Koszt")
  };

  doSubmit = () => {
    const {
      reservationId,
      startDate,
      endDate,
      equipmentId,
      clientId,
      status,
      decision,
      minCost,
      maxCost
    } = this.state.data;

    const formData = new FormData();
    formData.append("reservationId", reservationId);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("equipmentId", equipmentId);
    formData.append("clientId", clientId);
    formData.append("status", status);
    formData.append("decision", decision);
    formData.append("minCost", minCost);
    formData.append("maxCost", maxCost);

    fetch("http://localhost/BD2/api/9.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        this.props.setReservations(response);
        this.props.setSubmitted(true);
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <React.Fragment>
        <h3>Przeglądanie katalogu rezerwacji</h3>
        <form>
          <h6>Wybierz filtry:</h6>
          <div className="form-row">
            <div className="col">
              {this.renderInput("reservationId", "ID rezerwacji", "text")}
            </div>
            <div className="col">
              {this.renderInput(
                "startDate",
                "Data początku wypożyczenia",
                "date"
              )}
            </div>
            <div className="col">
              {this.renderInput("endDate", "Data końca wypożyczenia", "date")}
            </div>
            <div className="col">
              {this.renderInput(
                "equipmentId",
                "ID egzemplarza sprzętu",
                "text"
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="col">
              {this.renderInput("clientId", "ID klienta", "text")}
            </div>
            <div className="col">
              <Select
                name="status"
                label="Status rezerwacji"
                values={this.props.status}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <Select
                name="decision"
                label="Decyzja o zwrocie kaucji"
                values={this.props.decisions}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <p className="form-p">Koszt wypożyczenia</p>
          <div className="form-row">
            <div className="col">
              {this.renderInput("minCost", "", "text", "od", "")}
            </div>
            <div className="col">
              {this.renderInput("maxCost", "", "text", "do", "")}
            </div>
            <div className="col-8" />
          </div>

          {this.renderSubmitButton("Szukaj")}
        </form>
      </React.Fragment>
    );
  }
}

export default ReservationsForm;
