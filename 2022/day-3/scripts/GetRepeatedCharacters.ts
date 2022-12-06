import { ethers } from "ethers";
import { DayThree, DayThree__factory } from "../typechain-types";
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
  if (params.length != 1) throw new Error("1 argument needed");

  let contract: DayThree;
  const factory = new DayThree__factory(signer);
  const contractAddress = params[0];
  contract = factory.attach(contractAddress);

  let fileContentString = syncReadFile("../contracts/assets/input.txt");
  let fileContent = fileContentString.split(/\r?\n/);
  let sum = 0;

  for (let i = 0; i < fileContent.length; i++) {
    const stringBytes = await contract.getRepeatedCharacters(fileContent[i]);
    const repeatedCharacters = ethers.utils.toUtf8String(stringBytes);

    for (let i = 0; i < repeatedCharacters.length; i++) {
      if (
        repeatedCharacters.charAt(i) ==
        repeatedCharacters.charAt(i).toLowerCase()
      ) {
        sum += repeatedCharacters.charCodeAt(i) - 96;
      } else {
        sum += repeatedCharacters.charCodeAt(i) - 38;
      }
    }
  }

  console.log(sum);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
