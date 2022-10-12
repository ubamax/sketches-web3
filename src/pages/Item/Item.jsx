import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useMinterContract } from "../../hooks/useMinterContract";
import { useNavigate } from "react-router-dom";

import "./Item.css";

const Item = () => {
  const { tokenId } = useParams();
  const [tokenOwner, setTokenOwner] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [token, setToken] = useState({});

  const navigate = useNavigate();
  const nftContract = useMinterContract();
  const { performActions, kit } = useContractKit();
  const { defaultAccount } = kit;

  useEffect(() => {
    if (nftContract) fetchNftData();
  }, [nftContract]);

  const fetchNftData = async () => {
    const tokenUri = await nftContract.methods.tokenURI(tokenId).call();
    const _tokenOwner = await nftContract.methods.ownerOf(tokenId).call();
    const fetch_meta = await fetch(tokenUri);
    const meta = await fetch_meta.json();
    setToken(meta);
    setTokenOwner(_tokenOwner);
  };

  // gift and NFT to another user
  const giftNft = async () => {
    if (!receiver) {
      alert("Invalid receiver address entered");
      return;
    }
    try {
      await performActions(async (kit) => {
        await nftContract.methods
          .giftToken(tokenId, receiver)
          .send({ from: defaultAccount });
      });
      navigate("/");
    } catch (e) {
      console.log("Error trying to gift out token: " + e);
    }
  };

  return (
    <div className="nft_details">
      <div className="token-img">
        <img src={token.image} />
      </div>
      <div className="token-details">
        <div className="tkn-lbl">Sketch content</div>
        <div className="tkn-det">{token.name}</div>
        <div className="tkn-lbl">Sketch Meaning</div>
        <div className="tkn-det">{token.description}</div>
      </div>
      <div className="gft-sub">Gift token to loved one</div>
      <div className="gift-token">
        <input
          type="text"
          placeholder="receiver wallet address"
          onChange={(e) => setReceiver(e.target.value)}
        />{" "}
        <span onClick={() => giftNft()}>Send</span>
      </div>
    </div>
  );
};

export default Item;
