const sql = require("../../models/db.js");

exports.findAll = (req, res) => {
    sql.query("SELECT * FROM clients", (err, data) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.send(data);
    });
};

exports.create = (req, res) => {
    if (!req.body.name || !req.body.client_id) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    const client = {
        client_id: req.body.client_id,
        name: req.body.name,
        business_type: req.body.business_type,
        address: req.body.address,
        phone_number: req.body.phone_number,
        contact_person: req.body.contact_person
    };

    sql.query("INSERT INTO clients SET ?", client, (err, data) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.status(201).send(client);
    });
};

exports.delete = (req, res) => {
    sql.query("DELETE FROM clients WHERE client_id = ?", req.params.id, (err, data) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(404).send({ message: "Not found" });
        }
        res.send({ message: "Deleted successfully" });
    });
};