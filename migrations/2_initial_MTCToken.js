const MTCToken = artifacts.require("MTCToken");

module.exports = function (deployer) {
  deployer.deploy(MTCToken);
};
