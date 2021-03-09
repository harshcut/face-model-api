const { v1: uuid } = require("uuid");

const register = (req, res, database, bcrypt) => {
  let { first_name, last_name, email, password } = req.body;

  const RegExpFormat = {
    email: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
  };

  if (
    first_name &&
    last_name &&
    email.match(RegExpFormat.email) &&
    password.match(RegExpFormat.password)
  ) {
    database("face-model-registry")
      .insert({
        id: uuid(),
        first_name,
        last_name,
        email,
        password: bcrypt.hashSync(password, 10),
      })
      .returning(["id", "first_name", "last_name", "email", "entries"])
      .then((user) => res.status(201).json(user[0]))
      .catch(() => res.status(409).json("USER ALREADY EXISTS"));
  } else {
    res.status(400).json("BAD VARIABLES");
  }
};

module.exports = register;
