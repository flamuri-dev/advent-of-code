import { ethers } from "ethers";
import { DayOne, DayOne__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

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

  let contract: DayOne;
  const factory = new DayOne__factory(signer);
  const contractAddress = params[0];
  contract = factory.attach(contractAddress);

  const caloriesLength = await contract.caloriesLength();
  let sum = 0;
  for (let j = 0; j < caloriesLength.toNumber(); j++) {
    const temp = (await contract.calories(j)).toNumber();
    if (temp > sum) {
      sum = temp;
    }
  }
  console.log("Winner: ", sum);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
