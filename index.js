import express from "express";
const app = express();
const PORT = 3000;

//------------------------------ METHODS FOR EXTERNAL API EXTRACTION ---------------------------------

const decodeID = (encodedID) => {
  try {
    return atob(encodedID);
  } catch (errorMessage) {
    return NaN;
  }
};

//To retreive the specific pokemon information for a pokemon by it's id 'i.e number'
const getPokemon = async (number) => {
  try {
    const url = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
    if (!url.ok) return null; //If external pokeAPI failed
    const pokemonData = await url.json();
    console.log(number);
    console.log("Pokemon name: ", pokemonData.name);
    return pokemonData; //The whole pokemon data is returned
  } catch (errorMessage) {
    return null; //network error, timeout
  }
};

const checkPokemon = async (id) => {
  if (Number.isNaN(id)) {
    return { error: "invalid-id" };
  }
  const pokemon = await getPokemon(id);
  if (!pokemon) {
    return { error: "api-failure" };
  }
  return { pokemon };
};

//Generating Pokemon hints
const getHints = (pokemonData) => {
  //!TODO: for pokemon data when retrieving hints --> 5?
  return [
    { height: pokemonData.height },
    { cryLink: pokemonData.cries.latest },
    { weight: pokemonData.weight },
    { abilities: pokemonData.abilities[0].ability.name },
    { image: pokemonData.sprites.front_default },
  ];
};

//
const generateGameID = async () => {
  const randomNumber = Math.floor(Math.random() * 1024) + 1;
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
  try {
    const game = await generateGameID();
    if (!game) {
      return res.status(502).json({ message: "Failed to reach pokemon API" });
    }
    res.json(game);
  } catch (errorMessage) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/hint/:gameID/:n", async (req, res) => {
  try {
    const { gameID, n } = req.params;
    const game_id = Number(decodeID(gameID));
    const pokemonResult = await checkPokemon(game_id);
    if (pokemonResult.error === "invalid-id") {
      return res.status(400).json({
        message: "Invalid game Id, please enter a valid game id.",
      });
    }
    if (pokemonResult.error === "api-failure") {
      return res.status(502).json({ message: "Pokemon API unavailable." });
    }
    const hintIndex = Number(n);
    if (Number.isNaN(hintIndex)) {
      return res
        .status(400)
        .json({ message: "Invalid hint number. Must be a number." });
    }
    if (hintIndex < 0 || hintIndex > 4) {
      return res.status(400).json({
        message:
          "Hint number out of range. Please choose a number between 0 and 4 included",
      });
    }
    const pokemon = pokemonResult.pokemon;
    console.log(game_id);
    console.log(hintIndex);
    const hints = getHints(pokemon);
    const hint = hints[hintIndex];
    console.log(hint);
    res.json({ hintNumber: hintIndex, hint: hint });
  } catch (errorMessage) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/guess/:gameID/:guess", async (req, res) => {
  try {
    const { gameID, guess } = req.params;
    const game_id = Number(decodeID(gameID));
    const pokemonResult = await checkPokemon(game_id);
    if (pokemonResult.error === "invalid-id") {
      return res.status(400).json({
        message: "Invalid game Id, please enter a valid game id.",
      });
    }
    if (pokemonResult.error === "api-failure") {
      return res.status(502).json({ message: "Pokemon API unavailable." });
    }
    if (!isNaN(Number(guess))) {
      return res.status(400).json({
        message:
          "Invalid pokemon name. Please enter a valid pokemon name, e.g. pikachu.",
      });
    }
    const pokemon = pokemonResult.pokemon;
    if (pokemon.name === guess.toLowerCase()) {
      return res.json({
        isCorrect: "Congratulations correct pokemon!",
        pokemon: pokemon.name,
      });
    }
    return res.json({ isCorrect: "Wrong try again" });
  } catch (errorMessage) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/giveup/:gameID", async (req, res) => {
  try {
    const gameID = req.params.gameID;
    const game_id = Number(decodeID(gameID));
    const pokemonResult = await checkPokemon(game_id);
    if (pokemonResult.error === "invalid-id") {
      return res.status(400).json({
        message: "Invalid game Id, please enter a valid game id.",
      });
    }
    if (pokemonResult.error === "api-failure") {
      return res.status(502).json({ message: "Pokemon API unavailable." });
    }
    const pokemon = pokemonResult.pokemon;
    res.json({ answer: pokemon.name });
  } catch (errorMessage) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening at Port: 3000`);
});
