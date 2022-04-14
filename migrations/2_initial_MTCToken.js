const MTCToken = artifacts.require("MTCToken");
const Ethmtc = artifacts.require("Ethmtc");

module.exports = async function (deployer) {
  await deployer.deploy(MTCToken);
  const token = await MTCToken.deployed();

  await deployer.deploy(Ethmtc, token.address);
  const ico = await Ethmtc.deployed();
  await token.updateAdmin(ico.address);

};

