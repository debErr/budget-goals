import { useState, useEffect } from "react";
import { remaining, progressPercent, totalSaved, monthlyNeeded, positiveOrZero, type Transaction, type Goal } from "./goal";
import "./App.css";

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
    targetAmount: positiveOrZero(Number(targetAmount)),
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

  // Меньше ли 0?
  function handleTargetChange(value: string) {
    setTargetAmount(Number(value) < 0 ? "0" : value);
  }

  return (
    <div className="budget-block">
      <div className="card">
        <label htmlFor="">Название
          <input className="field" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)}   />
        </label>
        <label htmlFor="">Срок
          <input className="field" min={today} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
        </label>
        <p className="term">
          {deadline
          ? `Откладывать в месяц: ${monthlyNeeded(goal, today)} ₽`
          : "Укажите срок"}
        </p>
        <label htmlFor="">Сумма цели
          <input className="field" placeholder="Сумма цели" min="0" value={targetAmount} type="number" onChange={(e) => handleTargetChange(e.target.value)} />
        </label>
        <label htmlFor="">Сумма пополнния
          <input className="field" placeholder="Сумма пополнения" min="0" type="number" value={amount}
            onChange={(e) => setAmount(e.target.value)} />
        </label>
        <button className="btn" onClick={handleAdd}>Отложить</button>
        <p className="result">Осталось накопить: {remaining(goal)} ₽</p>
        <p className="result">Выполнено: {progressPercent(goal)} %</p>
        {/* Шкала заполнения */}
        <div className="scale-block">
          <div className="scale"
          style={{
            width: `${Math.min(100, progressPercent(goal))}%`,
          }}
          />
        </div>
        {/* Список добавленных операций с датой и суммой */}
        <ul>
          {transactions.map((t) => (
            <li className="ul-li" key={t.id}>
              
              {t.date}: {t.amount} ₽
              <button className="btn btn-ul" onClick={() => handleDel(t.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;