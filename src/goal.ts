// Чертёж: какие поля и какого типа
export type Goal = {
    title: string;
    targetAmount: number;
    savedAmount: number;
    deadline: string;
};

// Функция остатка
export function remaining(goal: Goal): number {
    return Math.max(0, goal.targetAmount - goal.savedAmount);
}

// Функция процент выполнения
export function progressPercent(goal: Goal): number {
    if (goal.targetAmount === 0) {
        return 0;
    }
    return Math.round(((goal.savedAmount / goal.targetAmount) * 100) * 100) / 100;
}

// Список операций. Массив пополнений
export type Transaction = {
    id: string;
    amount: number;
    date: string;
}

// Функция суммированания списка операций
export function totalSaved(transactions: Transaction[]): number {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
}

// Функция сколько осталось копить до цели
export function monthlyNeeded(goal: Goal, today: string): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = (new Date(goal.deadline).getTime() - new Date(today).getTime()) / msPerDay;
    const months = Math.max(1, days / 30);
    return Math.ceil(remaining(goal) / months);
}

// Функция проверки: сумма < 0?
export function positiveOrZero(amount: number): number {
    return amount < 0 ? 0 : amount;
}

// Функция раздедителя числа
export function formatNumber(amount: number): string { 
    return amount.toLocaleString("ru-RU");
}

// Функциия форматирвоания даты
export function formatDate(date: string): string {
    const formatedDate = date.split("-");
    return formatedDate.reverse().join(".");
}

// Функция пересчета
export function expectedSaved(goal: Goal, startDate: string, today: string): number {
    const start = new Date(startDate).getTime();
    const end = new Date(goal.deadline).getTime();
    const now = new Date(today).getTime();

    const total = end - start;
    if (total <= 0) return goal.targetAmount;

    const ratio = Math.min(1, Math.max(0, (now - start) / total));
    return Math.round(goal.targetAmount * ratio);
}