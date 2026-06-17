import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello :)");
});

const name = "Pikachu";

const getApi = async () => {
  const url = await fetch(`https://pokeapi.co/api/v2/generation/1`);
  const parseUrl = await url.json();
  console.log(parseUrl);
  //   const coded = btoa(parseUrl.id);
  //   //   const decoded = atob(coded);
  //   console.log(coded);
  //   return coded;
  //   console.log(decoded);
};
//23
const getID = async (number) => {
  const url = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
  const parsedURL = await url.json();
  console.log(number);
  console.log(parsedURL.name);
};

getID(Math.floor(Math.random() * 10));

app.get("/new", (req, res) => {
  res.send(`Listening, this is the data:`);
});

app.listen(PORT, () => {
  console.log(`Listening at Port: 3000`);
});

console.log();
