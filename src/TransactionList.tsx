import type { Transaction } from "./goal";
import { formatNumber, formatDate } from "./goal";

type TransactionListProps = {
    transactions: Transaction [];
    onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
    return (
        <ul className="operations">
          {transactions.map((t) => (
            <li className="operation" key={t.id}>
              
              {formatDate(t.date)}: {formatNumber(t.amount)} ₽
              <button className="btn btn-del-operations" onClick={() => onDelete(t.id)}>Удалить</button>
            </li>
          ))}
        </ul>
    )
}