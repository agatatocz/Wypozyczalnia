import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import Input from "../../common/input";
import SubmitButton from "../../common/submitButton";
import { daysBetween, areTheSameDates } from "../../common/myUtilityFuncs";

class AvailableChcekForm extends Form {
  state = {
    data: {
      startDate: "",
      endDate: ""
    },
    errors: {},
    availabe: "",
    submitted: false
  };

  schema = {
    startDate: Joi.date()
      .required()
      .label("Data początkowa"),
    endDate: Joi.date()
      .required()
      .label("Data końcowa")
  };

  setError = (name, value) => {
    const errors = { ...this.state.errors };
    errors[name] = value;
    this.setState({ errors });
  };

  validateDates = () => {
    const { startDate, endDate } = this.state.data;
    const today = new Date();
    const chosenStartDate = new Date(startDate);
    const chosenEndDate = new Date(endDate);
    let properDates = false;

    //sprawdzenie czy podane daty mają sens
    if (
      (startDate ? !endDate : endDate) ||
      chosenEndDate.getTime() < today.getTime() ||
      chosenEndDate.getTime() <= chosenStartDate.getTime() ||
      (chosenStartDate.getTime() < today.getTime() &&
        !areTheSameDates(chosenStartDate, today))
    ) {
      this.setError("dates", "Błędny przedział czasowy");
    } else if (daysBetween(chosenStartDate, chosenEndDate) > 30) {
      this.setError(
        "dates",
        "Okres wypożyczenia nie może być dłuższy niż 30 dni"
      );
    } else if (daysBetween(today, chosenStartDate) > 20) {
      this.setError(
        "dates",
        "Rezerwacji można dokonać z maksymalnie 20-dniowym wyprzedzeniem"
      );
    } else properDates = true;
    return properDates;
  };

  doSubmit = () => {
    const { data } = this.state;
    const { equipment } = this.props;
    if (this.validateDates()) {
      const formData = new FormData();
      formData.append("equipmentId", equipment.id);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);

      //tu dać odpowiedni link
      fetch("http://localhost/BD2/api/12.php", {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(response => {
          this.setState({ availabe: response, submitted: true });
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    const { data, availabe, submitted } = this.state;
    const { equipment } = this.props;
    return (
      <tr key={equipment.id}>
        <td colSpan="8">
          <h6>Sprawdź dostępność:</h6>
          <form>
            <div className="form-row">
              <div className="col">
                <Input
                  type="date"
                  name="startDate"
                  label="Data początkowa"
                  value={data.startDate}
                  onChange={this.handleChange}
                />
              </div>
              <div className="col">
                <Input
                  type="date"
                  name="endDate"
                  label="Data końcowa"
                  value={data.endDate}
                  onChange={this.handleChange}
                />
              </div>
              <div className="col">
                <SubmitButton
                  className="btn btn-dark"
                  onClick={e => this.handleSubmit(e)}
                  label="Sprawdź"
                />
              </div>
            </div>
          </form>
          {this.state.errors && (
            <p style={{ color: "red", textAlign: "center" }}>
              {Object.values(this.state.errors)[0]}
            </p>
          )}
          {submitted ? (
            availabe ? (
              <h6 style={{ color: "green", textAlign: "center" }}>
                Egzemplarz sprzętu jest dostępny w podanym okresie.
              </h6>
            ) : (
              <h6 style={{ color: "red", textAlign: "center" }}>
                Egzemplarz sprzętu nie jest dostępny w podanym okresie.
              </h6>
            )
          ) : null}
        </td>
      </tr>
    );
  }
}

export default AvailableChcekForm;
