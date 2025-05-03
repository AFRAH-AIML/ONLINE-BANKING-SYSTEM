const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let users = {
  alice: { password: "1234", balance: 5000, transactions: [] },
  bob: { password: "abcd", balance: 3000, transactions: [] },
  afrah:{password:"afrah#27",balance:70000,transactions:[]}
};

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    res.send({ message: "Login successful" });
  } else {
    res.status(401).send({ error: "Invalid credentials" });
  }
});

// View Balance
app.get("/balance/:username", (req, res) => {
  const user = users[req.params.username];
  if (user) {
    res.send({ balance: user.balance });
  } else {
    res.status(404).send({ error: "User not found" });
  }
});

// Transfer Money
app.post("/transfer", (req, res) => {
  const { from, to, amount, remarks } = req.body;
  const sender = users[from];
  const receiver = users[to];

  if (!sender || !receiver) {
    return res.status(404).send({ error: "User not found" });
  }

  if (sender.balance < amount) {
    return res.status(400).send({ error: "Insufficient balance" });
  }

  sender.balance -= amount;
  receiver.balance += amount;

  const txn = {
    to,
    from,
    amount,
    type: "transfer",
    remarks,
    date: new Date()
  };

  sender.transactions.push({ ...txn, to });
  receiver.transactions.push({ ...txn, from });

  res.send({ message: "Transfer successful" });
});

// Transaction History
app.get("/transactions/:username", (req, res) => {
  const user = users[req.params.username];
  if (!user) return res.status(404).send({ error: "User not found" });
  if (user.transactions.length === 0) {
    return res.send({ message: "No transactions found" });
  }
  res.send(user.transactions);
});

// Change Password
app.post("/change-password", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const user = users[username];

  if (!user) return res.status(404).send({ error: "User not found" });
  if (user.password !== oldPassword) {
    return res.status(400).send({ error: "Old password is incorrect" });
  }

  user.password = newPassword;
  res.send({ message: "Password changed successfully" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
