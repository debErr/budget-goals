import { test, expect } from "vitest";
import { remaining, progressPercent, type Goal } from "./goal";

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
    expect(progressPercent(goal)).toBe(15.88)
})

test("Превышено больше цели", () => {
    const goal: Goal = {
        title: "Машина",
        targetAmount: 800000,
        savedAmount: 850000,
    };
    expect(progressPercent(goal)).toBe(106.25)
})

test("Цель равно 0", () => {
    const goal: Goal = {
        title: "Машина",
        targetAmount: 0,
        savedAmount: 800000,
    };
    expect(progressPercent(goal)).toBe(0);
})