const apiUrl = 'http://localhost:3000';

// Login Function
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      localStorage.setItem("user", username);
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  } catch {
    alert("Server unreachable");
  }
}

// View Balance
async function viewBalance() {
  const user = localStorage.getItem("user");
  try {
    const res = await fetch(`${apiUrl}/balance/${user}`);
    const data = await res.json();
    document.getElementById("balance").innerText = "Balance: ₹" + data.balance;
  } catch {
    alert("Unable to fetch data, please try again later");
  }
}

// Transfer Money
async function transfer() {
  const from = localStorage.getItem("user");
  const to = document.getElementById("to").value;
  const amount = Number(document.getElementById("amount").value);
  const remarks = document.getElementById("remarks").value;

  const res = await fetch(`${apiUrl}/transfer`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, amount, remarks })
  });

  const data = await res.json();
  if (res.ok) alert("Transaction successful");
  else alert(data.error);
}

// View Transaction History
async function viewTxns() {
  const user = localStorage.getItem("user");
  const res = await fetch(`${apiUrl}/transactions/${user}`);
  const data = await res.json();
  const txns = document.getElementById("txns");
  txns.innerHTML = "";

  if (data.message) {
    txns.innerText = data.message;
    return;
  }

  data.forEach(txn => {
    const li = document.createElement("li");
    li.textContent = `${txn.type} ₹${txn.amount} to/from ${txn.to || txn.from}`;
    txns.appendChild(li);
  });
}

// Change Password
async function changePassword() {
  const username = localStorage.getItem("user");
  const oldPassword = document.getElementById("old").value;
  const newPassword = document.getElementById("new").value;

  const res = await fetch(`${apiUrl}/change-password`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, oldPassword, newPassword })
  });

  const data = await res.json();
  alert(data.message || data.error);
}
