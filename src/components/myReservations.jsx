import React, { Component } from "react";

class MyReservations extends Component {
  state = {
    reservations: {}
  };

  componentWillMount() {
    var formData = new FormData();
    formData.append("userId", this.props.userId);
    fetch("http://localhost/php1/api/myReservations.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        this.setState({ reservations: response });
      })
      .catch(error => console.log(error));
  }

  renderCancelButton = (reservation, key) => {
    if (reservation.status === "utworzona")
      return (
        <td>
          <button
            className="btn btn-danger"
            onClick={e => this.cancelReservation(reservation, key, e)}
          >
            Anuluj
          </button>
        </td>
      );
    else return <td />;
  };

  renderReservations = () => {
    const { reservations } = this.state;
    let rows = [];
    for (let key in reservations) {
      if (reservations.hasOwnProperty(key)) {
        console.log(reservations[key], key);
        rows.push(this.renderSingleReservation(reservations[key], key));
      }
    }
    console.log(rows);
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

  cancelReservation = (reservation, key, e) => {
    console.log(e);
    console.log(reservation);
    console.log(reservation.reservationId);

    const event = { ...e };
    const reservationId =
      event.currentTarget.parentNode.parentNode.children[0].innerText;

    var formData = new FormData();
    formData.append("reservationId", reservation.reservationId);
    fetch("http://localhost/php1/api/cancelReservation.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          console.log(key);
          //tu trzeba zrobić coś, żeby zmienić status tej rezerwacji w state i wtedy powinien zniknąć guzik
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
          <tbody>{this.renderReservations()}</tbody>
        </table>
      </div>
    );
  }
}

export default MyReservations;
