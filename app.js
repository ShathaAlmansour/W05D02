const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;
app.use(express.json());

app.get("/movies", (req, res) => {
  fs.readFile("./moveis.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    let allMov = [];
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].isdelete === false) allMov.push(movies[i]);
    }
    if (allMov.length !== 0) res.status(200).json(allMov);
    else res.status(200).send("No movies");
  });
});

app.get("/movie", (req, res) => {
  const id = req.query.id;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let finditem = movies.find((item) => {
      return item.id === Number(id);
    });

    if (finditem) res.status(200).json(finditem);
    else res.status(404).send("Not found");
  });
});

function addMovies(movies) {
  fs.writeFile("./movies.json", JSON.stringify(movies), () => {
    console.log("Add the movies");
  });
}


app.post("/create", (req, res) => {
  let { name } = req.body;
  fs.readFile("./movies.json", (err, data) => {
    let newMov = JSON.parse(data.toString());
    newMov.push({
      id: newMov.length + 1,
      name,
      isFav: false,
      isDelete: false,
    });

    addMovies(newMov);
    res.status(200).json(newMov);
  });
});

app.put("/update", (req, res) => {
  let updMovies = req.body;

  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let updMovies = movies.map((item) => {
      if (item.id === updMovies.id) {
        item.isfav = updMovies.isfav;
      }

      return item;
    });

    addMovies(updMovies);
    res.status(200).json(updMovies);
  });
});

app.get("/allFav", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let favMovies = [];
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].isfav === true) favMovies.push(movies[i]);
    }
    if (favMovies.length !== 0) res.status(200).json(favMovies);
    else res.status(404).send("Not found");
  });
});

app.put("/delete", (req, res) => {
  let delMovies = req.body.id;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let upMovies = movies.map((item) => {
      if (item.id === delMovies) {
        item.isdelete = true;
      }

      return item;
    });

    addMovies(upMovies);
    res.status(200).json(upMovies);
  });
});

app.delete("/delete", (req, res) => {
  let { id } = req.body;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let upMovies = movies.map((item) => {
      if (item.id === id) {
        item.isdelete = true;
      }

      return item;
    });

    addMovies(upMovies);
    res.status(200).json(upMovies);
  });
});


app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
