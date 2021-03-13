const Clarifai = require("clarifai");

const detect = (req, res, database) => {
  const { id, email, image } = req.body;

  const app = new Clarifai.App({ apiKey: process.env.API_KEY });

  database("face-model-registry")
    .select("email", "entries")
    .where("id", "=", id)
    .then((user) => {
      if (email === user[0].email && user[0].entries < 21) {
        app.models
          .predict(Clarifai.FACE_DETECT_MODEL, image)
          .then((response) => {
            database("face-model-registry")
              .where("id", "=", id)
              .increment("entries", 1)
              .returning("entries")
              .then((entries) => {
                database("face-model-history")
                  .insert({
                    timestamp: new Date(),
                    id,
                    email,
                    image,
                  })
                  .then(() =>
                    res.status(200).json({
                      clarifai: response,
                      entries: entries[0],
                    })
                  )
                  .catch(() => res.status(500).json("LOGGING FAILED"));
              })
              .catch(() => res.status(500).json("UNABLE TO INCREMENT ENTRY"));
          })
          .catch(() => res.status(405).json("IMAGE NOT COMPATIBLE"));
      } else if (email === user[0].email && user[0].entries >= 21) {
        res.status(404).json("LIMIT EXCEEDED");
      } else {
        throw Error;
      }
    })
    .catch(() => res.status(401).json("INVALID CREDENTIALS"));
};

module.exports = detect;
