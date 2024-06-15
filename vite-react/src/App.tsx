import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div>
        <h1>测试插件</h1>
        <button
          onClick={async () => {
            console.log("Running in Electron?", window?.electron);
            window.electron.loadExtension();
          }}
        >
          加载插件
        </button>
      </div>
    </>
  );
}

export default App;
