import React from "react";

/*
    name - nazwa musi być zgodna z nazwą w state komponentu narzędnego
    label - etykieta wyświetlana przed polem <textarea />
    value - element ze state komponentu nadrzędnego powiązany z polem <textarea />
    onChange - funkcja aktualizująca stan komponentu narzędnego w zależności od wpisanych w pole <textarea /> danych
    error - komunikat błędu wynikający z walidacji wprowadzonych danych
*/
const TextArea = ({ name, label, value, error, onChange, ...rest }) => {
    return (
        <div style={{ marginBottom: 15 }}>
            <label htmlFor={name}>{label}</label>
            <textarea
                {...rest}
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

export default TextArea;
