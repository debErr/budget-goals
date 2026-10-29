import { useState, useEffect } from "react";
import { remaining, progressPercent, totalSaved, monthlyNeeded, type Transaction, type Goal } from "./goal";

function App() {
  // Состояние для трех полей
  const [title, setTitle] = useState(() => load("title"));
  const [deadline, setDeadline] = useState(() => load("deadline"));
  const [targetAmount, setTargetAmount] = useState(() => load("targetAmount"));
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem("transactions");
      return saved ? JSON.parse(saved) : [];   // переводим строку обратно  в массив
    } catch {
      return [];
    }
  });
  const [amount, setAmount] = useState("");


  // Сохранение состояния при обноволении страницы
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions)); // Переводим массив в строку
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("title", title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem("targetAmount", targetAmount);
  }, [targetAmount]);

  useEffect(() => {
    localStorage.setItem("deadline", deadline);
  }, [deadline]);

  const goal: Goal = {
    title,
    targetAmount: Number(targetAmount),
    savedAmount: totalSaved(transactions),
    deadline,
  }

  const today = new Date().toISOString().slice(0, 10);

  // Функция чтение записи 
  function load(key: string): string {
    try {
      return localStorage.getItem(key) ?? "";
    } catch {
      return "";
    }
  }

  // Добавление операций
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

  // Удаление операций
  function handleDel(id: string) {
    setTransactions(transactions.filter((x) => x.id !== id));
  }

  return (
    <div>
      <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)}   />
      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
      <p>
        {deadline
         ? `Откладывать в месяц: ${monthlyNeeded(goal, today)} ₽`
         : "Укажите срок"}
      </p>
      <input placeholder="Сумма цели" value={targetAmount} type="number" onChange={(e) => setTargetAmount(e.target.value)} />
      <input placeholder="Сумма пополнения" type="number" value={amount}
        onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleAdd}>Отложить</button>
      <p>Осталось накопить: {remaining(goal)} ₽</p>
      <p>Выполнено: {progressPercent(goal)} %</p>
      {/* Шкала заполнения */}
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
      {/* Список добавленных операций с датой и суммой */}
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