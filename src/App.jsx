import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";

function App() {
  const [history, setHistory] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=15&offset=0"
      );
      const results = response.data.results;
      // Fetch image data for each Pokemon
      const pokemonWithImages = await Promise.all(
        results.map(async (pokemon) => {
          const detailsResponse = await axios.get(pokemon.url);
          return detailsResponse.data;
        })
      );
      console.log("fetched");
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
    if (!gameOver) {
      if (!history.includes(pokemon.id)) {
        setHistory([...history, pokemon.id]);
        setScore(score + 1);
        const shuffledPokemon = shuffleArray(pokemonData);
        setPokemonData(shuffledPokemon);
      } else {
        console.log("Already clicked! Game Over!");
        if (score > bestScore) {
          setBestScore(score);
        }
        // Set game over state
        setGameOver(true);
      }
    }
  };

  const restartGame = () => {
    setScore(0);
    setHistory([]);
    setGameOver(false);
    fetchData(); // Shuffle the array again for a new game
  };

  return (
    <div className="relative w-full min-h-screen bg-sky-800">
      <div className={`${gameOver ? "blur-md pointer-events-none" : ""}`}>
        <h1 className="text-4xl text-white px-6 py-4">Pokemon Memory Game</h1>
        <div className="absolute right-4 top-4 p-4 flex flex-col bg-sky-900 rounded-lg text-white">
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
      {gameOver && (
        <div className="absolute top-20 right-[30%] bg-sky-900 w-1/3 h-96 text-center rounded-xl">
          <div className="my-20 text-white">
            <h1 className="text-4xl py-4">Game Over</h1>
            <h2 className="text-xl">You Scored: {score}</h2>
          </div>
          <div className="flex flex-col items-center text-white">
            <p className="text-xl p-2">Play Again</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-8 h-8 fill-current cursor-pointer"
              onClick={restartGame}
            >
              <path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
