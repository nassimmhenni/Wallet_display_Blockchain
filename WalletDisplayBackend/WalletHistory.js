const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('./config/connect');
const walletHistory = require('./models/walletHistory');
// Initialize app
const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from the frontend






// Route to fetch wallet history by address
app.post('/api/get-wallet-history', async (req, res) => {
  const { walletAddress } = req.body;
  console.log("Received wallet address:", walletAddress); // Log the received address

  try {
    // Find transactions by wallet address
    const transactions = await walletHistory.find({ address: { $regex: new RegExp(walletAddress, "i") } });

    if (transactions.length > 0) {
      res.json(transactions);
    } else {
      res.status(404).json({ error: 'Aucune transaction trouvée pour cette adresse.' });
    }
  } catch (error) {
    console.error('Error fetching wallet history:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l’historique' });
  }
});

// Change the port if 3001 is in use
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
