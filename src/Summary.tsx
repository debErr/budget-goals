import { formatNumber, expectedSaved, remaining, type Goal } from "./goal"

type SummaryProps = {
    goal: Goal;
    startDate: string;
    today: string;
};

export function Summary({goal, startDate, today}: SummaryProps) {
    const planned = expectedSaved(goal, startDate, today);
    const diff = goal.savedAmount - planned;

    return (
        <div>
            <p className="result">Осталось накопить: {formatNumber(remaining(goal))} ₽</p>
                {startDate !== "" && goal.deadline !== "" && remaining(goal) === 0 && (
                    <p className="result">Цель достигнута</p>
                )}
                {startDate !== "" && goal.deadline !== "" && remaining(goal) > 0 && (
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
        </div>
    )
}