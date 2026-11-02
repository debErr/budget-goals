import { useState, useEffect } from "react";
import { remaining, progressPercent, totalSaved, monthlyNeeded, positiveOrZero, formatNumber, expectedSaved, type Transaction, type Goal } from "./goal";
import { ProgressBar } from "./ProgressBar";
import { TransactionList } from "./TransactionList";
import { useLocalStorage } from "./useLocalStorage";
import "./App.css";

function App() {
  // Состояние для трех полей
  const [title, setTitle] = useLocalStorage("title", "");
  const [deadline, setDeadline] = useLocalStorage("deadline", "");
  const [targetAmount, setTargetAmount] = useLocalStorage("targetAmount", "");
  const [startDate, setStartDate] = useLocalStorage("startDate", "");
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", []);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const goal: Goal = {
    title,
    targetAmount:positiveOrZero(Number(targetAmount)),
    savedAmount: totalSaved(transactions),
    deadline,
  }

  const today = new Date().toLocaleDateString("sv-SE");
  const isExpired = deadline !== "" && deadline < today;
  
  const planned = expectedSaved(goal, startDate, today);
  const diff = totalSaved(transactions) - planned;

  useEffect(() => {
     if (startDate === "" && deadline && Number(targetAmount) > 0) {
       setStartDate(today);
     }
   }, [startDate, targetAmount, deadline]);

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
        <button className="btn btn-add" onClick={handleAdd}>Пополнить</button>
        <p className="result">Осталось накопить: {formatNumber(remaining(goal))} ₽</p>
        <p className="result">Выполнено: {progressPercent(goal)} %</p>
        {startDate !== "" && deadline !== "" && remaining(goal) === 0 && (
            <p className="result">Цель достигнута</p>
        )}
        {startDate !== "" && deadline !== "" && remaining(goal) > 0 && (
          <>
            <p className="result">По плану на сегодня: {formatNumber(planned)} ₽</p>
            <p className="result">
              {diff === 0
              ? "Точно по плану"
              : diff > 0
                ? `Вы впереди графика на ${formatNumber(diff)} ₽`
                : `Отстаёте от плана на ${formatNumber(Math.abs(diff))} ₽`
              }
            </p>
          </>
        )}
        <ProgressBar percent={progressPercent(goal)} />
        {/* Список добавленных операций с датой и суммой */}
        <TransactionList transactions={transactions} onDelete={handleDel} />
      </div>
    </div>
  );
}

export default App;