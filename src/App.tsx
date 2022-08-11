import { db } from "./db";
import { useState } from "react";
import { Buffer } from "buffer";
const encoder = new TextEncoder();
const iv = crypto.getRandomValues(new Uint8Array(16));

function App() {
  const [text, setText] = useState("");
  const [cryptogram, setCryptogram] = useState("");
  async function generateAESKey() {
    const key = await crypto.subtle.generateKey(
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    await db.key.clear();
    await db.key.add({ key });
  }

  async function encryptWithAESKey() {
    const key = (await db.key.limit(1).toArray())[0].key as CryptoKey;
    const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv,
      },
      key,
      encoder.encode(text)
    );
    setCryptogram(Buffer.from(new Uint8Array(encrypted)).toString("base64"));
  }
  return (
      <div>
        <input
          type="button"
          value="Generate AES Key"
          onClick={() => {
            generateAESKey();
          }}
        />
      </div>
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
