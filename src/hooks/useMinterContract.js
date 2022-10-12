import { useContract } from "./useContract";
import MinterABI from "../contracts/Minter.json";
import MinterAddress from "../contracts/Minter-address.json";

export const useMinterContract = () => {
  return useContract(MinterABI.abi, MinterAddress.Minter);
};
