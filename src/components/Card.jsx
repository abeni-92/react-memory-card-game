const Card = () => {
  return (
    <div className="border-4 rounded-xl p-6 cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-black">
      <img
        src="/images/pokemon1.png"
        alt="pokemon image"
        className="object-center"
      />
      <p className="text-center">Anne Bonny</p>
    </div>
  );
};

export default Card;
