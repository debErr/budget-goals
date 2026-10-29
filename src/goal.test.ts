import { test, expect } from "vitest";
import { remaining, progressPercent, totalSaved, type Transaction, type Goal } from "./goal";

test("remaining считает остаток", () => {
    const goal: Goal = {
        title: "Машина",
        targetAmount: 800000,
        savedAmount: 127000,
    };
    expect(remaining(goal)).toBe(673000);   
});

test("Накоплено больше цели", () => {
    const goal: Goal = {
        title: "Машина",
        targetAmount: 800000,
        savedAmount: 850000,
    };
    expect(remaining(goal)).toBe(0);
});

test("Процент от цели", () => {
    const goal: Goal = {
        title: "Машина",
        targetAmount: 800000,
        savedAmount: 127000,
    };
    expect(progressPercent(goal)).toBe(15.88);
});

test("Превышено больше цели", () => {
    const goal: Goal = {
        title: "Машина",
        targetAmount: 800000,
        savedAmount: 850000,
    };
    expect(progressPercent(goal)).toBe(106.25);
});

test("Цель равно 0", () => {
    const goal: Goal = {
        title: "Машина",
        targetAmount: 0,
        savedAmount: 800000,
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