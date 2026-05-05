const sql = require("../../models/db.js");

exports.findAll = (req, res) => {
    sql.query("SELECT * FROM loans", (err, data) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.send(data);
    });
};

exports.create = (req, res) => {
    if (!req.body.loan_id || !req.body.loan_amount || !req.body.client_id || !req.body.loan_type_id) {
        return res.status(400).send({ message: "Required fields can not be empty!" });
    }

    const loan = {
        loan_id: req.body.loan_id,
        loan_amount: req.body.loan_amount,
        issue_date: req.body.issue_date,
        client_id: req.body.client_id,
        loan_type_id: req.body.loan_type_id,
        scheduled_return_date: req.body.scheduled_return_date,
        actual_return_date: req.body.actual_return_date || null
    };

    sql.query("INSERT INTO loans SET ?", loan, (err, data) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.status(201).send(loan);
    });
};

exports.delete = (req, res) => {
    sql.query("DELETE FROM loans WHERE loan_id = ?", req.params.id, (err, data) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(404).send({ message: "Not found" });
        }
        res.send({ message: "Deleted successfully" });
    });
};