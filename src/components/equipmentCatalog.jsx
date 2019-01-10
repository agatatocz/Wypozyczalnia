import React, { Component } from "react";
import Input from "../common/input";
import Select from "../common/select";
import SubmitButton from "./../common/submitButton";

class EquipmentCatalog extends Component {
  state = {
    categories: [],
    producers: [],
    models: [],

    filters: {
      category: "",
      producer: "",
      model: "",
      id: "",
      startDate: "",
      endDate: ""
    },

    equipmentList: []
  };

  componentDidMount() {
    //tu dać odpowiedni adres do pliku, który zwraca wszystkie kategorie, producentów, modele
    fetch("http://localhost/BD2/api/1.php")
      //tu otrzymuję odpowiedź od serwera
      .then(response => response.json())
      .then(response => {
        //  console.log(response);
        const { categories, producers, models } = response;
        categories.unshift("");
        producers.unshift("");
        models.unshift("");
        this.setState({ categories, producers, models });
        //const { categories } = response;
        //this.setState({ categories: Object.values(categories) });
        //console.log(Object.values(response.categories));
      })
      .catch(error => console.log(error));
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      category,
      producer,
      model,
      id,
      startDate,
      endDate
    } = this.state.filters;
    const today = new Date();
    const chosenStartDate = new Date(startDate);
    const chosenEndDate = new Date(endDate);
    let properDates = false;

    if (
      //sprawdzenie czy podane daty mają sens
      !(startDate === "" && endDate === "") ||
      chosenEndDate.getTime() < today.getTime() ||
      chosenEndDate.getTime() < chosenStartDate.getTime() ||
      chosenStartDate.getTime() < today.getTime()
    ) {
      if (
        //jeśli wybrano dzisiejszy dzień jako data początkowa, to w porządku
        chosenStartDate.getFullYear() === today.getFullYear() &&
        chosenStartDate.getMonth() === today.getMonth() &&
        chosenStartDate.getDate() === today.getDate()
      )
        properDates = true;
      else properDates = false;
    } else properDates = true;

    if (!properDates) {
      alert("Błędny przedział czasowy");
      return;
    }

    //kod wyszukiwania
    //powinien wyciągać z bazy sprzęty i dodwać je do tablicy equipmentList w state,
    //wtedy renderEquipmentList je wyświetli
    var formData = new FormData();
    formData.append("category", category);
    formData.append("producer", producer);
    formData.append("model", model);
    formData.append("id", id);
    formData.append("chosenStartDate", chosenStartDate);
    formData.append("chosenEndDate", chosenEndDate);
    //wpisać odpowiedni adres
    fetch("http://localhost/BD2/api/demo.php", {
      method: "POST",
      body: formData
    })
      //tu otrzymuję odpowiedź od serwera
      .then(response => response.json())
      .then(response => {
        console.log(response);
        //w tym miejscu powinien być kod, który coś zrobi w zależności od odpowiedzi czyli filtrowanie
      })
      .catch(error => console.log(error));
  };

  handleChange = ({ currentTarget: input }) => {
    const filters = { ...this.state.filters };
    filters[input.name] = input.value;
    this.setState({
      filters
    });
  };

  renderEquipmentList = () => {
    if (!this.state.equipmentList.length) return;
    // tu trzeba dodać odpowiedniego callbacka w map
    return this.state.equipmentList.map((equipment, i) => (
      <p key={i}>cześć {equipment}</p>
    ));
  };

  render() {
    const { filters } = this.state;
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
                values={this.state.categories}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <Select
                name="producer"
                label="Producent"
                values={this.state.producers}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <Select
                name="model"
                label="Model"
                values={this.state.models}
                onChange={this.handleChange}
              />
            </div>

            <div className="col">
              <Input
                type="text"
                name="id"
                label="ID"
                value={filters.id}
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
                value={filters.startDate}
                onChange={this.handleChange}
              />
              <Input
                type="date"
                name="endDate"
                label="Data końcowa"
                value={filters.endDate}
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

        {this.renderEquipmentList()}
      </div>
    );
  }
}

export default EquipmentCatalog;
