import { ethers } from "ethers";
import { DayTwo, DayTwo__factory } from "../typechain-types";
import { readFileSync } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";
dotenv.config();

function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

async function main() {
  let options = new Map<string, number>([
    ["A", 0],
    ["B", 1],
    ["C", 2],
    ["X", 0],
    ["Y", 1],
    ["Z", 2],
  ]);
  let fileContent = syncReadFile("../contracts/assets/input.txt");
  let fileContentFormatted = fileContent.split(/\r?\n/);

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
  if (params.length != 1) throw new Error("1 argument needed");

  let contract: DayTwo;
  const factory = new DayTwo__factory(signer);
  const contractAddress = params[0];
  contract = factory.attach(contractAddress);

  let sum = 0;
  for (let i = 0; i < fileContentFormatted.length; i++) {
    let opponent = options.get(fileContentFormatted[i][0])!;
    let me = options.get(fileContentFormatted[i][2])!;
    const points = await contract.play(opponent, me);
    sum += points;
  }

  console.log(`Total score: ${sum}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
