import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";

function App() {
  return (
    <div className="bg-neutral-300">
      <h1 className="text-2xl p-6">Memory Card Game</h1>
      <div className="grid grid-cols-5 gap-8 p-6">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
		<Card />
        <Card />
        <Card />
		<Card />
        <Card />
      </div>
    </div>
  );
}

export default App;
