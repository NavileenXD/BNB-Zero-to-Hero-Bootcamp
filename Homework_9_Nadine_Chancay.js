import { useState } from "react";
import { ethers } from "ethers";
 
function App() {
  let [owner, setOwner] = useState("");
  let [connected, setConnected] = useState(false);

  let { ethereum } = window;
  let contract = null;
 
  if (ethereum) {
 
    let abi = [
      "function getOwner() external view returns (address)"
    ]
    let address = "0xd07a57C5fD3E8286B13960eAc2514bE8c44230bA";
    let provider = new ethers.providers.Web3Provider(ethereum);
    let signer = provider.getSigner();
    contract = new ethers.Contract(address, abi, signer);
  }
 
  return (
    <div className="App">
      <h1>BadgerCoin Contract</h1>
 
      <button onClick={() => {
          if (contract && !connected) {
              ethereum.request({ method: 'eth_requestAccounts'})
                  .then(accounts => {
                      setConnected(true);
                  })
          }
      }}>{!connected ? 'Connect wallet' : 'Connected' }</button>

      <h2>BadgerCoin getOwner() function interaction</h2>
      <button onClick={() => {
        if (contract && connected) {
          contract.getOwner()
            .then(owner => {
              setOwner(owner);
            })
        }
      }}>Get owner</button>
 
      <h3>{owner}</h3>
    </div>
  );
}
 
export default App;