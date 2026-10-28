// Чертёж: какие поля и какого типа
export type Goal = {
    title: string;
    targetAmount: number;
    savedAmount: number;
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