import { useState } from "react";
import { remaining, progressPercent, type Goal } from "./goal";

function App() {
  // Состояние для трех полей
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");

  const goal: Goal = {
    title,
    targetAmount: Number(targetAmount),
    savedAmount: Number(savedAmount),
  }

  return (
    <div>
      <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)}   />
      <input placeholder="Сумма цели" value={targetAmount} type="number" onChange={(e) => setTargetAmount(e.target.value)} />
      <input placeholder="Накоплено" value={savedAmount} type="number" onChange={(e) => setSavedAmount(e.target.value)} />
      <p>Осталось накопить: {remaining(goal)} ₽</p>
      <p>Выполнено: {progressPercent(goal)} %</p>
      <div style={{background: "#444", height: 12, borderRadius: 6, width: 300}}>
        <div
        style={{
          background: "#4caf50",
          height: "100%",
          borderRadius: 6,
          width: `${Math.min(100, progressPercent(goal))}%`,
        }}
        />
      </div>
    </div>
  );
}

export default App;