import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { HttpAgent } from "@dfinity/agent";

async function init() {
  const agent = new HttpAgent();
  if (process.env.DFX_NETWORK !== "ic") {
    try {
      await agent.fetchRootKey();
      console.log("✅ Root key fetched successfully!");
    } catch (err) {
      console.error("❌ Error fetching root key:", err);
      return;
    }
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App agent={agent} />
    </React.StrictMode>
  );
}

init();