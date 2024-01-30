import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [history, setHistory] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        " https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
      );
      const results = response.data.results;
      // Fetch image data for each Pokemon
      const pokemonWithImages = await Promise.all(
        results.map(async (pokemon) => {
          const detailsResponse = await axios.get(pokemon.url);
          return detailsResponse.data;
        })
      );
      console.log('fetched')
      const shuffledPokemon = shuffleArray(pokemonWithImages);
      setPokemonData(shuffledPokemon);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  

  const handlePokemonClick = (pokemon) => {
    if (!history.includes(pokemon.id)) {
      setHistory([...history, pokemon.id]);
      setScore(score + 1);

      // If the current score is higher than the best score, update the best score
      if (score + 1 > bestScore) {
        setBestScore(score + 1);
      }
    } else {
      // Game over logic
      alert("Game Over! Your score: " + score);

      // Reset the game
      setScore(0);
      setHistory([]);
      fetchData(); // Shuffle the array again for a new game
    }

    // Shuffle the array again after a Pokemon is clicked
    const shuffledPokemon = shuffleArray(pokemonData);
    setPokemonData(shuffledPokemon);
  };

  const restartGame = () => {
    setScore(0);
    setHistory([]);
    fetchData(); // Shuffle the array again for a new game
  };

  return (
    <div className="relative bg-sky-800">
      <h1 className="text-4xl px-6 py-4">Pokemon Memory Game</h1>
      <div className="absolute right-4 top-4 p-4 flex flex-col bg-sky-600 rounded-lg text-white">
        <p className="font-bold text-xl">
          Score: <span>{score}</span>
        </p>
        <p className="font-bold text-xl">
          Best Score: <span>{bestScore}</span>
        </p>
      </div>
      <div>
        <ul className="grid grid-cols-5 gap-8 p-10 mt-6">
          {pokemonData.map((pokemon) => (
            <li
              key={pokemon.id}
              onClick={() => {
                handlePokemonClick(pokemon);
              }}
              className="border-8 border-sky-700 rounded-xl p-6 cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-black"
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="object-cover object-center w-[80%] h-[80%]"
              />
              <p className="text-white text-xl text-center">{pokemon.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
