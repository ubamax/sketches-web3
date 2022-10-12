import "./App.css";
import { Navbar } from "./components";
import { Profile, Item, Mint } from "./pages";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app__app">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="nft/:tokenId" element={<Item />} />
          <Route path="/mint" element={<Mint />} />
        </Routes>        
      </Router>
    </div>
  );
}

export default App;
