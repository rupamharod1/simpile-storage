const hre = require("hardhat");


async function main() {
  const deployNetwork = hre.network.name

  const greetingText = "Hello, Hardhat!"
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy(greetingText);

  await greeter.deployed();

  console.log("Greeter deployed to :", greeter.address);
  console.log("Network deployed to :", deployNetwork);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });