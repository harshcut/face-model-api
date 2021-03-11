const signin = (req, res, database, bcrypt) => {
  const { email, password } = req.body;

  database("face-model-registry")
    .select("email", "password")
    .where("email", "=", email)
    .then((user) => {
      if (bcrypt.compareSync(password, user[0].password)) {
        database("face-model-registry")
          .select("id", "first_name", "last_name", "email", "entries")
          .where("email", "=", email)
          .then((user) => res.status(200).json(user[0]))
          .catch(() => res.status(500).json("FAILED TO SEND RESOURCES"));
      } else {
        res.status(401).json("INVALID CREDENTIALS");
      }
    })
    .catch(() => res.status(401).json("INVALID CREDENTIALS"));
};

module.exports = signin;
