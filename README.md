### Collaborators:

**Kenya [itskenyacobbs (Kenya Cobbs) · GitHub](https://github.com/itskenyacobbs) & Yasmine** [YasmineRaef (Yasmine_Raef_M.) · GitHub](https://github.com/YasmineRaef)

### Project:

Create an Express Server with routes and external API extractor methods to mimic a pokemon guessing game. The game should have at least _three_ routes:

- `"/new"` : A _base64_ encoded **pokemon id** should be returned and the **number of hints** allowed. i.e ({game_id: "abc", available_hints: "123"}).

- `"hint/:gameID/:n"`: One hint statement that corresponds to the parameter `:n` and `:gameID` points to the specific pokemon _the encoded pokemon_id_.

- `"/guess/:gameID/:guess"`: A **_POST_** route, where the user send a guess for thepokemon name, and a response from the server should be recieved stating if the guess is right or not. i.e ({isCorrect: true/false}).

### Built:

1. Created _boilerplate_ for a **node.js** project using `yarn init -y` and added the **express** library using `yarn add express`.

2. Wrote the _default_ express route on port 3000.

```js
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello :)");
});

app.listen(PORT, () => {
  console.log(`Listening at Port: 3000`);
});
```

3. Created a method for retrieving a specific pokemon object _including it's information specs_ based upon the `pokemon_id` sent in the function as `number`.

```js
const getPokemon = async (number) => {
  const url = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);

  const pokemonData = await url.json();

  console.log(number);

  console.log("Pokemon name: ", pokemonData.name);

  return pokemonData; //The whole pokemon data is returned
};
```

4. Created a method for generating a random number between (1, 1350) to gamify the user's experience, so everytime the `/new` route is visited, a new game*id is generated representing a random pokemon.Then, the function returns the retrieved `pokemon id` encoded to \_base64*.

```js
const generateGameID = async () => {
  const randomNumber = Math.floor(Math.random() * 1350) + 1;

  const randomPokemon = await getPokemon(randomNumber);

  const gameID = btoa(randomPokemon.id.toString());

  console.log(gameID);

  return { game_id: gameID };
};
```

5. Created the `/new` express route that generates and displays a new game id for the user each time the route is visited.

```js
app.get("/new", async (req, res) => {
  const { game_id } = await generateGameID();

  res.json({ id: game_id });
});
```

6. Created the `/hint` express route that returns the hint of the pokemon that was randomly generated. Implemented the error codes if user enters an invalid game id or an invalid hint number.

```js
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
```

7. Created the `/guess` route which is where the user guesses which pokemon they generated inside the URL and validates if the hint was correct or incorrect.

```js
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
```

5. Extracting the hints from the pokemon object retrieved and displaying them to the user based on the `:n` parameter.

6. Creating the `hint/` route to display the hint based on the index.

7. Create the `guess/` route to check the user's guess and validate it.

8. Created a `giveup/` route that returns the name of the pokemon when the user gives up.

```js
app.get("/giveup/:gameID", async (req, res) => {
  const gameID = req.params.gameID;
  const decoded_game_id = decodeID(gameID);
  const game_id = Number(decoded_game_id);
  const pokemon = await getPokemon(game_id);
  res.json({ answer: pokemon.name });
});
```

### Current work in progress:

- Create Swagger documentation.
- Design and implement a React frontend that could communicate with the express server to have more visual appealing game simulation.
