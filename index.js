import express from "express";
const app = express();
const PORT = 3000;

//------------------------------ METHODS FOR EXTERNAL API EXTRACTION ---------------------------------

//To retreive the specific pokemon information for a pokemon by it's id 'i.e number'
const getPokemon = async (number) => {
  const url = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
  const pokemonData = await url.json();
  console.log(number);
  console.log("Pokemon name: ", pokemonData.name);
  return pokemonData; //The whole pokemon data is returned
};

//
const generateGameID = async () => {
  const randomNumber = Math.floor(Math.random() * 1350) + 1;
  const randomPokemon = await getPokemon(randomNumber);
  const gameID = btoa(randomPokemon.id.toString());
  console.log(gameID);
  //!TODO: for pokemon data when retrieving hints --> 5?
  for (let i = 0; i < 10; i++) {
    console.log(randomPokemon.moves[i].move.name);
  }
  return { game_id: gameID };
};

//--------------------------- EXPRESS ROUTES ----------------------------------

//Default route http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Hello :)");
});

app.get("/new", async (req, res) => {
  const { game_id } = await generateGameID();
  res.json({ id: game_id });
});

app.listen(PORT, () => {
  console.log(`Listening at Port: 3000`);
});

//---------- REUSABLE CODE -------------------
/* const name = "Pikachu";

const getApi = async () => {
  const url = await fetch(`https://pokeapi.co/api/v2/generation/1`);
  const parseUrl = await url.json();
  console.log(parseUrl);
  const coded = btoa(parseUrl.id);
  const decoded = atob(coded);
  console.log(coded);
  return coded;
  console.log(decoded);
};

const gameID = Buffer.from(randomPokemon.id.toString()).toString("base64");
*/
