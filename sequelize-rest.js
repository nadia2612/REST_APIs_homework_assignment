const Sequelize = require("sequelize");
const { Router } = require("express");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const router = new Router();
const port = 4000;

app.use(bodyParser.json());

const sequelize = new Sequelize(
  "postgres://postgres:secret@localhost:5432/postgres"
);
const Movie = sequelize.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});
sequelize.sync().then(() =>
  Promise.all([
    Movie.create({
      title: "Apocalypse Now Redux",
      yearOfRelease: 2001,
      synopsis:
        "Coppola's nightmarish Vietnam epic, starring Marlon Brando and Martin Sheen, redefines the war flick and the dangers of the jungle."
    }),
    Movie.create({
      title: "Blade Runner",
      yearOfRelease: 1982,
      synopsis:
        "Ridley Scott's moody futuristic thriller boasts stunning effects and unmissable performances by Harrison Ford and Sean Young."
    }),
    Movie.create({
      title: "To Kill A Mockingbird",
      yearOfRelease: 1962,
      synopsis:
        "Harper Lee's story is poignantly reimagined in this 1962 coming-of-age pic with a career-defining performance by Gregory Peck."
    })
  ])
);

router.get("/movie", (request, response, next) => {
  const {limit, offset} = request.query;

  Movie.findAndCountAll({ limit, offset })
    .then(result => response.send({ data: result.rows, total: result.count }))
    .catch(error => next(error));
});

router.post("/movie", (request, response, next) => {
  Movie.create(request.body)
    .then(result => {
      response.json(result);
    })
    .catch(error => next(error));
});

router.get("/movie/:id", (request, response, next) => {
  Movie.findByPk(request.params.id)
    .then(movie => response.send(movie))
    .catch(error => next(error));
});

router.put("/movie/:id", (request, response, next) =>
  Movie.findByPk(request.params.id)
    .then(movie => movie.update(request.body))
    .then(movie => response.json(movie))
    .catch(error => next(error))
);

router.delete("/movie/:id", (request, response, next) =>
  Movie.destroy({ where: { id: request.params.id } })
    .then(number => response.send({ number }))
    .catch(error => next(error))
);

app.use(router);

app.listen(port, () => console.log(`listening ${port}`));
