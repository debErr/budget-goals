import { useState, useEffect} from "react";
import { remaining, progressPercent, totalSaved, monthlyNeeded, positiveOrZero, formatNumber, formatDate, type Transaction, type Goal } from "./goal";
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
  const [error, setError] = useState("");


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
    targetAmount:positiveOrZero(Number(targetAmount)),
    savedAmount: totalSaved(transactions),
    deadline,
  }

  const today = new Date().toLocaleDateString("sv-SE");
  const isExpired = deadline !== "" && deadline < today;

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
    if (totalSaved(transactions) + value < 0) {
      setError("Нельзя снимать больше отложенной суммы");
      return;
    }

    if (!deadline) {
      setError("Сначала укажите срок!");
      return;
    };

    if (isExpired) {
      setError("Срок уже прошёл, измените его!");
      return;
    };

    if (!targetAmount || Number(targetAmount) <= 0) {
      setError("Укажите сначала сумму цели!");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: value,
      date: today,
    };
    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setError("");
  }

  // Удаление операций
  function handleDel(id: string) {
    setTransactions(transactions.filter((x) => x.id !== id));
  }

  // Меньше ли сумма цели 0?
  function handleTargetChange(value: string) {
    setTargetAmount(Number(value) < 0 ? "0" : value);
  }

  return (
    <div className="budget-block">
      <div className="card">
        <label>Название
          <input className="field" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)}   />
        </label>
        <label>Срок
          <input className="field" min={today} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
        </label>
        <p className="term">
          {!deadline
          ? "Укажите срок"
          : isExpired
            ? "Срок уже прошёл"
            : `Откладывать в месяц: ${formatNumber(monthlyNeeded(goal, today))} ₽`
          }
        </p>
        <label>Сумма цели
          <input className="field" placeholder="Сумма цели" min="0" value={targetAmount} type="number" onChange={(e) => handleTargetChange(e.target.value)} />
        </label>
        <label>Сумма пополнения
          <input className="field" placeholder="Сумма пополнения" type="number" value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }} 
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" onClick={handleAdd}>Пополнить</button>
        <p className="result">Осталось накопить: {formatNumber(remaining(goal))} ₽</p>
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
              
              {formatDate(t.date)}: {formatNumber(t.amount)} ₽
              <button className="btn btn-ul" onClick={() => handleDel(t.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;