import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import Input from "../../common/input";
import TextArea from "../../common/textArea";

class AddEquipmentForm extends Form {
  state = {
    data: {
      category: "",
      producer: "",
      model: "",
      id: "",
      deposit: "",
      price: "",
      characteristics: "",
      description: ""
    },
    errors: {},
    success: false,
    msg: ""
  };

  schema = {
    category: Joi.string()
      .max(100)
      .required()
      .label("Kategoria"),
    producer: Joi.string()
      .max(255)
      .required()
      .label("Producent"),
    model: Joi.string()
      .max(255)
      .required()
      .label("Model"),
    id: Joi.number()
      .integer()
      .required()
      .label("ID"),
    deposit: Joi.number()
      .integer()
      .min(0)
      .required()
      .label("Kaucja"),
    price: Joi.number()
      .integer()
      .min(0)
      .required()
      .label("Cena za dzień"),
    characteristics: Joi.string()
      .max(2000)
      .allow("")
      .label("Cechy charakterystyczne"),
    description: Joi.string()
      .max(2000)
      .allow("")
      .label("Opis")
  };

  setError = (name, value) => {
    const errors = { ...this.state.errors };
    errors[name] = value;
    this.setState({ errors });
  };

  resetData = () => {
    const data = { ...this.state.data };
    Object.keys(data).forEach(key => (data[key] = ""));
    this.setState({ data });
  };

  doSubmit = () => {
    const {
      category,
      producer,
      model,
      id,
      deposit,
      price,
      characteristics,
      description
    } = this.state.data;

    let formData = new FormData();
    formData.append("category", category);
    formData.append("producer", producer);
    formData.append("model", model);
    formData.append("id", id);
    formData.append("deposit", deposit);
    formData.append("price", price);
    formData.append("characteristics", characteristics);
    formData.append("description", description);

    fetch("http://localhost/BD2/api/10.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({ success: true, msg: response.errorMsg });
          this.resetData();
        } else {
          this.setError("errorMsg", response.errorMsg);
        }
      })
      .catch(error => {
        alert("Wystąpił błąd połączenia z serwerem.");
      });
  };

  render() {
    const { data, success, msg } = this.state;
    return (
      <div className="container">
        <h3>Dodaj nowy egzemplarz sprzętu</h3>
        {success ? (
          <React.Fragment>
            <span style={{ color: "green", fontWeight: "bold" }}>{msg} </span>
            <i
              className="fa fa-check-circle-o"
              style={{ color: "green" }}
              onClick={() => this.setState({ success: false, msg: "" })}
              onMouseOver={e =>
                e.currentTarget.setAttribute("class", "fa fa-circle")
              }
              onMouseOut={e =>
                e.currentTarget.setAttribute("class", "fa fa-check-circle-o")
              }
              aria-hidden="true"
            />
          </React.Fragment>
        ) : null}
        {this.state.errors && (
          <h6 style={{ color: "red" }}>
            {Object.values(this.state.errors)[0]}
          </h6>
        )}
        <form className="addForm">
          <div className="form-row">
            <div className="col">
              <Input
                type="text"
                name="id"
                label="ID"
                value={data.id}
                onChange={this.handleChange}
              />
            </div>

            <div className="col">
              <Input
                type="text"
                name="category"
                label="Kategoria"
                value={data.category}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col">
              <Input
                type="text"
                name="producer"
                label="Producent"
                value={data.producer}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <Input
                type="text"
                name="model"
                label="Model"
                value={data.model}
                onChange={this.handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="col">
              <Input
                type="text"
                name="deposit"
                label="Kaucja"
                value={data.deposit}
                onChange={this.handleChange}
              />
            </div>

            <div className="col">
              <Input
                type="text"
                name="price"
                label="Cena za dzień"
                value={data.price}
                onChange={this.handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="col">
              <TextArea
                name="characteristics"
                label="Cechy charakterystyczne"
                value={data.characteristics}
                onChange={this.handleChange}
              />
            </div>
            <div className="col">
              <TextArea
                name="description"
                label="Opis"
                value={data.description}
                onChange={this.handleChange}
              />
            </div>
          </div>

          {this.renderSubmitButton("Dodaj")}
          {this.renderCancelButton("/manager")}
        </form>
      </div>
    );
  }
}

export default AddEquipmentForm;
