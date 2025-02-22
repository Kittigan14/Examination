const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) console.error('❌ Error connecting to SQLite:', err.message);
    else console.log('✅ Connected to SQLite database');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Customer (
            ID TEXT PRIMARY KEY,
            Name TEXT NOT NULL,
            Email TEXT UNIQUE NOT NULL,
            CountryCode TEXT NOT NULL,
            Budget INTEGER NOT NULL,
            Used INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS \`Order\` (
            ID TEXT PRIMARY KEY,
            Date TEXT NOT NULL,
            CustomerID TEXT,
            Amount INTEGER NOT NULL,
            FOREIGN KEY (CustomerID) REFERENCES Customer(ID) ON DELETE CASCADE
        )
    `);

    console.log("✅ Tables created successfully");

    const customers = [
        ["C001", "Will Peter", "will.p@hotmail.com", "TH", 1000000, 600000],
        ["C002", "John Smith", "john.smith@hotmail.com", "EN", 2000000, 800000],
        ["C003", "Jame Born", "jame.born@hotmail.com", "US", 3000000, 600000],
        ["C004", "Charlie Angel", "charlie.angel@hotmail.com", "US", 4000000, 1000000],
        ["C005", "Mickey Brown", "mickey.b@hotmail.com", "JP", 5000000, 1000000]
    ];

    customers.forEach(cust => {
        db.run(`
            INSERT INTO Customer (ID, Name, Email, CountryCode, Budget, Used) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON CONFLICT(ID) DO NOTHING
        `, cust);
    });

    const orders = [
        ["O001", "2019-10-08", "C002", 50000],
        ["O002", "2019-10-08", "C002", 45000],
        ["O003", "2019-11-20", "C003", 50000],
        ["O004", "2019-05-20", "C004", 40000]
    ];

    orders.forEach(ord => {
        db.run(`
            INSERT INTO \`Order\` (ID, Date, CustomerID, Amount) 
            VALUES (?, ?, ?, ?) 
            ON CONFLICT(ID) DO NOTHING
        `, ord);
    });

    console.log("✅ Data inserted successfully");
});

app.get('/high-used-customers', (req, res) => {
    const query = `SELECT * FROM Customer WHERE Used > 500000;`;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/customers', (req, res) => {
    const query = `
        SELECT 
            c.ID AS CustomerID, 
            c.Name, 
            c.Email, 
            c.CountryCode, 
            c.Budget, 
            c.Used, 
            o.ID AS OrderID, 
            o.Date, 
            o.Amount
        FROM Customer c
        LEFT JOIN \`Order\` o ON c.ID = o.CustomerID;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
