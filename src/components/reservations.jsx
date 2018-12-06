import React, { Component } from "react";
import Select from "../common/select";
import Form from "./../common/form";
import Joi from "joi-browser";

class Reservations extends Form {
  state = {
    // reservationIds: ["e3", "f4", "g5", "h6"],
    // equipmentIds: ["e3", "f4", "g5", "h6"],
    // clientIds: ["e3", "f4", "g5", "h6"],
    status: [],
    decisions: [],

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
    errors: {},
    reservations: [],
    submitted: false
  };

  schema = {
    reservationId: Joi.string().allow(""),
    startDate: Joi.date().allow(""),
    endDate: Joi.date().allow(""),
    equipmentId: Joi.string().allow(""),
    clientId: Joi.string().allow(""),
    status: Joi.string().allow(""),
    decision: Joi.string().allow(""),
    minCost: Joi.number()
      .allow("")
      .label("Koszt"),
    maxCost: Joi.number()
      .allow("")
      .label("Koszt")
  };

  componentWillMount() {
    fetch("http://localhost/php1/api/myReservations.php")
      .then(response => response.json())
      .then(response => {
        //   let reservationIds = Object.values(response.reservationIds);
        //   let equipmentIds = Object.values(response.equipmentIds);
        //   let clientIds = Object.values(response.clientIds);
        let status = Object.values(response.status);
        let decisions = Object.values(response.decisions);
        status.unshift("");
        decisions.unshift("");
        this.setState({
          //    reservationIds,
          //     equipmentIds,
          //     clientIds,
          status,
          decisions
        });
      })
      .catch(error => console.log(error));
  }

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

    var formData = new FormData();
    formData.append("reservationId", reservationId);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("equipmentId", equipmentId);
    formData.append("clientId", clientId);
    formData.append("status", status);
    formData.append("decision", decision);
    formData.append("minCost", minCost);
    formData.append("maxCost", maxCost);
    fetch("http://localhost/php1/api/myReservations.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        let reservations = [];

        Object.values(response).forEach(reservation => {
          reservations.push(Object.values(reservation));
        });

        this.setState({ reservations, submitted: true });
      })
      .catch(error => console.log(error));
  };

  //   renderDataLists = () => {
  //     const { reservationIds, equipmentIds, clientIds } = this.state;
  //     return (
  //       <React.Fragment>
  //         <datalist id="reservationIdList">
  //           {reservationIds.map((id, i) => (
  //             <option value={id} key={i} />
  //           ))}
  //         </datalist>
  //         <datalist id="equipmentIdList">
  //           {equipmentIds.map((id, i) => (
  //             <option value={id} key={i} />
  //           ))}
  //         </datalist>
  //         <datalist id="clientIdList">
  //           {clientIds.map((id, i) => (
  //             <option value={id} key={i} />
  //           ))}
  //         </datalist>
  //       </React.Fragment>
  //     );
  //   };

  renderReservations = () => {
    const { reservations, submitted } = this.state;
    if (!reservations.length && submitted)
      return <h3>Żadna z rezerwacji nie spełnia podanych kryteriów.</h3>;
    else if (reservations.length)
      return (
        <React.Fragment>
          <h3>Rezerwacje:</h3>
          <table>
            <thead>
              <tr>
                <th>Data Utworzenia</th>
                <th>Data początku wypożyczenia</th>
                <th>Data końca wypożyczenia</th>
                <th>ID egzemplarza sprzętu</th>
                <th>Status rezerwacji</th>
                <th>Decyzja o zwrocie kaucji</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, i) => (
                <tr key={i}>
                  {reservation.map((data, i) => (
                    <td key={i}>{data}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      );
  };

  render() {
    return (
      <div className="container">
        {/*this.renderDataLists()*/}
        <h3>Przeglądanie katalogu rezerwacji</h3>
        <form>
          <h6>Wybierz filtry:</h6>
          <div className="form-row">
            <div className="col">
              {this.renderInput(
                "reservationId",
                "ID rezerwacji",
                "text" //, "", "reservationIdList"
              )}
            </div>
            <div className="col">
              {this.renderInput(
                "startDate",
                "Data początku rezerwacji",
                "date"
              )}
            </div>
            <div className="col">
              {this.renderInput("endDate", "Data końca rezerwacji", "date")}
            </div>
            <div className="col">
              {this.renderInput(
                "equipmentId",
                "ID egzemplarza sprzętu",
                "text" //, "", "equipmentIdList"
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="col">
              {this.renderInput(
                "clientId",
                "ID klienta",
                "text" //,"", "clientIdList"
              )}
            </div>
            <div className="col">
              <Select
                name="status"
                label="Status rezerwacji"
                values={this.state.status}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <Select
                name="decision"
                label="Decyzja o zwrocie kaucji"
                values={this.state.decisions}
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
        <br />
        {this.renderReservations()}
      </div>
    );
  }
}

export default Reservations;
