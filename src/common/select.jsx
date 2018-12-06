import React from "react";

/*
    type - typ pola <input />
    name - nazwa musi być zgodna z nazwą w state komponentu narzędnego
    label - etykieta wyświetlana przed polem <input />
    value - element ze state komponentu nadrzędnego powiązany z polem <input />
    onChange - funkcja aktualizująca stan komponentu narzędnego w zależności od wpisanych w pole <input /> danych
*/
const Select = ({ name, label, values, onChange }) => {
  return (
    <div className="form-group mr-4">
      <label>{label}</label>
      <select className="form-control" onChange={onChange} name={name}>
        {values.map((value, i) => (
          <option key={i}>{value}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
