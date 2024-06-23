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
        <div>
          <div>
            <button
              onClick={() => {
                console.log("[获取rootPath]", window?.electron?.rootPath());
              }}
            >
              获取rootPath
            </button>
          </div>
          <div>
            <button
              onClick={async () => {
                const extension = await window?.electron.loadExtension();
                console.log("[加载插件]", extension);
              }}
            >
              加载插件
            </button>
          </div>
          <div>
            <button
              onClick={async () => {
                setTimeout(() => {
                  window?.electron.newWindow();
                }, 5000);
              }}
            >
              新窗口
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
