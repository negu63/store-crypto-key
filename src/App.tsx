import { db } from "./db";
import { useState } from "react";

function App() {
  const [text, setText] = useState("");
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
      <label htmlFor="plainText">
        <div>Plain Text</div>
        <input
          type="text"
          name="plainText"
          id="plainText"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
  );
}

export default App;
