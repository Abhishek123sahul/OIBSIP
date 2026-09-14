const display = document.getElementById("display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "0";
let previousValue = "";
let currentOperation = null;
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentValue;
    previousDisplay.textContent = previousValue && currentOperation
        ? `${previousValue} ${currentOperation}`
        : "";
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentValue = "0";
        shouldResetDisplay = false;
    }

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function chooseOperation(operation) {
    if (currentOperation !== null && !shouldResetDisplay) {
        calculate();
    }

    previousValue = currentValue;
    currentOperation = operation;
    shouldResetDisplay = true;

    updateDisplay();
}

function calculate() {
    if (currentOperation === null || previousValue === "") {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    if (currentOperation === "+") {
        result = firstNumber + secondNumber;
    } else if (currentOperation === "-") {
        result = firstNumber - secondNumber;
    } else if (currentOperation === "×") {
        result = firstNumber * secondNumber;
    } else if (currentOperation === "÷") {

        if (secondNumber === 0) {
            currentValue = "Cannot divide by 0";
            previousValue = "";
            currentOperation = null;
            shouldResetDisplay = true;
            updateDisplay();
            return;
        }

        result = firstNumber / secondNumber;
    }

    if (!Number.isFinite(result)) {
        currentValue = "Error";
    } else {
        result = Number(result.toFixed(10));
        currentValue = result.toString();
    }

    previousValue = "";
    currentOperation = null;
    shouldResetDisplay = true;

    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = "";
    currentOperation = null;
    shouldResetDisplay = false;

    updateDisplay();
}

function deleteLastCharacter() {
    if (shouldResetDisplay || currentValue === "Cannot divide by 0") {
        return;
    }

    if (currentValue.length === 1) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
    });
});

actionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLastCharacter();
        }

        if (action === "equals") {
            calculate();
        }
    });
});

document.addEventListener("keydown", event => {

    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);
    }

    if (event.key === ".") {
        appendNumber(".");
    }

    if (event.key === "+") {
        chooseOperation("+");
    }

    if (event.key === "-") {
        chooseOperation("-");
    }

    if (event.key === "*") {
        chooseOperation("×");
    }

    if (event.key === "/") {
        event.preventDefault();
        chooseOperation("÷");
    }

    if (event.key === "Enter" || event.key === "=") {
        calculate();
    }

    if (event.key === "Escape") {
        clearCalculator();
    }

    if (event.key === "Backspace") {
        deleteLastCharacter();
    }
});

updateDisplay();