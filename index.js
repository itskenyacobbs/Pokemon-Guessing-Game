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

//Generating Pokemon hints
const getHints = (pokemonData) => {
  //!TODO: for pokemon data when retrieving hints --> 5?
  return {
    height: pokemonData.height,
    moves: [pokemonData.moves[0].move.name, pokemonData.moves[1].move.name],
    cryLink: pokemonData.cries.latest,
    weight: pokemonData.weight,
    abilities: pokemonData.abilities[0].ability.name,
  };
};

//
const generateGameID = async () => {
  const randomNumber = Math.floor(Math.random() * 1350) + 1;
  const randomPokemon = await getPokemon(randomNumber);
  const gameID = btoa(randomPokemon.id.toString());
  console.log(gameID);
  const hintObject = getHints(randomPokemon);
  console.log(hintObject);
  return { game_id: gameID, hints: 5 };
};

//--------------------------- EXPRESS ROUTES ----------------------------------

//Default route http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Hello :)");
});

app.get("/new", async (req, res) => {
  const game = await generateGameID();
  res.json(game);
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
