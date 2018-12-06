import React from "react";

/*
    type - typ pola <input />
    name - nazwa musi być zgodna z nazwą w state komponentu narzędnego
    label - etykieta wyświetlana przed polem <input />
    value - element ze state komponentu nadrzędnego powiązany z polem <input />
    onChange - funkcja aktualizująca stan komponentu narzędnego w zależności od wpisanych w pole <input /> danych
    error - komunikat błędu wynikający z walidacji wprowadzonych danych
*/
const Input = ({ type, name, label, value, error, onChange, ...rest }) => {
  return (
    <div style={{ marginBottom: 15 }}>
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
