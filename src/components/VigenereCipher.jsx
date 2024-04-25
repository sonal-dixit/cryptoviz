import React, { useState } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";

const VigenereCipher = () => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [keyword, setKeyword] = useState("");
  const ascii = "abcdefghijklmnopqrstuvwxyz";

  const handleEncrypt = () => {
    if (!keyword || plainText === "") return;

    let result = "";
    for (let i = 0; i < plainText.length; i++) {
      let char = plainText[i];
      let keywordChar = keyword[i % keyword.length].toLowerCase();
      let keywordIndex = ascii.indexOf(keywordChar);
      let code = ascii.indexOf(char.toLowerCase());
      if (code === -1) {
        result += char;
      } else {
        let encryptedCode = (code + keywordIndex) % 26;
        result += ascii[encryptedCode];
      }
    }
    setEncryptedText(result);
  };

  const handleDecrypt = () => {
    if (!keyword || cipherText === "") return;

    let result = "";
    for (let i = 0; i < cipherText.length; i++) {
      let char = cipherText[i];
      let keywordChar = keyword[i % keyword.length].toLowerCase();
      let keywordIndex = ascii.indexOf(keywordChar);
      let code = ascii.indexOf(char.toLowerCase());
      if (code === -1) {
        result += char;
      } else {
        let decryptedCode = (code - keywordIndex + 26) % 26;
        result += ascii[decryptedCode];
      }
    }
    setDecryptedText(result);
  };

  const generateAsciiTable = () => {
    return (
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {ascii.split("").map((char, index) => (
              <th
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {char}
              </th>
            ))}
          </tr>
          <tr>
            {ascii.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.charCodeAt(index) - 97}
              </td>
            ))}
          </tr>
        </thead>
      </table>
    );
  };

  const generateInputAndKeywordTable = () => {
    if(keyword.length<=0) return;
    let repeatedKeyword = keyword
      ? keyword
          .repeat(Math.ceil(plainText.length / keyword.length))
          .slice(0, plainText.length)
      : "";
    return (
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
          <td>Plaintext (P)</td>
            {plainText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {char}
              </td>
            ))}
          </tr>
          <tr>
          <td>P[i]</td>
            {plainText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.indexOf(char.toLowerCase())}
              </td>
            ))}
          </tr>
          <tr>
          <td>Keyword (K)</td>
            {plainText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {repeatedKeyword[index]}
              </td>
            ))}
          </tr>
          <tr>
          <td>K[i]</td>
            {plainText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.indexOf(repeatedKeyword[index].toLowerCase())}
              </td>
            ))}
          </tr>
          <tr>
          <td>P[i]+K[i]</td>
            {plainText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.indexOf(repeatedKeyword[index].toLowerCase())+ascii.indexOf(char.toLowerCase())}
              </td>
            ))}
          </tr>
          <tr>
            <td>C[i] = (P[i]+K[i]) % 26</td>
            {plainText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {(ascii.indexOf(repeatedKeyword[index].toLowerCase())+ascii.indexOf(char.toLowerCase())) % 26}
              </td>
            ))}
          </tr>
          <tr>
            <td>Ciphertext (C)</td>
            {plainText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii[(ascii.indexOf(repeatedKeyword[index].toLowerCase())+ascii.indexOf(char.toLowerCase()))%26]}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };
  const generateInputAndKeywordTableD = () => {
    if (keyword.length <= 0 || cipherText === "") return null;
    let repeatedKeyword = keyword
      ? keyword
          .repeat(Math.ceil(cipherText.length / keyword.length))
          .slice(0, cipherText.length)
      : "";
    return (
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td>Ciphertext (C)</td>
            {cipherText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {char}
              </td>
            ))}
          </tr>
          <tr>
            <td>C[i]</td>
            {cipherText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.indexOf(char.toLowerCase())}
              </td>
            ))}
          </tr>
          <tr>
            <td>Keyword (K)</td>
            {cipherText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {repeatedKeyword[index]}
              </td>
            ))}
          </tr>
          <tr>
            <td>K[i]</td>
            {cipherText.split("").map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.indexOf(repeatedKeyword[index].toLowerCase())}
              </td>
            ))}
          </tr>
          <tr>
            <td>C[i]-K[i]</td>
            {cipherText.split("").map((char, index) => {
              let decryptedCode =
                (ascii.indexOf(char.toLowerCase()) -
                  ascii.indexOf(repeatedKeyword[index].toLowerCase()) +
                  26) %
                26;
              return (
                <td
                  key={index}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {decryptedCode}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>P[i] = (C[i]-K[i]) % 26</td>
            {cipherText.split("").map((char, index) => {
              let decryptedCode =
                (ascii.indexOf(char.toLowerCase()) -
                  ascii.indexOf(repeatedKeyword[index].toLowerCase()) +
                  26) %
                26;
              return (
                <td
                  key={index}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {decryptedCode}
                </td>
              );
            })}
          </tr>
          <tr>
            <td>Plaintext (P)</td>
            {cipherText.split("").map((char, index) => {
              let decryptedCode =
                (ascii.indexOf(char.toLowerCase()) -
                  ascii.indexOf(repeatedKeyword[index].toLowerCase()) +
                  26) %
                26;
              return (
                <td
                  key={index}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {ascii[decryptedCode]}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    );
  };
  

  const generateEncryptionTable = () => {
    if (keyword.length <= 0) return;
    let repeatedKeyword = keyword
      ? keyword
          .repeat(Math.ceil(plainText.length / keyword.length))
          .slice(0, plainText.length)
      : "";
    let encryptionTable = [];
    for (let i = 0; i < plainText.length; i++) {
      let plainCharCode = ascii.indexOf(plainText[i].toLowerCase());
      let keywordCharCode = ascii.indexOf(repeatedKeyword[i].toLowerCase());
      let encryptedCharCode = (plainCharCode + keywordCharCode) % 26;
      encryptionTable.push(ascii[encryptedCharCode]);
    }
    return (
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {encryptionTable.map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {char}
              </td>
            ))}
          </tr>
          <tr>
            {encryptionTable.map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.indexOf(char.toLowerCase())}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  const generateDecryptionTable = () => {
    if (keyword.length <= 0) return;
    let repeatedKeyword = keyword
      ? keyword
          .repeat(Math.ceil(cipherText.length / keyword.length))
          .slice(0, cipherText.length)
      : "";
    let decryptionTable = [];
    for (let i = 0; i < cipherText.length; i++) {
      let cipherCharCode = ascii.indexOf(cipherText[i].toLowerCase());
      let keywordCharCode = ascii.indexOf(repeatedKeyword[i].toLowerCase());
      let decryptedCharCode = (cipherCharCode - keywordCharCode + 26) % 26;
      decryptionTable.push(ascii[decryptedCharCode]);
    }
    return (
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {decryptionTable.map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {char}
              </td>
            ))}
          </tr>
          <tr>
            {decryptionTable.map((char, index) => (
              <td
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {ascii.indexOf(char.toLowerCase())}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="w-full flex gap-2 px-20">
      <div className="w-1/2 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Procedure
        </h1>
        <div className="flex gap-4 flex-col">
          <h1>Vigenère Cipher</h1>
          <Input
            label="Enter keyword:"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.toLowerCase())}
            variant="bordered"
            color="success"
            className="w-1/2"
            size="sm"
          />
          <Textarea
            variant="bordered"
            label="Enter text to encrypt"
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
          />
          <Button onClick={handleEncrypt} className="max-w-xs">
            Encrypt
          </Button>
          <Card>
            <CardBody>
              <p>Encrypted text: {encryptedText}</p>
            </CardBody>
          </Card>
          <Textarea
            variant="bordered"
            label="Enter text to decrypt"
            value={cipherText}
            onChange={(e) => setCipherText(e.target.value)}
          />
          <Input
            label="Enter keyword:"
            value={keyword}
            readOnly
            variant="bordered"
            color="success"
            className="w-1/2"
            size="sm"
          />
          <Button onClick={handleDecrypt} className="max-w-xs">
            Decrypt
          </Button>
          <Card>
            <CardBody>
              <p>Decrypted text: {decryptedText}</p>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="w-2/3 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Explanation
        </h1>
        <div className="overflow-scroll max-h-[750px] min-h-[750px] p-4">
          <h2 className="font-semibold text-xl">ASCII Table</h2>
          {generateAsciiTable()}
          <br />
          <h2 className="font-semibold text-xl">Input and Keyword Table</h2>
          {generateInputAndKeywordTable()}
          <br />
          <h2 className="font-semibold text-xl">Encryption Table</h2>
          {generateEncryptionTable()}
          <br />
          <h2 className="font-semibold text-xl">
            Input and Keyword Table for Decryption
          </h2>
          {generateInputAndKeywordTableD()}
          <br />
          <h2 className="font-semibold text-xl">Decryption Table</h2>
          {generateDecryptionTable()}
        </div>
      </div>
    </div>
  );
};

export default VigenereCipher;
