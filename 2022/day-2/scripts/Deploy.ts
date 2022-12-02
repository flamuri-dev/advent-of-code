import { ethers } from "ethers";
import { DayTwo, DayTwo__factory } from "../typechain-types";
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

  let contract: DayTwo;
  const factory = new DayTwo__factory(signer);
  contract = await factory.deploy();
  await contract.deployed();
  console.log(`Contract deployed at address: ${contract.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
