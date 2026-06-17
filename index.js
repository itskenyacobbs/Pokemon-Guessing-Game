import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
	res.send("Hello :)");
});

const name = "Pikachu";

const getApi = async (name) => {
	const url = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
	const parseUrl = await url.json();
	console.log(parseUrl.id);
	// const gameId = Number(parseUrl.id);
	const coded = btoa(parseUrl.id);
	const decoded = atob(coded);
	console.log(coded);
	console.log(decoded);
};

getApi(name);

app.listen(PORT, () => {
	console.log(`Listening at Port: 3000`);
});
