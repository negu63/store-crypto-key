import { db } from "./db";

function App() {
  async function generateAESKey() {
    const key = await crypto.subtle.generateKey(
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    await db.key.clear();
    await db.key.add({ key });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
