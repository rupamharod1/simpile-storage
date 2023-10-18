const { ethers } = require("hardhat");
const fs = require('fs');


// Replace these with your private key and network configuration
const PRIVATE_KEY = "3fc744512ed8c4f80325781715ce481c18617ef0182414b5f0900b8f147bcb4d";
const RPC_ENDPOINT = "http://143.110.190.194:8547/";
const TransactionCount = 100;


async function createAndFundWallets() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const privateKeyFile = 'privateKeys.txt';
  
  for (let i = 0; i < TransactionCount; i++) {
    let promises = [];
    const currentNonce = await provider.getTransactionCount(wallet.address, 'latest');
    const newWallet = ethers.Wallet.createRandom();
    console.log(`Created wallet #${i + 1}:`);
    console.log(`Address: ${newWallet.address}`);
    console.log(`Private Key: ${newWallet.privateKey}`);
    fs.appendFile(privateKeyFile, newWallet.privateKey + '\n', (err) => {
      if (err) {
        console.error('Error writing private key to file:', err);
      } else {
        console.log(`Private key saved to ${privateKeyFile}`);
      }
    });
    
    // Transfer native Ethereum tokens to the newly created wallet
    const valueToSend = ethers.utils.parseEther('1'); // Change this value as needed
    const gasPrice = ethers.utils.parseUnits("100", "gwei");
    const transaction = {
      to: newWallet.address,
      gasLimit: 80000000,
      value: valueToSend,
      nonce: currentNonce, // Use the updated nonce here
      chainId: 903011,
    };

    const txResponse = await wallet.sendTransaction(transaction);
    const txReceipt = await txResponse.wait(1)
    console.log('Transaction sent:', txReceipt);

  }
}

createAndFundWallets();
