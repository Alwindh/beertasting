import "./App.css";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import CustomSlider from "./customSlider";
import CustomSelect from "./customSelect";

function createInitialRatings(beersList) {
	var ratingList = {};
	beersList.forEach((beer) => {
		ratingList[beer.id] = 0;
	});
	return ratingList;
}

function createInitialGuesses(beersList) {
	var guessList = {};
	beersList.forEach((beer) => {
		guessList[beer.id] = undefined;
	});
	return guessList;
}

function createInitialErrors(beersList) {
	var errorList = {};
	beersList.forEach((beer) => {
		errorList[beer.id] = undefined;
	});
	return errorList;
}

function App() {
	var beerData = require("./beers.json");
	const [beers] = useState(beerData);
	var initialRatings = createInitialRatings(beerData);
	const [ratings, setRatings] = useState(initialRatings);
	var initialGuesses = createInitialGuesses(beerData);
	const [guesses, setGuesses] = useState(initialGuesses);
	var initialErrors = createInitialErrors(beerData);
	const [errors, setErrors] = useState(initialErrors);
	const [loadedCookies, setLoadedCookies] = useState(false);
	if (loadedCookies === false) {
		loadCookies();
		setLoadedCookies(true);
	}

	const handleSliderChange = (targetName, newValue) => {
		var newRatings = Object.assign({}, ratings);
		newRatings[targetName] = newValue;
		setRatings(newRatings);
		saveCookie("ratings", newRatings);
	};

	const handleSelectChange = (targetName, newValue) => {
		var newGuesses = Object.assign({}, guesses);
		newGuesses[targetName] = newValue;
		setGuesses(newGuesses);
		findDoubles(newGuesses);
		saveCookie("guesses", newGuesses);
	};

	function saveCookie(targetName, targetValue) {
		const stringified = JSON.stringify(targetValue);
		document.cookie = targetName + "=" + stringified;
	}

	function loadCookies() {
		if (document.cookie) {
			var guessesCookie = getCookie("guesses");
			var guessesJson = JSON.parse(guessesCookie);
			var ratingsCookie = getCookie("ratings");
			var ratingsJson = JSON.parse(ratingsCookie);
			setRatings(ratingsJson);
			setGuesses(guessesJson);
			findDoubles(guessesJson);
		}
	}

	function getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	async function findDoubles(checkList) {
		var dummyArr = {};
		for (var keyCheck in checkList) {
			const guessName = checkList[keyCheck];
			if (dummyArr[guessName] === undefined) {
				dummyArr[guessName] = 1;
			} else {
				dummyArr[guessName] += 1;
			}
		}
		var newErrors = Object.assign({}, createInitialErrors);
		for (var key in dummyArr) {
			if (dummyArr[key] > 1) {
				for (const keySec in checkList) {
					if (checkList[keySec] === key) {
						newErrors[keySec] = "Already selected";
					}
				}
			}
		}
		if (newErrors !== errors) {
			setErrors(newErrors);
		}
	}

	const buildAccordion = () => {
		return beers.map((beer) => {
			return (
				<Accordion key={beer.id}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<span className="descText centert">
							{beer.name}
							{ratings[beer.id] === 0 ? "" : <div className="guess">{ratings[beer.id]}</div>}
							{guesses[beer.id] === undefined ? (
								""
							) : errors[beer.id] ? (
								<div className="guess wrong">{guesses[beer.id].toUpperCase()}</div>
							) : (
								<div className="guess">{guesses[beer.id].toUpperCase()}</div>
							)}
						</span>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<Stack spacing={2}>
									<div className="descText">Style</div>
									<div className="subText">{beer.style}</div>
								</Stack>
							</Grid>
							<Grid item xs={6}>
								<Stack spacing={2}>
									<div className="descText">Brewery</div>
									<div className="subText">{beer.brewery}</div>
								</Stack>
							</Grid>
							<Grid item xs={6}>
								<Stack spacing={2}>
									<div className="descText">ABV</div>
									<div className="subText">{beer.abv}</div>
								</Stack>
							</Grid>
							<Grid item xs={6}>
								<Stack spacing={2}>
									<div className="descText">IBU</div>
									<div className="subText">{beer.ibu}</div>
								</Stack>
							</Grid>
							<Grid item xs={2}>
								<div style={{ display: "flex", justifyContent: "center" }} className="descText">
									{ratings[beer.id]}
								</div>
							</Grid>
							<Grid item xs={10}>
								<CustomSlider
									handleSliderChange={handleSliderChange}
									initialRating={ratings[beer.id]}
									targetName={beer.id}
								/>
							</Grid>
							<Grid style={{ marginTop: "-1em" }} item xs={12}>
								<CustomSelect
									handleSelectChange={handleSelectChange}
									initialGuess={guesses[beer.id]}
									targetName={beer.id}
								/>
							</Grid>
						</Grid>
						<div className="errorMessage">{errors[beer.id]}</div>
					</AccordionDetails>
				</Accordion>
			);
		});
	};

	return (
		<Container style={{ marginTop: "1em", marginBottom: "1em" }}>
			<Paper>{buildAccordion()}</Paper>
		</Container>
	);
}

export default App;
