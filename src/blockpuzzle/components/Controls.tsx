const Controls = () => {
  return (
    <div className="text-sm mb-6">
      <p className="mb-2">Controls:</p>
      <ul>
        <li>Enter: start/pause game</li>
        <li>Arrow Left: move piece left</li>
        <li>Arrow Right: move piece right</li>
        <li>Arrow Down: drop pieces</li>
        <li>Arrow Up: rotate piece clockwise</li>
      </ul>
    </div>
  );
};

export default Controls;
