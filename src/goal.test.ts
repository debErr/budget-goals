import { test, expect } from "vitest";
import { remaining, progressPercent, totalSaved, monthlyNeeded, positiveOrZero, type Transaction, type Goal } from "./goal";

test("remaining считает остаток", () => {
    const goal: Goal = { title: "Машина", targetAmount: 800000, savedAmount: 127000, deadline: "2026-10-27"
    };
    expect(remaining(goal)).toBe(673000);   
});

test("Накоплено больше цели", () => {
    const goal: Goal = { title: "Машина", targetAmount: 800000, savedAmount: 850000, deadline: "2026-10-27"
    };
    expect(remaining(goal)).toBe(0);
});

test("Процент от цели", () => {
    const goal: Goal = { title: "Машина", targetAmount: 800000, savedAmount: 127000, deadline: "2026-10-27"
    };
    expect(progressPercent(goal)).toBe(15.88);
});

test("Превышено больше цели", () => {
    const goal: Goal = { title: "Машина", targetAmount: 800000, savedAmount: 850000, deadline: "2026-10-27"
    };
    expect(progressPercent(goal)).toBe(106.25);
});

test("Цель равно 0", () => {
    const goal: Goal = { title: "Машина", targetAmount: 0, savedAmount: 800000, deadline: "2026-10-27"
    };
    expect(progressPercent(goal)).toBe(0);
});

test("Сложение операций", () => {
    const transactions: Transaction[] = [
        { id: "a1", amount: 30000, date: "2027-10-29" }, 
        { id: "a2", amount: 40000, date: "2027-10-30" },
    ];
    expect(totalSaved(transactions)).toBe(70000);
});

test("Массив операций равен 0", () => {
    const transactions: Transaction[] = [];
    expect(totalSaved(transactions)).toBe(0);
});

test("Вычитание операций", () => {
    const transactions: Transaction[] = [
        { id: "b1", amount: 45000, date: "2027-10-15" },
        { id: "b2", amount: -5000, date: "2027-10-16" },
    ];
    expect(totalSaved(transactions)).toBe(40000);
});

test("monthlyNeeded: срок через 4 месяца", () => {
    const goal: Goal = { title: "Машина", targetAmount: 120000, savedAmount: 0, deadline: "2027-02-26" };
    expect(monthlyNeeded(goal, "2026-10-29")).toBe(30000);
});

test("monthlyNeeded: учитывает накопленное", () => {
    const goal: Goal = { title: "Машина", targetAmount: 120000, savedAmount: 60000, deadline: "2027-02-26" };
    expect(monthlyNeeded(goal, "2026-10-29")).toBe(15000);
});

test("monthlyNeeded: меньше месяца", () => {
    const goal: Goal = { title: "Машина", targetAmount: 100000, savedAmount: 10000, deadline: "2027-11-08" };
    expect(monthlyNeeded(goal, "2027-10-29")).toBe(90000);
});

test("monthlyNeeded: цель достигнута", () => {
    const goal: Goal = { title: "Машина", targetAmount: 100000, savedAmount: 100000, deadline: "2027-11-08" };
    expect(monthlyNeeded(goal, "2027-10-29")).toBe(0);
});

test("monthlyNeeded: срок в прошлом", () => {
    const goal: Goal = { title: "Машина", targetAmount: 100000, savedAmount:10000, deadline: "2026-10-01" };
    expect(monthlyNeeded(goal, "2026-11-01")).toBe(90000);
})

test("positiveOrZero: отрицательное число становится нулём", () => {
    expect(positiveOrZero(-5000)).toBe(0);
})


test("positiveOrZero: ноль остаётся нулём", () => {
    expect(positiveOrZero(0)).toBe(0);
})

test("positiveOrZero: положительное не меняется", () => {
    expect(positiveOrZero(5000)).toBe(5000);
})