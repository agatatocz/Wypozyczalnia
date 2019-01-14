import React, { Component } from "react";
import "./App.css";
import EquipmentCatalog from "./components/equipmentCatalog";
import LoggingForm from "./components/loggingForm";
import { Route, Switch } from "react-router-dom";
import AccountForm from "./components/accountForm";
import Header from "./components/header";
import MyReservations from "./components/myReservations";
import Reservations from "./components/reservations";
import AddEquipmentForm from './components/addEqiupmentForm';

class App extends Component {
  state = {
    user: {
      accountType: "",
      firstName: "",
      lastName: "",
      userId: ""
    }
  };

  setAppState = user => {
    this.setState({ user });
  };

  resetAppState = () => {
    const user = { ...this.state.user };
    for (let property in user)
      if (user.hasOwnProperty(property)) user[property] = "";

    this.setState({ user });
  };

  renderHeader = props => {
    const { accountType, firstName, lastName } = this.state.user;
    let header;
    switch (accountType) {
      case "klient":
        header = (
          <Header
            {...props}
            firstName={firstName}
            lastName={lastName}
            buttonLabel1="Moje rezerwacje"
            buttonLink1="/my_reservations"
            buttonLabel2="Wyloguj"
            buttonLink2="/"
            onClick2={this.resetAppState}
          />
        );
        break;
      case "pracownik":
        header = (
          <Header
            {...props}
            firstName={firstName}
            lastName={lastName}
            buttonLabel1="Rezerwacje"
            buttonLink1="/reservations"
            buttonLabel2="Wyloguj"
            buttonLink2="/"
            onClick2={this.resetAppState}
          />
        );
        break;
      case "kierownik":
        header = (
          <Header
            {...props}
            firstName={firstName}
            lastName={lastName}
            buttonLabel1="Dodaj sprzęt"
            buttonLink1="/add_equipment"
            buttonLabel2="Wyloguj"
            buttonLink2="/"
            onClick2={this.resetAppState}
          />
        );
        break;
      default:
        header = (
          <Header
            {...props}
            firstName={firstName}
            lastName={lastName}
            buttonLabel1="Zaloguj"
            buttonLink1="/login"
            buttonLabel2="Utwórz konto"
            buttonLink2="/accountForm"
            onClick2={this.resetAppState}
          />
        );
        break;
    }

    return header;
  };

  render() {
    const { accountType, firstName, lastName } = this.state.user;
    return (
      <Switch>
        <Route
          path="/login"
          render={props => (
            <React.Fragment>
              <Header
                {...props}
                buttonLink1="/"
                buttonLink2="/"
                buttonDisplay1="none"
                buttonDisplay2="none"
              />
              <LoggingForm setAppState={this.setAppState} {...props} />
            </React.Fragment>
          )}
        />
        <Route
          path="/accountForm"
          render={props => (
            <React.Fragment>
              <Header
                {...props}
                buttonLink1="/"
                buttonLink2="/"
                buttonDisplay1="none"
                buttonDisplay2="none"
              />
              <AccountForm {...props} />
            </React.Fragment>
          )}
        />
        <Route
          path="/my_reservations"
          render={props => (
            <React.Fragment>
              <Header
                {...props}
                firstName={firstName}
                lastName={lastName}
                buttonLabel1="Katalog sprzętu"
                buttonLink1="/client"
                buttonLabel2="Wyloguj"
                buttonLink2="/"
                onClick2={this.resetAppState}
              />
              <MyReservations userId={this.state.user.userId} {...props} />
            </React.Fragment>
          )}
        />
        <Route
          path="/reservations"
          render={props => (
            <React.Fragment>
              <Header
                {...props}
                firstName={firstName}
                lastName={lastName}
                buttonLabel1="Katalog sprzętu"
                buttonLink1="/worker"
                buttonLabel2="Wyloguj"
                buttonLink2="/"
                onClick2={this.resetAppState}
              />
              <Reservations {...props} />
            </React.Fragment>
          )}
        />
        <Route
          path="/add_equipment"
          render={props => (
            <React.Fragment>
              <Header
                {...props}
                firstName={firstName}
                lastName={lastName}
                buttonLabel1="Katalog sprzętu"
                buttonLink1="/manager"
                buttonLabel2="Wyloguj"
                buttonLink2="/"
                onClick2={this.resetAppState}
              />
              <AddEquipmentForm {...props} />
            </React.Fragment>
          )}
        />
        <Route
          path="/"
          render={props => (
            <React.Fragment>
              {this.renderHeader(props)}
              <EquipmentCatalog {...props} />
            </React.Fragment>
          )}
        />
      </Switch>
    );
  }
}

export default App;
