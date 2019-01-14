import React from "react";
import Form from "./../common/form";
import Joi from "joi-browser";
import Input from "../common/input";
import TextArea from './../common/textArea';

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
        success: false
    };

    schema = {
        category: Joi.string().max(100)
            .required()
            .label("Kategoria"),
        producer: Joi.string().max(255)
            .required()
            .label("Producent"),
        model: Joi.string().max(255)
            .required()
            .label("Model"),
        id: Joi.number().integer()
            .required()
            .label("ID"),
        deposit: Joi.number().integer().min(0)
            .required()
            .label("Kaucja"),
        price: Joi.number().integer().min(0)
            .required()
            .label("Cena za dzień"),
        characteristics: Joi.string().max(2000)
            .required()
            .label("Cechy charakterystyczne"),
        description: Joi.string().max(2000)
            .required()
            .label("Opis"),
    };

    setError = (name, value) => {
        const errors = { ...this.state.errors };
        errors[name] = value;
        this.setState({ errors });
    };

    resetData = () => {
        const data = { ...this.state.data };
        Object.keys(data).forEach(key => data[key] = "");
        this.setState({ data });
    }

    doSubmit = () => {
        console.log("submitted");

        const { category,
            producer,
            model,
            id,
            deposit,
            price,
            characteristics,
            description } = this.state.data;

        let formData = new FormData();
        formData.append("category", category);
        formData.append("producer", producer);
        formData.append("model", model);
        formData.append("id", id);
        formData.append("deposit", deposit);
        formData.append("price", price);
        formData.append("characteristics", characteristics);
        formData.append("description", description);

        //wpisać odpowiedni adres
        fetch("http://localhost/BD2/api/demo.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    this.setState({ success: true });
                    this.resetData();
                } else {
                    this.setError("errorMsg", "coś poszło nie tak");
                }
            })
            .catch(error => alert('Wystąpił błąd połączenia z serwerem.'));
    };

    render() {
        const { data, success } = this.state;
        return (
            <div className="container">
                <h3>Dodaj nowy egzemplarz sprzętu</h3>
                {success && <h6 style={{ color: "green" }}>Dodano nowy sprzęt</h6>}
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
