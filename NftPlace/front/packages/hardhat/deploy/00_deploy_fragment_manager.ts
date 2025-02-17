import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFragmentManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying FragmentManager...");

  const fragmentManager = await deploy("FragmentManager", {
    from: deployer,
    log: true,
  });

  console.log("FragmentManager deployed at:", fragmentManager.address);
};

export default deployFragmentManager;
deployFragmentManager.tags = ["FragmentManager"];
