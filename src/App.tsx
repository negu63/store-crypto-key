import { db } from "./db";
import { useRef, useState } from "react";
import { Buffer } from "buffer";

function App() {
  const [text, setText] = useState("");
  const [cryptogram, setCryptogram] = useState("");
  const [plainText, setPlainText] = useState("");
  const iv = useRef(crypto.getRandomValues(new Uint8Array(16)));

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
    iv.current = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const key = (await db.key.limit(1).toArray())[0].key as CryptoKey;
    const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: iv.current,
      },
      key,
      encoder.encode(text)
    );
    setCryptogram(Buffer.from(new Uint8Array(encrypted)).toString("base64"));
  }

  async function decryptWithAESKey(cryptogram: string) {
    const decoder = new TextDecoder();
    const key = (await db.key.limit(1).toArray())[0].key as CryptoKey;
    const encrypted = Buffer.from(cryptogram, "base64");
    const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv.current },
      key,
      encrypted
    );
    setPlainText(decoder.decode(decrypted));
  }

  return (
    <>
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
      <label htmlFor="encrypted">
        <div>Encrypted</div>
        <input
          type="text"
          name="encrypted"
          id="encrypted"
          readOnly
          value={cryptogram}
        />
      </label>
      <label htmlFor="decrypted">
        <div>Decrypted</div>
        <input
          type="text"
          name="decrypted"
          id="decrypted"
          readOnly
          value={plainText}
        />
      </label>
      <div>
        <input
          type="button"
          value="Encrypt"
          onClick={() => {
            encryptWithAESKey();
          }}
        />
        <input
          type="button"
          value="Decrypt"
          onClick={() => {
            decryptWithAESKey(cryptogram);
          }}
        />
      </div>
    </>
  );
}

export default App;
