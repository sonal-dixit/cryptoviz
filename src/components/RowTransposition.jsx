import React, { useState } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";

const RowTranspositionCipher = () => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [keyword, setKeyword] = useState("4231"); // User input keyword for row transposition cipher

  // Function to pad the text to make a perfect matrix
  const padText = (text, keyword) => {
    const keywordLength = keyword.length;
    const textLength = text.length;
    const fillersNeeded =
      textLength % keywordLength === 0
        ? 0
        : keywordLength - (textLength % keywordLength);
    return text + "x".repeat(fillersNeeded);
  };

  // Function to generate the matrix
  const generateMatrix = (text, keyword) => {
    if (keyword.length <= 0) return;
    const matrix = [];
    const keywordLength = keyword.length;
    const paddedText = padText(text, keyword);
    for (let i = 0; i < paddedText.length; i += keywordLength) {
      matrix.push(paddedText.slice(i, i + keywordLength));
    }
    return matrix;
  };

  const handleEncrypt = () => {
    if (!keyword || !plainText) return;
    const matrix = generateMatrix(plainText, keyword);
    const keywordLength = keyword.length;
    let encryptedText = "";

    // Iterate through columns based on the key order
    for (let i = 0; i < keywordLength; i++) {
      const index = parseInt(keyword[i]) - 1; // Convert from 1-based to 0-based index
      for (let j = 0; j < matrix.length; j++) {
        encryptedText += matrix[j][index];
      }
    }
    setEncryptedText(encryptedText);
  };

  // Handle decryption
  const handleDecrypt = () => {
    if (!keyword || !cipherText) return;
    const keywordLength = keyword.length;
    const matrix = [];
    let decryptedText = "";

    // Calculate the number of rows in the matrix
    const numRows = Math.ceil(cipherText.length / keywordLength);

    // Initialize the matrix with empty strings
    for (let i = 0; i < numRows; i++) {
      matrix.push([]);
    }

    // Populate the matrix with encrypted text characters
    let index = 0;
    for (let i = 0; i < keywordLength; i++) {
      const colIndex = parseInt(keyword[i]) - 1; // Convert from 1-based to 0-based index
      for (let j = 0; j < numRows; j++) {
        matrix[j][colIndex] = cipherText[index++];
      }
    }

    // Concatenate the characters in each row to form the decrypted text
    for (let i = 0; i < numRows; i++) {
      decryptedText += matrix[i].join("");
    }

    // Remove any padding 'x' characters
    // decryptedText = decryptedText.replace(/x+$/, "");

    setDecryptedText(decryptedText);
  };

  // console.log(generateMatrix(plainText, keyword));
  return (
    <div className="w-full flex gap-2 px-20">
      <div className="w-1/2 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Procedure
        </h1>
        <div className="flex gap-4 flex-col">
          <h1>Row Transposition Cipher</h1>
          <Input
            label="Enter keyword:"
            value={keyword}
            type="number"
            onChange={(e) => setKeyword(e.target.value.toLowerCase())}
            variant="bordered"
            color="success"
            className="w-1/2"
            size="sm"
          />
          <Textarea
            variant="bordered"
            label="Enter text to encrypt"
            onChange={(e) => setPlainText(e.target.value)}
          />
          <Button onClick={handleEncrypt} className="max-w-xs">
            Encrypt
          </Button>
          <Card>
            <CardBody>
              <p>Encrypted text:</p>
              <pre>{encryptedText}</pre>
            </CardBody>
          </Card>
          <Textarea
            variant="bordered"
            label="Enter text to decrypt"
            onChange={(e) => setCipherText(e.target.value)}
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
          <h2 className="font-semibold text-xl">Encryption</h2>
          <p>Plain text: {plainText}</p>
          <p>Keyword: {keyword}</p>
          <h2>Plaintext Matrix:</h2>
          <pre>
            {generateMatrix(plainText, keyword)?.map((row, index) => (
              <div key={index}>{row.split("").join(" ")}</div>
            ))}
          </pre>
          <p>Encrypted text: {encryptedText}</p>
          <br />
          <h2 className="font-semibold text-xl">Decryption</h2>
          <p>Plain text: {cipherText}</p>
          <p>Keyword: {keyword}</p>
          <h2>Ciphertext Matrix:</h2>
          <pre>
            {generateMatrix(cipherText, keyword)?.map((row, index) => (
              <div key={index}>{row.split("").join(" ")}</div>
            ))}
          </pre>
          <p>Decrypted text: {decryptedText}</p>
        </div>
      </div>
    </div>
  );
};

export default RowTranspositionCipher;
