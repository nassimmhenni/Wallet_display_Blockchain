const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const walletHistory = require('./models/walletHistory');
require('./config/connect');
const app = express();
const port = 3001;

// Middleware CORS pour autoriser les requêtes du frontend
app.use(cors());
app.use(express.json());

// Configurer le provider ethers.js
const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');

const tokenAddresses = {
    USDC: '0x89C8da7569085D406800C473619d0c6B7AC0CE8E', // Adresse USDC sur BSC
    USDT: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // Adresse USDT sur BSC
    BUSD: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'  // Adresse BUSD sur BSC
};

const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)"
];

async function getTokenBalance(tokenAddress, walletAddress) {
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const balance = await contract.balanceOf(walletAddress);
    return ethers.utils.formatUnits(balance, 18); // Assumer 18 décimales, ajustez selon le token si nécessaire
}

// Route pour vérifier l'adresse et récupérer le solde
app.post('/api/get-balance', async (req, res) => {
    const { walletAddress } = req.body;

    try {
        // Vérifier si l'adresse est valide
        if (!ethers.utils.isAddress(walletAddress)) {
            return res.status(400).send({ error: "Adresse de portefeuille invalide" });
        }

        const balances = {}; // Object to accumulate balances
        const etherBalance = await provider.getBalance(walletAddress);
        balances['TBNB'] = ethers.utils.formatEther(etherBalance);

        for (const [token, address] of Object.entries(tokenAddresses)) {
            const balance = await getTokenBalance(address, walletAddress);
            balances[token] = balance; // Accumulate balance in the object
        }




       const newTransaction = new walletHistory({
            id: Date.now(), // Utilisation d'une valeur temporelle comme ID unique
            date: new Date(), // Date actuelle de l'observation
            address: walletAddress, // Adresse du portefeuille
            bnb_balance: balances['TBNB'], // Balance BNB
            usdc_balance: balances['USDC'], // Balance USDC
            usdt_balance: balances['USDT'], // Balance USDT
            busd_balance: balances['BUSD'], // Balance BUSD
        });
        await newTransaction.save();


        res.status(200).send(balances); // Send the accumulated balances
        
    } catch (error) {
        console.error('Erreur lors de la récupération du solde:', error);
        res.status(500).send({ error: 'Erreur lors de la récupération du solde' });
    }
});

app.listen(port, () => {
    console.log(`Backend écoute sur le port ${port}`);
});
