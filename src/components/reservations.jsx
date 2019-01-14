import React from "react";
import Select from "../common/select";
import Form from "../common/form";
import Joi from "joi-browser";
import SubmitButton from "../common/submitButton";
import _ from "lodash";

class Reservations extends Form {
  state = {
    status: [],
    decisions: [],
    reservations: {},

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

    submitted: false,
    editForm: {
      status: "",
      decision: ""
    }
  };

  schema = {
    reservationId: Joi.string().allow(""),
    startDate: Joi.date().allow(""),
    endDate: Joi.date().allow(""),
    equipmentId: Joi.number().integer().allow(""),
    clientId: Joi.string().allow(""),
    status: Joi.string().allow(""),
    decision: Joi.string().allow(""),
    minCost: Joi.number().integer()
      .allow("")
      .label("Koszt"),
    maxCost: Joi.number().integer()
      .allow("")
      .label("Koszt")
  };

  componentDidMount() {
    fetch("http://localhost/BD2/api/6.php")
      .then(response => response.json())
      .then(response => {
        let status = Object.values(response.status);
        let decisions = Object.values(response.decisions);
        status.unshift("");
        decisions.unshift("");
        this.setState({
          status,
          decisions
        });
      })
      .catch(error => console.log(error));
  }

  //metoda odziedziczona z klasy Form - wywoływana po wciśnięciu "Szukaj"
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
        console.log("9", response);
        this.setState({ reservations: response, submitted: true });
      })
      .catch(error => console.log(error));
  };

  renderEditForm = reservation => {
    if (reservation.editing)
      return (
        <tr>
          <td colSpan="8">
            <form>
              <div className="form-row">
                <div className="col">
                  <Select
                    name="status"
                    label="Status rezerwacji"
                    onChange={this.handleChangeInEditForm}
                    values={this.state.status}
                  />
                </div>
                <div className="col">
                  <Select
                    name="decision"
                    label="Decyzja o zwrocie kaucji"
                    onChange={this.handleChangeInEditForm}
                    values={this.state.decisions}
                  />
                </div>
                <div className="col">
                  <SubmitButton
                    className="btn btn-dark"
                    onClick={e => this.handleSave(e, reservation)}
                    label="Zapisz"
                  />
                </div>
              </div>
            </form>
          </td>
        </tr>
      );
  };

  handleChangeInEditForm = e => {
    let editForm = { ...this.state.editForm };
    editForm[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ editForm });
  };

  handleEdit = reservation => {
    let reservations = { ...this.state.reservations };
    reservations[reservation.id].editing = true;
    this.setState({ reservations });
  };

  setStatusAndDecision = (reservation, status, decision) => {
    let reservations = { ...this.state.reservations };
    if (status) reservations[reservation.id].status = status;
    if (decision) reservations[reservation.id].decision = decision;
    this.setState({ reservations });
  };

  resetEditForm = () => {
    const editForm = { ...this.state.editForm };
    editForm.status = "";
    editForm.decision = "";
    this.setState({ editForm });
  };

  handleSave = (e, reservation) => {
    e.preventDefault();
    const reservations = { ...this.state.reservations };
    const editForm = { ...this.state.editForm };

    //jeśli nie wybrano nowego stausu lub decyzji, użyjemy starych
    if (_.isEmpty(editForm.status)) {
      editForm.status = reservations[reservation.id].status;
      this.setState({ editForm });
    }

    if (_.isEmpty(editForm.decision)) {
      editForm.decision = reservations[reservation.id].decision;
      this.setState({ editForm });
    }

    //optymistyczny update - najpierw zmieniam state, a potem wysyłam zapytanie do bazy
    const { status, decision } = this.state.editForm;
    this.setStatusAndDecision(reservation, status, decision);

    var formData = new FormData();
    formData.append("status", status);
    formData.append("decision", decision);
    formData.append("reservationId", reservation.id);
    fetch("http://localhost/BD2/api/8.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if (!response.success) {
          alert(
            `Ups! Wystąpił błąd - nie udało się wprowadzić zmian w rezerwacji ${
            reservation.id
            }`
          );
          this.setStatusAndDecision(
            reservation,
            response.status,
            response.decision
          );
        }
      })
      .catch(error => alert(error));

    reservations[reservation.id].editing = false;
    this.setState({ reservations });
    this.resetEditForm();
  };

  renderReservations = () => {
    const { reservations, submitted } = this.state;
    if (_.isEmpty(reservations) && submitted)
      return <h3>Żadna z rezerwacji nie spełnia podanych kryteriów.</h3>;
    else if (submitted)
      return (
        <React.Fragment>
          <h3>Rezerwacje:</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Numer rezerwacji</th>
                <th>Data Utworzenia</th>
                <th>Data początku wypożyczenia</th>
                <th>Data końca wypożyczenia</th>
                <th>ID egzemplarza sprzętu</th>
                <th>Status rezerwacji</th>
                <th>Decyzja o zwrocie kaucji</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {Object.values(reservations).map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <tr key={reservation.id}>
                    {Object.values(reservation).map((data, j) =>
                      _.isBoolean(data) ? null : <td key={j}>{data}</td>
                    )}

                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => this.handleEdit(reservation)}
                      >
                        Edytuj
                      </button>
                    </td>
                  </tr>
                  {this.renderEditForm(reservation)}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      );
  };

  render() {
    return (
      <div className="container">
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
