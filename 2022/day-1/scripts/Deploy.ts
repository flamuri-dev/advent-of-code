import { ethers } from "ethers";
// import { ethers } from "hardhat";
import { DayOne, DayOne__factory } from "../typechain-types";
import { readFileSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";
dotenv.config();

function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

async function main() {
  const provider = ethers.getDefaultProvider("goerli", {
    infura: process.env.INFURA_API_KEY,
    alchemy: process.env.ALCHEMY_API_KEY,
  });
  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? "",
    "m/44'/60'/0'/0/0"
  );
  const signer = wallet.connect(provider);

  let fileContent = syncReadFile("../contracts/assets/calories.txt");
  let fileContentFormatted = fileContent.split(/\r?\n/);
  let caloriesArray: number[] = [];
  let tempArray: number[] = [];
  let i: number = 0;

  while (i <= fileContentFormatted.length) {
    if (fileContentFormatted[i]) {
      tempArray.push(parseInt(fileContentFormatted[i]));
    } else {
      let sum = 0;
      for (let j = 0; j < tempArray.length; j++) {
        sum += tempArray[j];
      }
      tempArray = [];
      caloriesArray.push(sum);
    }
    i++;
  }

  // Hardhat
  // let contract;
  // const factory = await ethers.getContractFactory("DayOne");

  // Goerli
  let contract: DayOne;
  const factory = new DayOne__factory(signer);

  contract = await factory.deploy(caloriesArray);
  await contract.deployed();
  console.log(`Contract deployed at address: ${contract.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
