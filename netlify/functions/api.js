import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, '..', '..', 'src', 'data', 'accounts.json');

// Get all accounts
router.get('/accounts', async (req, res) => {
  try {
    const data = await fs.promises.readFile(dataPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.writeFile(dataPath, JSON.stringify({ accounts: [] }));
      res.json({ accounts: [] });
    } else {
      res.status(500).json({ error: 'Error reading accounts' });
    }
  }
});

// Add new account
router.post('/accounts', async (req, res) => {
  try {
    const data = await fs.promises.readFile(dataPath, 'utf8');
    const { accounts } = JSON.parse(data);
    
    const newAccount = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    accounts.push(newAccount);
    await fs.promises.writeFile(dataPath, JSON.stringify({ accounts }, null, 2));
    
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: 'Error saving account' });
  }
});

// Update account
router.put('/accounts/:id', async (req, res) => {
  try {
    const data = await fs.promises.readFile(dataPath, 'utf8');
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
    
    await fs.promises.writeFile(dataPath, JSON.stringify({ accounts }, null, 2));
    res.json(accounts[accountIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating account' });
  }
});

// Delete account
router.delete('/accounts/:id', async (req, res) => {
  try {
    const data = await fs.promises.readFile(dataPath, 'utf8');
    const { accounts } = JSON.parse(data);
    const accountId = req.params.id;
    
    const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
    
    if (filteredAccounts.length === accounts.length) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    await fs.promises.writeFile(dataPath, JSON.stringify({ accounts: filteredAccounts }, null, 2));
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting account' });
  }
});

app.use('/.netlify/functions/api', router);

export const handler = serverless(app);