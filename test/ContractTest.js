const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Minter", function () {
  this.timeout(50000);

  let contract;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const Minter = await ethers.getContractFactory("Minter");
    [owner, acc1, acc2] = await ethers.getSigners();    
    contract = await Minter.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    expect(await contract.balanceOf(acc1.address)).to.equal(0);

    const tokenURI = "https://example.com/1";
    const tokenId = 0
    const tx = await contract.connect(owner).mint(tokenURI);
    await tx.wait();

    expect(await contract.balanceOf(acc1.address)).to.equal(0);
  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    const tx1 = await contract.connect(owner).mint(tokenURI_1);
    await tx1.wait();
    const tx2 = await contract.connect(owner).mint(tokenURI_2);
    await tx2.wait();

    expect(await contract.tokenURI(0)).to.equal(tokenURI_1);
    expect(await contract.tokenURI(1)).to.equal(tokenURI_2);
  });
});