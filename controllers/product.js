const db = require("../models");

module.exports = {
  getShirts: function(req, res) {
    db.Shirts
      .find()
      .sort({name: 1})
      .then(dbShirts => res.json(dbShirts))
      .catch(err => {
        console.log(err);
        res.status(422).json(err)});
  },

  findAll: function (req, res) {
    db.Shirts
      .find({})
      .sort({ name: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
}