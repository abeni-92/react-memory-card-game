// PokemonList.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(' https://pokeapi.co/api/v2/pokemon?limit=15&offset=0');
        const results = response.data.results;
        // console.log(results);
        // Fetch image data for each Pokemon
        const pokemonWithImages = await Promise.all(
          results.map(async (pokemon) => {
            const detailsResponse = await axios.get(pokemon.url);
            // console.log(detailsResponse.data);
            return detailsResponse.data;
          })
        );

        setPokemonData(pokemonWithImages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that useEffect runs once when the component mounts

  return (
    <div>
      <ul className='grid grid-cols-5 gap-8 p-10 mt-6'>
        {pokemonData.map((pokemon) => (
          <li key={pokemon.id} className='border-8 border-sky-700 rounded-xl p-6 cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-black'>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className='object-cover object-center w-[80%] h-[80%]'/>
            <p className='text-white text-xl text-center'>{pokemon.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;
