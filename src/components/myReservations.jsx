import React, { Component } from "react";

class MyReservations extends Component {
  state = {
    reservations: []
  };

  componentDidMount() {
    var formData = new FormData();
    formData.append("userId", this.props.userId);
    fetch("http://localhost/BD2/api/5.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        this.setState({ reservations: response });
      })
      .catch(error => console.log(error, "błąd"));
  }

  renderCancelButton = (reservation, key) => {
    if (reservation.status === "Utworzona")
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

  renderSingleReservation = (reservation) => {
    return (
      <tr key={reservation.id}>
        {Object.values(reservation).map((data, i) => (
          <td key={i}>{data}</td>
        ))}
        {this.renderCancelButton(reservation)}
      </tr>
    );
  };

  cancelReservation = (reservation) => {
    if (
      !window.confirm(
        `Aby anulować rezerwację ${reservation.id} wciśnij OK.`
      )
    )
      return;
    let formData = new FormData();
    formData.append("reservationId", reservation.id);
    fetch("http://localhost/BD2/api/7.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          let reservations = [...this.state.reservations];
          reservations.find(res => res.id === reservation.id).status = "Anulowana";
          this.setState({ reservations });
        } else alert("Nie udało się dokonać operacji");
      })
      .catch(error => console.log(error));
  };

  render() {
    const { reservations } = this.state;
    if (!reservations.length) return <div className="container"><h3>Nie masz jeszcze żadnych rezerwacji.</h3></div>;
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
            {reservations.map((reservation, i) =>
              this.renderSingleReservation(reservation, i))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MyReservations;
