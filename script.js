const form = document.getElementById('expense-form');
const list = document.getElementById('transaction-list');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
renderTable();

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;

  const transaction = { id: Date.now(), type, amount, description, date };
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTable();
  form.reset();
});

function renderTable() {
  const filterType = document.getElementById('filter-type')?.value || "All";
  const fromDate = document.getElementById('filter-from')?.value;
  const toDate = document.getElementById('filter-to')?.value;

  const filtered = transactions.filter(t => {
    let matchesType = filterType === "All" || t.type === filterType;
    let matchesFrom = !fromDate || new Date(t.date) >= new Date(fromDate);
    let matchesTo = !toDate || new Date(t.date) <= new Date(toDate);
    return matchesType && matchesFrom && matchesTo;
  });

  // Reset table
  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<tr><td colspan='5'>No transactions found</td></tr>";
  } else {
    filtered.forEach((t) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${t.type}</td>
        <td>₹${t.amount}</td>
        <td>${t.description}</td>
        <td>${t.date}</td>
        <td><button onclick="deleteTransaction(${t.id})">❌</button></td>
      `;
      list.appendChild(row);
    });
  }

  // Calculate summary
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "Income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById('total-income').textContent = `₹${income}`;
  document.getElementById('total-expense').textContent = `₹${expense}`;
  document.getElementById('total-balance').textContent = `₹${income - expense}`;
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTable();
}
