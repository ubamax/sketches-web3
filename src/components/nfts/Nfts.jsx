import React from "react";
import "./nfts.css";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const Nfts = ({ title, nfts, loading }) => {
  const { kit } = useContractKit();
  const { defaultAccount } = kit;
  return (
    <div className="nfts">
      <div className="nfts-container">
        <div className="nfts-container_text">
          {!loading && (
            <h1>{nfts.length < 1 ? "You don't have any NFT yet" : title}</h1>
          )}
        </div>
        <div className="nfts-container_cards">
          {!loading ? (
            nfts
              .filter((nft) => nft.owner == defaultAccount)
              .map((nft) => (
                <div className="nft-card">
                  <Link to={`/nft/${nft.index}`}>Expand</Link>
                  <img src={nft.image} alt="" />
                </div>
              ))
          ) : (
            <ClipLoader size={50} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Nfts;
