import React, { useEffect, useState } from "react";
import Nfts from "../../components/nfts/Nfts";
import { useMinterContract } from "../../hooks/useMinterContract";

const Profile = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const contract = useMinterContract();
  useEffect(() => {
    if (contract) {
      getNfts();
    }
  }, [contract]);

  // get nft metadata from ipfs url
  const fetchNftMeta = async (ipfsUrl) => {
    try {
      if (!ipfsUrl) return null;
      const fetch_meta = await fetch(ipfsUrl);
      const meta = await fetch_meta.json();
      return meta;
    } catch (e) {
      console.log({ e });
    }
  };

  // get all my NFT
  const getNfts = async () => {
    setLoading(true);
    try {
      const _nfts = [];
      const nftsLength = await contract.methods.totalSupply().call();
      for (let i = 0; i < Number(nftsLength); i++) {
        const _nft = new Promise(async (resolve) => {
          const tokenURI = await contract.methods.tokenURI(i).call();
          const tokenOwner = await contract.methods.ownerOf(i).call();
          const tokenData = await fetchNftMeta(tokenURI);
          resolve({
            index: i,
            owner: tokenOwner,
            name: tokenData.name,
            image: tokenData.image,
            description: tokenData.description,
          });
        });
        _nfts.push(_nft);
      }
      const allNft = await Promise.all(_nfts);
      setNfts(allNft);
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <Nfts nfts={nfts} loading={loading} title="My Tokens" />
    </div>
  );
};

export default Profile;
