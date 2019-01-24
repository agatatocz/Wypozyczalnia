import React from "react";
import Form from "../../common/form";
import Joi from "joi-browser";
import SubmitButton from "../../common/submitButton";
import Select from "../../common/select";
import _ from "lodash";

class EditReservationForm extends Form {
  state = {
    data: {
      status: "",
      decision: ""
    },
    errors: {}
  };

  schema = {
    status: Joi.any(),
    decision: Joi.any()
  };

  setError = (name, value) => {
    const errors = { ...this.state.errors };
    errors[name] = value;
    this.setState({ errors });
  };

  doSubmit = () => {
    const { reservation } = this.props;
    const data = { ...this.state.data };

    //jeśli nie wybrano nowego stausu lub decyzji, użyjemy starych
    if (_.isEmpty(data.status)) {
      data.status = reservation.status;
      this.setState({ data });
    }

    if (_.isEmpty(data.decision)) {
      data.decision = reservation.decision;
      this.setState({ data });
    }

    const { status, decision } = this.state.data;

    var formData = new FormData();
    formData.append("status", status);
    formData.append("decision", decision);
    formData.append("reservationId", reservation.id);
    fetch("http://localhost/BD2/api/8.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(response => {
        this.props.setStatus(reservation, response.status);
        this.props.setDecision(reservation, response.decision);
      })
      .catch(error => alert(error));

    this.props.setEditing(reservation, false);
    this.resetData();
  };

  resetData = () => {
    const data = { ...this.state.data };
    data.status = "";
    data.decision = "";
    this.setState({ data });
  };

  render() {
    return (
      <tr>
        <td colSpan="8">
          <form>
            <div className="form-row">
              <div className="col">
                <Select
                  name="status"
                  label="Status rezerwacji"
                  onChange={this.handleChange}
                  values={this.props.status}
                />
              </div>
              <div className="col">
                <Select
                  name="decision"
                  label="Decyzja o zwrocie kaucji"
                  onChange={this.handleChange}
                  values={this.props.decisions}
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
        </td>
      </tr>
    );
  }
}

export default EditReservationForm;
