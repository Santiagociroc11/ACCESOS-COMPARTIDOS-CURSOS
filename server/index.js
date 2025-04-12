import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const dataPath = path.join(__dirname, '..', 'src', 'data', 'accounts.json');

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataPath, JSON.stringify({ accounts: [] }));
      res.json({ accounts: [] });
    } else {
      res.status(500).json({ error: 'Error reading accounts' });
    }
  }
});

// Add new account
app.post('/api/accounts', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const { accounts } = JSON.parse(data);
    
    const newAccount = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    accounts.push(newAccount);
    await fs.writeFile(dataPath, JSON.stringify({ accounts }, null, 2));
    
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: 'Error saving account' });
  }
});

// Update account
app.put('/api/accounts/:id', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const { accounts } = JSON.parse(data);
    const accountId = req.params.id;
    
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    if (accountIndex === -1) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    accounts[accountIndex] = {
      ...accounts[accountIndex],
      ...req.body,
      id: accountId,
      createdAt: accounts[accountIndex].createdAt
    };
    
    await fs.writeFile(dataPath, JSON.stringify({ accounts }, null, 2));
    res.json(accounts[accountIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating account' });
  }
});

// Delete account
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const { accounts } = JSON.parse(data);
    const accountId = req.params.id;
    
    const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
    
    if (filteredAccounts.length === accounts.length) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    await fs.writeFile(dataPath, JSON.stringify({ accounts: filteredAccounts }, null, 2));
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting account' });
  }
});

// Serve static files in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});