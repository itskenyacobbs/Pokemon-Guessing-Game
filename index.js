import express from "express";
const app = express();
const PORT = 3000;

//------------------------------ METHODS FOR EXTERNAL API EXTRACTION ---------------------------------

const decodeID = (encodedID) => {
	if (encodedID.length !== 4) {
		return "0";
	}
	return atob(encodedID);
};

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
	const game = await generateGameID();
	res.json(game);
});

app.get("/hint/:gameID/:n", async (req, res) => {
	const { gameID, n } = req.params;
	const decodeGameID = decodeID(gameID);
	const game_id = Number(decodeGameID);
	if (!Number(decodeGameID)) {
		res.status(400).json({ message: "invalid game id" });
	}
	if (Number(n) < 0 || Number(n) > 4) {
		res.status(400).json({
			message:
				"invalid hint number. Please choose a number between 0 and 4 included",
		});
	}
	const hintIndex = Number(n);
	console.log(game_id);
	console.log(hintIndex);
	const pokemon = await getPokemon(game_id);
	const hints = getHints(pokemon);
	const hint = hints[hintIndex];
	console.log(hint);
	res.json({ hint: hint });
});

app.get("/guess/:gameID/:guess", async (req, res) => {
	const { gameID, guess } = req.params;
	const game_id = decodeID(gameID);
	const id = Number(game_id);
	const pokemon = await getPokemon(id);
	if (pokemon.name === guess) {
		res.json({ isCorrect: "Congratulations correct pokemon!" });
	} else {
		res.json({ isCorrect: "Wrong try again" });
	}
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
