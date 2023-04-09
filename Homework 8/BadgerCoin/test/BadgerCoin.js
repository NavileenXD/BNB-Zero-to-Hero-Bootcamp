const { expect } = require("chai");


const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


describe("BadgerCoin contract", function () {

  async function deployTokenFixture() {

    const Token = await ethers.getContractFactory("BadgerCoin");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const initialTotalSupply = '1000000000000000000000000'; // 1000000 * 10 ** 18
    const decimals = 18;

    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();


    return { Token, hardhatToken, initialTotalSupply, decimals, owner, addr1, addr2 };
  }


  describe("Deployment", function () {

    it("The total supply should be 1000000", async function () {
      const { hardhatToken, initialTotalSupply } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.totalSupply()).to.equal(initialTotalSupply);
    });

    it("The number of decimals should be 18", async function () {
      const { hardhatToken, decimals } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.decimals()).to.equal(decimals);
    });

    it("The balance of owner should be equal to the total supply of tokens", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);


      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
