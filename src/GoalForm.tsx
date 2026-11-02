import { type Goal, formatNumber, monthlyNeeded } from "./goal";



type GoalFormProps = {
    goal: Goal;
    today: string;
    targetAmount: string;
    onTitleChange: (value: string) => void;
    onDeadlineChagne: (value: string) => void;
    onTargetChange: (value: string) => void;
}

export function GoalForm({goal, today, targetAmount, onDeadlineChagne, onTargetChange, onTitleChange}: GoalFormProps) {
    const isExpired = goal.deadline !== "" && goal.deadline < today;
    return (
        <div>
            <label>Название
                <input className="field" placeholder="Машина" value={goal.title} onChange={(e) => onTitleChange(e.target.value)}   />
            </label>
            <label>Срок
                <input className="field" min={today} type="date" value={goal.deadline} onChange={(e) => onDeadlineChagne(e.target.value)}/>
            </label>
                <p className="term">
                    {!goal.deadline
                        ? "Укажите срок"
                        : isExpired
                        ? "Срок уже прошёл"
                        : `Откладывать в месяц: ${formatNumber(monthlyNeeded(goal, today))} ₽`
                    }
                </p>
            <label>Сумма цели
                <input className="field" placeholder="1500000" min="0" value={targetAmount} type="number" onChange={(e) => onTargetChange(e.target.value)} />
            </label>
        </div>
    )
}