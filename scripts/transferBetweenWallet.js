const { ethers } = require("hardhat");
const fs = require('fs');

const PRIVATE_KEYS_FILE = 'privateKeys.txt';
const RPC_ENDPOINT = "http://143.110.190.194:8547/";
const BATCH_SIZE = 150;
const TOTAL_TRANSACTIONS = 5000;

async function transferFundsBetweenWallets() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
  const privateKeys = fs.readFileSync(PRIVATE_KEYS_FILE, 'utf8').trim().split('\n');
  const wallets = privateKeys.map((privateKey) => new ethers.Wallet(privateKey, provider));

//   if (wallets.length < TOTAL_TRANSACTIONS) {
//     console.error('Not enough wallets for the specified total transactions.');
//     return;
//   }

  let transactionsSent = 0;
  let batchNumber = 0;

  while (transactionsSent < TOTAL_TRANSACTIONS) {
    const start = batchNumber * BATCH_SIZE;
    const end = Math.min((batchNumber + 1) * BATCH_SIZE, wallets.length);
    const promises = [];

    for (let i = start; i < end; i++) {
      const senderWallet = wallets[i];
      const receiverWallet = wallets[(i + 1) % wallets.length]; // Circular transfer

      const nonce = await provider.getTransactionCount(senderWallet.address, 'latest');

      const valueToSend = ethers.utils.parseEther('0.01'); // Change this value as needed
      const gasPrice = ethers.utils.parseUnits("50", "gwei"); // Adjust gas price as needed

      const transaction = {
        to: receiverWallet.address,
        value: valueToSend,
        gasLimit: 21000, // You can use a standard gas limit for value transfers.
        gasPrice: gasPrice,
        nonce: nonce, // Use the nonce of the sender wallet
        chainId: 903010,
      };

      const promise = senderWallet.sendTransaction(transaction);
      promises.push(promise);
    }

    try {
      const results = await Promise.all(promises);
      results.forEach((tx, index) => {
        console.log(`Transaction ${transactionsSent + index + 1} sent: ${tx.hash}`);
      });
      transactionsSent += BATCH_SIZE;
      batchNumber++;
    } catch (error) {
      console.error('Error sending transactions:', error);
    }
  }
}

transferFundsBetweenWallets();
