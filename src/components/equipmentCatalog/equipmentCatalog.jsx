import React, { Component } from "react";
import EquipmentForm from "./equipmentForm";
import AvailableChcekForm from "./availableCheckForm";
import RentForm from "./rentForm";
import EditEquipmentForm from "./editEquipmentForm";

class EquipmentCatalog extends Component {
  state = {
    categories: [],
    producers: [],
    models: [],
    equipmentList: [],
    submitted: false
  };

  componentDidMount() {
    fetch("http://localhost/BD2/api/1.php")
      .then(response => response.json())
      .then(response => {
        const { categories, producers, models } = response;
        categories.unshift("");
        producers.unshift("");
        models.unshift("");
        this.setState({ categories, producers, models });
      })
      .catch(error => console.log(error));
  }

  setEquipmentList = equipmentList => {
    this.setState({ equipmentList });
  };

  setSubmitted = isSubmitted => {
    this.setState({ submitted: isSubmitted });
  };

  hideAdditionalRow = equipment => {
    const equipmentList = [...this.state.equipmentList];
    const target = equipmentList.find(item => item.id === equipment.id);
    target.showDetails = false;
    target.showAvailable = false;
    target.showRent = false;
    target.showEdit = false;
    this.setState({ equipmentList });
  };

  handleDetails = equipment => {
    this.changeShowState(equipment, "showDetails");

    const formData = new FormData();
    formData.append("equipmentId", equipment.id);
    fetch("http://localhost/BD2/api/11.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        this.setEquipmentProp(equipment, "description", response.description);
        this.setEquipmentProp(
          equipment,
          "characteristics",
          response.characteristics
        );
      })
      .catch(error => console.log(error));
  };

  changeShowState = (equipment, key) => {
    const equipmentList = [...this.state.equipmentList];
    const target = equipmentList.find(item => item.id === equipment.id);
    if (!target[key]) this.hideAdditionalRow(equipment);
    target[key] = !target[key];
    this.setState({ equipmentList });
  };

  setEquipmentProp = (equipment, key, value) => {
    const equipmentList = [...this.state.equipmentList];
    const target = equipmentList.find(item => item.id === equipment.id);
    target[key] = value;
    this.setState({ equipmentList });
  };

  handleDelete = equipment => {
    if (!window.confirm(`Aby usunąć egzemplarz sprzętu wciśnij OK.`)) return;

    const formData = new FormData();
    formData.append("equipmentId", equipment.id);

    fetch("http://localhost/BD2/api/14.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          let equipmentList = [...this.state.equipmentList];
          equipmentList = equipmentList.filter(
            item => item.id !== equipment.id
          );
          this.setState({ equipmentList });
        } else alert("Nie udało się dokonać operacji");
      })
      .catch(error => console.log(error));
  };

  renderDetails = equipment => {
    return (
      <tr key={equipment.id}>
        <td colSpan="8">
          <h6>Opis:</h6>
          <p>{equipment.description}</p>
          <h6>Cechy charakterystyczne:</h6>
          <p>{equipment.characteristics}</p>
        </td>
      </tr>
    );
  };

  renderRow = equipment => {
    const { accountType } = this.props;
    return (
      <React.Fragment>
        <td>{equipment.id}</td>
        <td>{equipment.category}</td>
        <td>{equipment.producer}</td>
        <td>{equipment.model}</td>
        <td>{equipment.deposit}</td>
        <td>{equipment.price}</td>
        <td className="td-button-container">
          <button
            className="btn btn-info m-1"
            onClick={() => this.handleDetails(equipment)}
          >
            Szczegóły
          </button>
          <button
            className="btn btn-primary m-1"
            onClick={() => this.changeShowState(equipment, "showAvailable")}
          >
            Dostępność
          </button>
          {accountType === "klient" ? (
            <button
              className="btn btn-success m-1"
              onClick={() => this.changeShowState(equipment, "showRent")}
              style={{ gridColumn: "1 / 3" }}
            >
              Wypożycz
            </button>
          ) : null}
          {accountType === "kierownik" ? (
            <React.Fragment>
              <button
                className="btn btn-dark m-1"
                onClick={() => this.changeShowState(equipment, "showEdit")}
              >
                Edytuj
              </button>
              <button
                className="btn btn-danger m-1"
                onClick={() => this.handleDelete(equipment)}
              >
                Usuń
              </button>
            </React.Fragment>
          ) : null}
        </td>
      </React.Fragment>
    );
  };

  renderEquipmentList = () => {
    const { equipmentList, submitted } = this.state;
    if (!equipmentList.length && submitted)
      return <h4>Żaden egzamplarz sprzętu nie spełnia podanych kryteriów.</h4>;
    else if (submitted)
      return (
        <React.Fragment>
          <h4>Wyniki:</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID egzemplarza</th>
                <th>Kategoria</th>
                <th>Producent</th>
                <th>Model</th>
                <th>Kaucja [zł]</th>
                <th>Cena za dzień [zł]</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {equipmentList.map((equipment, i) => (
                <React.Fragment key={i}>
                  <tr key={i}>{this.renderRow(equipment)}</tr>
                  {equipment.showDetails ? this.renderDetails(equipment) : null}
                  {equipment.showAvailable ? (
                    <AvailableChcekForm equipment={equipment} />
                  ) : null}
                  {equipment.showRent ? (
                    <RentForm
                      equipment={equipment}
                      clientId={this.props.userId}
                    />
                  ) : null}
                  {equipment.showEdit ? (
                    <EditEquipmentForm
                      equipment={equipment}
                      categories={this.state.categories}
                      producers={this.state.producers}
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
    const { categories, producers, models } = this.state;
    return (
      <React.Fragment>
        <EquipmentForm
          categories={categories}
          producers={producers}
          models={models}
          setEquipmentList={this.setEquipmentList}
          setSubmitted={this.setSubmitted}
        />
        <div className="container">{this.renderEquipmentList()}</div>
      </React.Fragment>
    );
  }
}

export default EquipmentCatalog;
