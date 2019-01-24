import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import Input from "../../common/input";
import SubmitButton from "../../common/submitButton";
import TextArea from "../../common/textArea";
import Select from "../../common/select";

class EditEquipmentForm extends Form {
  state = {
    data: {
      category: "",
      producer: "",
      model: "",
      description: "",
      characteristics: ""
    },
    errors: {},
    edited: false
  };

  schema = {
    category: Joi.string()
      .max(100)
      .allow("")
      .label("Kategoria"),
    producer: Joi.string()
      .max(255)
      .allow("")
      .label("Producent"),
    model: Joi.string()
      .max(255)
      .allow("")
      .label("Model"),
    description: Joi.string()
      .max(2000)
      .allow("")
      .label("Opis"),
    characteristics: Joi.string()
      .max(2000)
      .allow("")
      .label("Cechy charakterystyczne")
  };

  setError = (name, value) => {
    const errors = { ...this.state.errors };
    errors[name] = value;
    this.setState({ errors });
  };

  doSubmit = () => {
    const { data } = this.state;
    const { equipment } = this.props;

    if (!window.confirm(`Aby zapisać zmiany wciśnij OK.`)) return;

    const formData = new FormData();
    formData.append("equipmentId", equipment.id);
    formData.append("category", data.category);
    formData.append("producer", data.producer);
    formData.append("model", data.model);
    formData.append("description", data.description);
    formData.append("characteristics", data.characteristics);

    fetch("http://localhost/BD2/api/15.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        if (response) this.setState({ edited: true });
        else alert("Wystąpił błąd - nie udało się wprowadzić zmian");
      })
      .catch(error => console.log(error));
  };

  render() {
    const { data, edited } = this.state;
    const { equipment } = this.props;
    return (
      <tr key={equipment.id}>
        <td colSpan="8">
          <h6>Edytuj:</h6>
          <form>
            <div className="form-row">
              <div className="col">
                <Select
                  name="category"
                  label="Kategoria"
                  values={this.props.categories}
                  onChange={this.handleChange}
                />
              </div>
              <div className="col">
                <Select
                  name="producer"
                  label="Producent"
                  values={this.props.producers}
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
              <div className="col">
                <SubmitButton
                  className="btn btn-dark"
                  onClick={e => this.handleSubmit(e)}
                  label="Zapisz"
                />
              </div>
            </div>
          </form>
          {this.state.errors && (
            <p style={{ color: "red", textAlign: "center" }}>
              {Object.values(this.state.errors)[0]}
            </p>
          )}
          {edited ? (
            <h6 style={{ color: "green", textAlign: "center" }}>
              Zmiany zostały zapisane.
            </h6>
          ) : null}
        </td>
      </tr>
    );
  }
}

export default EditEquipmentForm;
