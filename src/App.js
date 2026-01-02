import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 CrowdFund3.0</h1>
        <p>我的第一个React应用！</p>
        <p>当前状态: 开发中...</p>

        {/* 新增按钮 */}
        <button onClick={() => alert('Hello Web3! 🚀')}>
          点击体验
        </button>
      </header>
    </div>
  );
}

export default App;
