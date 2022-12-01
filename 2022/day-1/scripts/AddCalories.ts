import { ethers } from "ethers";
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

  const args = process.argv;
  const params = args.slice(2);
  if (params.length != 2) throw new Error("2 arguments needed");

  let contract: DayOne;
  const factory = new DayOne__factory(signer);
  const contractAddress = params[0];
  contract = factory.attach(contractAddress);

  const fileName = params[1];
  let fileContent = syncReadFile(`../contracts/assets/${fileName}.txt`);
  let fileContentFormatted = fileContent.split(/\r?\n/);
  let tempArray: number[] = [];
  let i: number = 0;

  while (i <= fileContentFormatted.length) {
    if (fileContentFormatted[i]) {
      tempArray.push(parseInt(fileContentFormatted[i]));
    } else {
      const tx = await contract.addCalories(tempArray);
      await tx.wait();
      tempArray = [];
    }
    i++;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
