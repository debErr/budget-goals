import { useState } from "react";
import { remaining, progressPercent, totalSaved, type Transaction, type Goal } from "./goal";

function App() {
  // Состояние для трех полей
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");

  const goal: Goal = {
    title,
    targetAmount: Number(targetAmount),
    savedAmount: totalSaved(transactions),
  }

  function handleAdd() {
    const value = Number(amount);
    if (!value) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: value,
      date: new Date().toISOString().slice(0, 10),
    };
    setTransactions([...transactions, newTransaction]);
    setAmount("");
  }

  function handleDel(id: string) {
    setTransactions(transactions.filter((x) => x.id !== id));
  }

  return (
    <div>
      <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)}   />
      <input placeholder="Сумма цели" value={targetAmount} type="number" onChange={(e) => setTargetAmount(e.target.value)} />
      <input placeholder="Сумма пополнения" type="number" value={amount}
        onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleAdd}>Отложить</button>
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
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            
            {t.date}: {t.amount} ₽
            <button onClick={() => handleDel(t.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;