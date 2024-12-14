# Backend Project

This project demonstrates a basic use case of eventfunding. It comes with a sample contract, a test for that contract, and a Hardhat deploy module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

For deployment cleanup, after that you can compose with docker:

```shell
npm run clean
npm run simulator
npm run deploy:dev
```
