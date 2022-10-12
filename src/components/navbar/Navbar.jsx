import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContractKit } from "@celo-tools/use-contractkit";
import { truncateAddress } from "../../utils/helperFunctions";
import "./Navbar.css";

const Navbar = () => {
  const { address, destroy, connect } = useContractKit();

  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <Link to="/">
            <h1>Sketches</h1>
          </Link>
        </div>
        <div className="navbar-links_container">
          <Link to="/">
            <p>Home</p>{" "}
          </Link>
          {address && (
            <Link to="/">
              <p onClick={destroy}>Exit</p>
            </Link>
          )}
        </div>
      </div>
      <div className="navbar-sign">
        {!address ? (
          <>
            <button type="button" className="secondary-btn" onClick={connect}>
              Connect
            </button>
          </>
        ) : (
          <>
            <a
              href={`https://alfajores-blockscout.celo-testnet.org/address/${address}/transactions`}
            >
              <button type="button" className="secondary-btn">
                {truncateAddress(address)}
              </button>
            </a>
            <Link to="/mint">
              <button type="button" className="primary-btn">
                Mint
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
