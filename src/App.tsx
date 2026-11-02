import { useState, useEffect } from "react";
import { progressPercent, totalSaved, positiveOrZero, type Transaction, type Goal } from "./goal";
import { ProgressBar } from "./ProgressBar";
import { TransactionList } from "./TransactionList";
import { useLocalStorage } from "./useLocalStorage";
import { Summary } from "./Summary";
import { GoalForm } from "./GoalForm";
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

  const [today] = useState(() => new Date().toLocaleDateString("sv-SE"));
  const isExpired = deadline !== "" && deadline < today;

  useEffect(() => {
     if (startDate === "" && deadline && Number(targetAmount) > 0) {
       setStartDate(today);
     }
   }, [startDate, targetAmount, deadline, today, setStartDate]);

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
       <GoalForm goal={goal} today={today} targetAmount={targetAmount} onTitleChange={setTitle} onDeadlineChagne={setDeadline} onTargetChange={handleTargetChange}/>
        <label>Сумма пополнения
          <input className="field" placeholder="20000" type="number" value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }} 
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-add" onClick={handleAdd}>Пополнить</button>
        <Summary goal={goal} startDate={startDate} today={today} />
        <p className="result">Выполнено: {progressPercent(goal)} %</p>
        <ProgressBar percent={progressPercent(goal)} />
        {/* Список добавленных операций с датой и суммой */}
        <TransactionList transactions={transactions} onDelete={handleDel} />
      </div>
    </div>
  );
}

export default App;