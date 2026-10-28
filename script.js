const display = document.querySelector("#display");
const keypad = document.querySelector(".keypad");
const tape = document.querySelector("#tape");
const tapeEmpty = document.querySelector("#tape-empty");
const tapeCount = document.querySelector("#tape-count");
const tearButton = document.querySelector("#tear-button");

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

let current = "0";
let previous = null;
let op = null;
let newNumber = false;
let error = false;
let chain = "";
let count = 0;

function show(text) {
  display.textContent = text;
}

// toPrecision fixes things like 0.1 + 0.2 = 0.30000000000000004
function clean(n) {
  return Number(n.toPrecision(12));
}

function format(n) {
  const num = clean(Number(n));
  return Object.is(num, -0) ? "0" : String(num);
}

function calculate(a, b, operator) {
  if (operator === "+") return clean(a + b);
  if (operator === "-") return clean(a - b);
  if (operator === "*") return clean(a * b);
  if (operator === "/") return b === 0 ? null : clean(a / b);
  return b;
}

function enterDigit(d) {
  if (error) clearAll();

  if (newNumber) {
    current = d === "." ? "0." : d;
    newNumber = false;
  } else if (d === ".") {
    if (!current.includes(".")) current += ".";
  } else {
    if (current.replace(/\D/g, "").length >= 12) return;
    current = current === "0" ? d : current + d;
  }
  show(current);
}

function setOperator(next) {
  if (error) return;
  const value = Number(current);

  if (op && !newNumber) {
    // there is already a pending operation, so finish it first (2 + 3 + ...)
    const result = calculate(previous, value, op);
    if (result === null) return showError();
    previous = result;
    current = format(result);
    chain += " " + format(value) + " " + symbols[next];
  } else {
    previous = value;
    chain = current + " " + symbols[next];
  }

  op = next;
  newNumber = true;
  show(current);
}

function pressEquals() {
  if (error) return;

  if (!op) {
    addToTape(current + " =", current);
    newNumber = true;
    return;
  }

  const right = Number(current);
  const last = newNumber ? format(previous) : current;
  const expression = chain + " " + last + " =";
  const result = calculate(previous, right, op);
  if (result === null) return showError();

  current = format(result);
  addToTape(expression, current);
  previous = null;
  op = null;
  chain = "";
  newNumber = true;
  show(current);
}

function showError() {
  current = "0";
  previous = null;
  op = null;
  chain = "";
  newNumber = true;
  error = true;
  show("Can't divide by zero");
}

function clearAll() {
  current = "0";
  previous = null;
  op = null;
  chain = "";
  newNumber = false;
  error = false;
  show("0");
}

function backspace() {
  if (error) return clearAll();
  if (newNumber) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-" || current === "-0") current = "0";
  show(current);
}

function negate() {
  if (error) return clearAll();
  if (Number(current) !== 0) {
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
  }
  show(current);
}

function percent() {
  if (error) return clearAll();
  current = format(Number(current) / 100);
  newNumber = false;
  show(current);
}

function addToTape(expression, result) {
  if (tapeEmpty.isConnected) tapeEmpty.remove();

  const row = document.createElement("article");
  row.className = "tape-entry";

  const expr = document.createElement("div");
  expr.className = "tape-entry__expression";
  expr.textContent = expression;

  const answer = document.createElement("div");
  answer.className = "tape-entry__result";
  answer.textContent = "= " + result;

  // clicking a row puts its result back on the screen
  const btn = document.createElement("button");
  btn.className = "tape-entry__button";
  btn.type = "button";
  btn.setAttribute("aria-label", "Use result " + result);
  btn.addEventListener("click", () => {
    current = result;
    previous = null;
    op = null;
    chain = "";
    newNumber = true;
    error = false;
    show(current);
  });

  row.append(expr, answer, btn);
  tape.append(row);

  count++;
  tapeCount.textContent = count + (count === 1 ? " entry" : " entries");
  tape.scrollTop = tape.scrollHeight;
}

function tearOff() {
  tape.classList.add("is-tearing");

  setTimeout(() => {
    tape.classList.remove("is-tearing");
    tape.querySelectorAll(".tape-entry").forEach((row) => row.remove());
    tape.append(tapeEmpty);
    count = 0;
    tapeCount.textContent = "0 entries";
  }, 380);
}

function handleKey(key) {
  if (/^\d$/.test(key) || key === ".") return enterDigit(key);
  if (key in symbols) return setOperator(key);
  if (key === "=") return pressEquals();
  if (key === "clear") return clearAll();
  if (key === "sign") return negate();
  if (key === "percent") return percent();
  if (key === "backspace") return backspace();
}

function flash(key) {
  const btn = keypad.querySelector(`[data-key="${key}"]`);
  if (!btn) return;
  btn.classList.add("is-pressed");
  setTimeout(() => btn.classList.remove("is-pressed"), 130);
}

keypad.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-key]");
  if (btn) handleKey(btn.dataset.key);
});

tearButton.addEventListener("click", tearOff);

// map keyboard keys to the same names the buttons use
const keyNames = { Enter: "=", Escape: "clear", Backspace: "backspace" };

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const key = keyNames[e.key] || e.key;
  const valid = /^[0-9.+\-*/=]$/.test(key) || key === "clear" || key === "backspace";
  if (!valid) return;

  e.preventDefault();
  handleKey(key);
  flash(key);
});