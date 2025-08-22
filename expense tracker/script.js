let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = localStorage.getItem("budget") ? Number(localStorage.getItem("budget")) : 0;

const budgetDisplay = document.getElementById("budget-display");
const balanceDisplay = document.getElementById("balance-display");
const transactionList = document.getElementById("transaction-list");

function setBudget() {
  budget = Number(document.getElementById("budget").value);
  localStorage.setItem("budget", budget);
  updateUI();
}

function addTransaction() {
  const desc = document.getElementById("desc").value;
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!desc || !amount) {
    alert("Please enter description and amount");
    return;
  }

  const transaction = { id: Date.now(), desc, amount, type };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  updateUI();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
}

function updateUI() {
  // Update Budget & Balance
  const income = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const balance = budget + income - expense;

  budgetDisplay.innerText = `Budget: ₹${budget}`;
  balanceDisplay.innerText = `Balance: ₹${balance}`;

  // Render Transaction List
  transactionList.innerHTML = "";
  transactions.forEach(t => {
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      ${t.desc} - ₹${t.amount}
      <button onclick="deleteTransaction(${t.id})">❌</button>
    `;
    transactionList.appendChild(li);
  });

  // Update Chart
  updateChart(income, expense);
}

// Chart.js
let chart;
function updateChart(income, expense) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    }
  });
}

// Initialize
updateUI();
