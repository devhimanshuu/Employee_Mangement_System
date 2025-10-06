const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const dbFile = process.env.NODE_ENV === 'test' ? ':memory:' : './employees.db';
const db = new sqlite3.Database(dbFile);


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      position TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

const validateEmployee = (req, res, next) => {
  const { name, email, position } = req.body;
  

  if (!name || !email || !position) {
    return res.status(400).json({ error: 'Name, email, and position are required' });
  }
  

  if (!name.trim() || !email.trim() || !position.trim()) {
    return res.status(400).json({ error: 'Name, email, and position cannot be empty' });
  }
  
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  next();
};


app.get('/api/employees', (req, res) => {
  const { search } = req.query;
  let sql = 'SELECT * FROM employees';
  let params = [];
  
  if (search) {
    sql += ' WHERE name LIKE ? OR email LIKE ? OR position LIKE ?';
    const searchPattern = `%${search}%`;
    params = [searchPattern, searchPattern, searchPattern];
  }
  
  sql += ' ORDER BY created_at DESC';
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(row);
  });
});

app.post('/api/employees', validateEmployee, (req, res) => {
  const { name, email, position } = req.body;
  
  db.run(
    'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
    [name, email, position],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      
      db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
});

app.put('/api/employees/:id', validateEmployee, (req, res) => {
  const { id } = req.params;
  const { name, email, position } = req.body;
  
  db.run(
    'UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?',
    [name, email, position, id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    }
  );
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  });
});


app.use(express.static('public'));

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}


if (process.env.NODE_ENV !== 'test') {
  process.on('SIGINT', () => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
}

module.exports = app;
module.exports.db = db;