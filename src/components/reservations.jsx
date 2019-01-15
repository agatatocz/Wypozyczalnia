import React, { Component } from "react";
import _ from "lodash";
import ReservationsForm from "./reservationsForm";
import EditReservationForm from "./editReservationForm";

class Reservations extends Component {
  state = {
    status: [],
    decisions: [],
    reservations: {},
    submitted: false
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

  setSubmitted = isSubmitted => {
    this.setState({ submitted: isSubmitted });
  };

  setReservations = reservations => {
    this.setState({ reservations });
  };

  setStatus = (reservation, status) => {
    let reservations = { ...this.state.reservations };
    if (status) reservations[reservation.id].status = status;
    this.setState({ reservations });
  };

  setDecision = (reservation, decision) => {
    let reservations = { ...this.state.reservations };
    if (decision) reservations[reservation.id].decision = decision;
    this.setState({ reservations });
  };

  setEditing = (reservation, editing) => {
    let reservations = { ...this.state.reservations };
    reservations[reservation.id].editing = editing;
    this.setState({ reservations });
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
              {Object.values(reservations).map(reservation => (
                <React.Fragment key={reservation.id}>
                  <tr key={reservation.id}>
                    {Object.values(reservation).map((data, j) =>
                      _.isBoolean(data) ? null : <td key={j}>{data}</td>
                    )}

                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => this.setEditing(reservation, true)}
                      >
                        Edytuj
                      </button>
                    </td>
                  </tr>
                  {reservation.editing ? (
                    <EditReservationForm
                      reservation={reservation}
                      setDecision={this.setDecision}
                      setStatus={this.setStatus}
                      setEditing={this.setEditing}
                      status={this.state.status}
                      decisions={this.state.decisions}
                    />
                  ) : null}
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
        <ReservationsForm
          setReservations={this.setReservations}
          setSubmitted={this.setSubmitted}
          status={this.state.status}
          decisions={this.state.decisions}
        />
        <br />
        {this.renderReservations()}
      </div>
    );
  }
}

export default Reservations;
