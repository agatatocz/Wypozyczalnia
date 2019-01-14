import React, { Component } from "react";
import Input from "../common/input";
import Select from "../common/select";
import SubmitButton from "./../common/submitButton";
import EquipmentForm from "./equipmentForm2";

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
  }

  renderEquipmentList = () => {
    const { equipmentList, submitted } = this.state;
    if (!equipmentList.length && submitted) return <h3>Żaden egzamplarz sprzętu nie spełnia podanych kryteriów.</h3>;

    return equipmentList.map((equipment, i) => (
      <p key={i}>cześć {equipment.model}</p>
    ));
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
        <div className="container">
          {this.renderEquipmentList()}
        </div>
      </React.Fragment>
    );
  }
}

export default EquipmentCatalog;
