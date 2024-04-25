import React, { useState } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";

const RailFenceCipher = () => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [rails, setRails] = useState(2); // Number of rails for Rail Fence Cipher
  const [railPattern, setRailPattern] = useState(""); // Rail pattern for visualization

  // Function to generate the Rail Fence cipher matrix
  const generateMatrix = (text, numRails) => {
    let matrix = [];
    for (let i = 0; i < numRails; i++) {
      matrix.push([]);
    }
    let row = 0;
    let down = true;
    for (let i = 0; i < text.length; i++) {
      matrix[row].push(text[i]);
      if (row === 0) {
        down = true;
      } else if (row === numRails - 1) {
        down = false;
      }
      down ? row++ : row--;
    }
    return matrix;
  };

  // Function to generate the rail pattern for visualization
  const generateRailPattern = (text, numRails) => {
    let pattern = "";
    let matrix = generateMatrix(text, numRails);
    for (let i = 0; i < numRails; i++) {
      for (let j = 0; j < text.length; j++) {
        if (matrix[i][j] !== undefined) {
          pattern += matrix[i][j] || " "; // Add empty space for missing characters
        }
      }
      pattern += "\n"; // Add a newline after each row
    }
    return pattern;
  };

  // Function to encrypt using the Rail Fence cipher
  const encrypt = (text, numRails) => {
    let matrix = generateMatrix(text, numRails);
    let result = "";
    for (let i = 0; i < numRails; i++) {
      result += matrix[i].join("");
    }
    return result.toUpperCase();
  };

  // Function to decrypt using the Rail Fence cipher
  const decrypt = (text, numRails) => {
    let matrix = generateMatrix(text, numRails);
    let result = "";
    let strIdx = 0;
    for (let i = 0; i < numRails; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = text[strIdx++];
      }
    }
    let row = 0;
    let down = true;
    for (let i = 0; i < text.length; i++) {
      result += matrix[row].shift();
      if (row === 0) {
        down = true;
      } else if (row === numRails - 1) {
        down = false;
      }
      down ? row++ : row--;
    }
    return result.toLowerCase();
  };

  // Handle encryption
  const handleEncrypt = () => {
    setEncryptedText(encrypt(plainText.replace(" ", ""), rails));
    setRailPattern(generateRailPattern(plainText, rails));
  };

  // Handle decryption
  const handleDecrypt = () => {
    setDecryptedText(decrypt(cipherText, rails));
    setRailPattern(generateRailPattern(cipherText, rails));
  };

  return (
    <div className="w-full flex gap-2 px-20">
      <div className="w-1/2 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Procedure
        </h1>
        <div className="flex gap-4 flex-col">
          <h1>Rail Fence Cipher</h1>
          <Textarea
            variant="bordered"
            label="Enter text to encrypt"
            onChange={(e) => setPlainText(e.target.value)}
          />
          <Input
            label="Number of Rails:"
            type="number"
            value={rails}
            min={2}
            onChange={(e) => setRails(parseInt(e.target.value))}
            variant="bordered"
            color="success"
            className="w-1/4"
            size="sm"
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
          {/* <Input
            label="Rail Pattern:"
            value={railPattern}
            readOnly
            variant="bordered"
            color="success"
            className="w-1/2"
            size="sm"
          /> */}
        </div>
      </div>
      <div className="w-2/3 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Explanation
        </h1>
        <div className="overflow-scroll max-h-[750px] min-h-[750px] p-4">
          <h2 className="font-semibold text-xl">Encryption</h2>
          <p>Plain text: {plainText}</p>
          <p>Number of Rails: {rails}</p>
          <div>Rail Fence Cipher Matrix:</div>
          <Card className="w-fit min-w-36 min-h-10">
            <CardBody>
              {generateMatrix(plainText, rails).map((row, index) => (
                <p key={index}>{row.join(" ")}</p>
              ))}
            </CardBody>
          </Card>
          <p>Encrypted text: {encryptedText}</p>
          <br/>
          <h2 className="font-semibold text-xl">Decryption</h2>
          <p>Plain text: {cipherText}</p>
          <p>Number of Rails: {rails}</p>
          <div>Rail Fence Cipher Matrix:</div>
          <Card className="w-fit min-w-36 min-h-10">
            <CardBody>
              {generateMatrix(plainText, rails).map((row, index) => (
                <p key={index}>{row.join(" ")}</p>
              ))}
            </CardBody>
          </Card>
          <p>Decrypted text: {decryptedText}</p>
        </div>
      </div>
    </div>
  );
};

export default RailFenceCipher;
