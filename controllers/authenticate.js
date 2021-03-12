const authenticate = (req, res, database) => {
  const { id } = req.body;

  database("face-model-registry")
    .select("id", "first_name", "last_name", "email", "entries")
    .where("id", "=", id)
    .then((user) => {
      if (JSON.stringify(req.body) === JSON.stringify(user[0])) {
        res.status(200).json("VERIFIED");
      } else {
        res.status(401).json("INVALID CREDENTIALS");
      }
    })
    .catch(() => res.status(204).json("RESOURCE CACHE EMPTY"));
};

module.exports = authenticate;
