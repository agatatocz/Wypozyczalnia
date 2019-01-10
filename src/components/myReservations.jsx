import React, { Component } from "react";

class MyReservations extends Component {
  state = {
    reservations: {}
  };

  componentDidMount() {
    var formData = new FormData();
    //formData.append("userId", this.props.userId);
    formData.append("userId", "");
    //console.log("userID: ", this.props.userId);
    fetch("http://localhost/BD2/api/5_copy.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        console.log("odpowiedz: ", response);
        //    const { reservations } = response;
        //    this.setState({ reservations });
        //this.setState({ reservations: response });
      })
      .catch(error => console.log(error, "błąd"));
  }

  renderCancelButton = (reservation, key) => {
    if (reservation.status === "utworzona")
      return (
        <td>
          <button
            className="btn btn-danger"
            onClick={() => this.cancelReservation(reservation, key)}
          >
            Anuluj
          </button>
        </td>
      );
    else return <td />;
  };

  renderSingleReservation = (reservation, key) => {
    return (
      <tr key={key}>
        {Object.values(reservation).map((data, i) => (
          <td key={i}>{data}</td>
        ))}
        {this.renderCancelButton(reservation, key)}
      </tr>
    );
  };

  cancelReservation = (reservation, key) => {
    if (
      !window.confirm(
        `Aby anulować rezerwację ${reservation.reservationId} wciśnij OK.`
      )
    )
      return;
    let formData = new FormData();
    formData.append("reservationId", reservation.reservationId);
    fetch("http://localhost/BD2/api/cancelReservation.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let reservations = { ...this.state.reservations };
          reservations[key].status = "anulowana";
          this.setState({ reservations });
        } else alert("Nie udało się dokonać operacji");
      })
      .catch(error => console.log(error));
  };

  render() {
    const { reservations } = this.state;
    return (
      <div className="container">
        <h3>Moje rezerwacje:</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Numer rezerwacji</th>
              <th>Data utworzenia</th>
              <th>Data początku wypożyczenia</th>
              <th>Data końca wypożyczenia</th>
              <th>ID egzemplarza sprzętu</th>
              <th>Status rezerwacji</th>
              <th>Decyzja o zwrocie kaucji</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {Object.values(reservations).map((reservation, i) =>
              this.renderSingleReservation(
                reservation,
                Object.keys(reservations)[i]
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MyReservations;
