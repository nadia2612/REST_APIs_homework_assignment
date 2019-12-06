const Sequelize= require("sequelize")
const { Router } = require("express");

const router = new Router();

const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres');
const Movie = sequelize.define(
  'movie',
  {
    title: Sequelize.STRING,
    yearOfRelease: Sequelize.STRING,
    synopsis: Sequelize.STRING,
  }
)
sequelize
.sync()
.then(()=>
Promise.all([
  Movie.create({
    title:"Apocalypse Now Redux",
    yearOfRelease:2001,
    synopsis:"Coppola's nightmarish Vietnam epic, starring Marlon Brando and Martin Sheen, redefines the war flick and the dangers of the jungle."
  }),
  Movie.create({
    title:"Blade Runner",
    yearOfRelease:1982,
    synopsis:"Ridley Scott's moody futuristic thriller boasts stunning effects and unmissable performances by Harrison Ford and Sean Young."
  }),
  Movie.create({
    title:"To Kill A Mockingbird",
    yearOfRelease:1962,
    synopsis:"Harper Lee's story is poignantly reimagined in this 1962 coming-of-age pic with a career-defining performance by Gregory Peck."
  })
])
)



router.get("/movie", (req, res, next) => {
  Movie.findAll()
    .then(movies => {
      res.send(movies);
    })
    .catch(err => {
    next(err);
    });
});

router.post("/movie", (req, res, next) => {
  Movie.create(req.body)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log("got here");
      next(err);
    });
});


router.get("/movie/:id", (request, response, next) => {
  Movie.findByPk(request.params.id)
    .then(movie => response.send(movie))
    .catch(next);
});

router.put("/movie/:id", (request, response, next) =>
  Movie.findByPk(request.params.id)
    .then(movie => movie.update(request.body))
    .then(movie => response.send(movie))
    .catch(next)
);

router.delete("/movie/:id", (request, response, next) =>
  Movie.destroy({ where: { id: request.params.id } })
    .then(number => response.send({ number }))
    .catch(next)
);






// module.exports = Movie;