const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

const themeToggle = document.getElementById("themeToggle");

let expression = "";
let memory = 0;

// Update the display
function updateDisplay() {
    display.value = expression;
}

// Load history
function loadHistory(){

    const history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);

    });

}

// Save history
function saveHistory(item){

    const history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

    history.unshift(item);

    if(history.length > 20){

        history.pop();

    }

    localStorage.setItem("calculatorHistory", JSON.stringify(history));

    loadHistory();

}

// Calculate factorial
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return "Error";

    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}

// Evaluate a normal mathematical expression
function calculateExpression() {
    try {
        let exp = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/π/g, Math.PI)
            .replace(/\be\b/g, Math.E);
const originalExpression = expression;
        const answer = Function('"use strict"; return (' + exp + ')')();
        saveHistory(originalExpression + " = " + answer);

        if (!isFinite(answer)) {
            throw new Error();
        }

        expression = answer.toString();
        updateDisplay();

    } catch {

        expression = "";
        display.value = "Error";

    }
}

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        switch (value) {

            case "C":
                expression = "";
                updateDisplay();
                break;

            case "←":
                expression = expression.slice(0, -1);
                updateDisplay();
                break;

            case "=":
                calculateExpression();
                break;

            case "square":
                if (expression !== "") {
                    expression = (Number(expression) ** 2).toString();
                    updateDisplay();
                }
                break;

            case "sqrt":
                if (expression !== "") {
                    expression = Math.sqrt(Number(expression)).toString();
                    updateDisplay();
                }
                break;

            case "abs":
                if (expression !== "") {
                    expression = Math.abs(Number(expression)).toString();
                    updateDisplay();
                }
                break;

            case "1/x":
                if (expression !== "") {

                    const number = Number(expression);

                    if (number === 0) {

                        display.value = "Cannot divide by zero";
                        expression = "";

                    } else {

                        expression = (1 / number).toString();
                        updateDisplay();

                    }
                }
                break;

            case "pi":
                expression += Math.PI;
                updateDisplay();
                break;

            case "e":
                expression += Math.E;
                updateDisplay();
                break;

            case "sin":
                if (expression !== "") {
                    expression = Math.sin(Number(expression) * Math.PI / 180).toString();
                    updateDisplay();
                }
                break;

            case "cos":
                if (expression !== "") {
                    expression = Math.cos(Number(expression) * Math.PI / 180).toString();
                    updateDisplay();
                }
                break;

            case "tan":
                if (expression !== "") {
                    expression = Math.tan(Number(expression) * Math.PI / 180).toString();
                    updateDisplay();
                }
                break;

            case "log":
                if (expression !== "") {
                    expression = Math.log10(Number(expression)).toString();
                    updateDisplay();
                }
                break;

            case "ln":
                if (expression !== "") {
                    expression = Math.log(Number(expression)).toString();
                    updateDisplay();
                }
                break;

            case "factorial":
                if (expression !== "") {
                    expression = factorial(Number(expression)).toString();
                    updateDisplay();
                }
                break;

            case "M+":
                memory += Number(expression || 0);
                break;

            case "M-":
                memory -= Number(expression || 0);
                break;

            case "MR":
                expression = memory.toString();
                updateDisplay();
                break;

            case "MC":
                memory = 0;
                break;

            case "±":
                if (expression !== "") {
                    expression = (-Number(expression)).toString();
                    updateDisplay();
                }
                break;

            case "power":
                expression += "**";
                updateDisplay();
                break;

            default:
                expression += value;
                updateDisplay();
        }

    });

});

// ============================
// Keyboard Support
// ============================

document.addEventListener("keydown", (event) => {

    const key = event.key;

    // Numbers
    if (/^[0-9]$/.test(key)) {
        expression += key;
        updateDisplay();
        return;
    }

    // Decimal
    if (key === ".") {
        expression += ".";
        updateDisplay();
        return;
    }

    // Operators
    if (["+", "-", "*", "/"].includes(key)) {

        if (key === "*") {
            expression += "×";
        } else if (key === "/") {
            expression += "÷";
        } else {
            expression += key;
        }

        updateDisplay();
        return;
    }

    // Enter or =
    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateExpression();
        return;
    }

    // Backspace
    if (key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay();
        return;
    }

    // Delete or Escape
    if (key === "Delete" || key === "Escape") {
        expression = "";
        updateDisplay();
        return;
    }

});

// Clear history
clearHistoryBtn.addEventListener("click", () => {

    localStorage.removeItem("calculatorHistory");

    loadHistory();

    // ============================
// Theme Toggle
// ============================

function loadTheme(){

    const theme = localStorage.getItem("calculatorTheme");

    if(theme === "light"){

        document.body.classList.add("light");

        themeToggle.textContent = "🌙 Dark Mode";

    }else{

        themeToggle.textContent = "☀️ Light Mode";

    }

}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("calculatorTheme","light");

        themeToggle.textContent="🌙 Dark Mode";

    }else{

        localStorage.setItem("calculatorTheme","dark");

        themeToggle.textContent="☀️ Light Mode";

    }

});

loadTheme();

});

// Load history when page opens
loadHistory();