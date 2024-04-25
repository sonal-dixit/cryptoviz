import React, { useState } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";

const CaesarCipher = () => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [key, setKey] = useState(3);
  const [encryptionSteps, setEncryptionSteps] = useState([]);
  const [decryptionSteps, setDecryptionSteps] = useState([]);
  const [stepcountEn, setStepcountEn] = useState(0);
  const [stepcountDe, setStepcountDe] = useState(0);
  const ascii = "abcdefghijklmnopqrstuvwxyz";
  const encrypt = (text, shift) => {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      // Check if the character is a letter
      if (/[a-zA-Z]/.test(char)) {
        let code = char.charCodeAt(0);
        let shiftAmount = shift % 26; // Ensure shift is within the range [0, 25]
        let shiftedCode = code + shiftAmount;
        // Handle uppercase letters
        if (char.match(/[A-Z]/)) {
          if (shiftedCode > 90) shiftedCode -= 26; // Wrap around if needed
        }
        // Handle lowercase letters
        else if (char.match(/[a-z]/)) {
          if (shiftedCode > 122) shiftedCode -= 26; // Wrap around if needed
        }
        result += String.fromCharCode(shiftedCode);
      } else {
        // If the character is not a letter, keep it unchanged
        result += char;
      }
    }
    return result;
  };

  const handleEncrypt = () => {
    if (encryptedText.length > 0) setEncryptedText("");
    if (stepcountEn === plainText.length - 1 || stepcountEn === 0) {
      const normalizedKey = ((key % 26) + 26) % 26;
      const steps = [];
      for (let i = 0; i < plainText.length; i++) {
        const encryptedChar = encrypt(plainText[i], normalizedKey);
        setEncryptedText((prevText) => prevText + encryptedChar);
        steps.push({ step: i + 1, char: encryptedChar });
      }
      setEncryptionSteps([]);
      steps.forEach((step, index) => {
        setTimeout(() => {
          setStepcountEn(index);
          setEncryptionSteps((prevSteps) => [...prevSteps, step]);
        }, (index + 1) * 100); 
      });
    }
  };

  const handleDecrypt = () => {
    if (decryptedText.length > 0) setDecryptedText("");
    const normalizedKey = ((key % 26) + 26) % 26;
    const steps = [];
    for (let i = 0; i < cipherText.length; i++) {
      let decryptedChar = decrypt(cipherText[i], normalizedKey);
      if (decryptedChar === null) {
        decryptedChar = cipherText[i];
      }
      setDecryptedText((prevText) => prevText + decryptedChar);
      steps.push({ step: i + 1, char: decryptedChar });
    }
    setDecryptionSteps([]);
    steps.forEach((step, index) => {
      setTimeout(() => {
        setStepcountDe(index);
        setDecryptionSteps((prevSteps) => [...prevSteps, step]);
      }, (index + 1) * 100); 
    });
  };
  
  const decrypt = (char, key) => {
    if (!char.match(/[a-zA-Z]/)) {
      return null;
    }
    const code = char.charCodeAt(0);
    let decryptedCode;
    if (code >= 65 && code <= 90) {
      decryptedCode = ((code - 65 - key + 26) % 26) + 65;
    } else if (code >= 97 && code <= 122) {
      decryptedCode = ((code - 97 - key + 26) % 26) + 97;
    }
    return String.fromCharCode(decryptedCode);
  };
  

  const shiftCharacters = (text, key) => {
    return text
      .split("")
      .map((char) => {
        if (/[a-zA-Z]/.test(char)) {
          let code = char.charCodeAt(0);
          let shiftAmount = key % 26; // Ensure shift is within the range [0, 25]
          let shiftedCode = code + shiftAmount;
          // Handle uppercase letters
          if (char.match(/[A-Z]/)) {
            if (shiftedCode > 90) shiftedCode -= 26; // Wrap around if needed
          }
          // Handle lowercase letters
          else if (char.match(/[a-z]/)) {
            if (shiftedCode > 122) shiftedCode -= 26; // Wrap around if needed
          }
          return String.fromCharCode(shiftedCode);
        } else {
          // If the character is not a letter, keep it unchanged
          return char;
        }
      })
      .join("");
  };

  // Example usage of shiftCharacters function
  const shiftedText = shiftCharacters(ascii, key);

  return (
    <div className="w-full flex gap-2 px-20">
      <div className="w-1/2 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Procedure
        </h1>
        <div className="flex gap-4 flex-col">
          <h1>Caesar Cipher</h1>
          <Textarea
            variant="bordered"
            label="Enter text to encrypt"
            onChange={(e) => setPlainText(e.target.value)}
          />
          <Input
            label="Enter encryption key (an integer):"
            type="number"
            value={key}
            onChange={(e) => setKey(parseInt(e.target.value))}
            variant="bordered"
            color="success"
            className="w-1/2"
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
          <Input
            label="Enter decryption key (an integer):"
            type="number"
            value={key}
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
        <div className="overflow-scroll max-h-[750px] min-h-[750px] p-2">
          Before shifting:
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
            </thead>
            <tbody>
              <tr>
                {ascii.split("").map((char, index) => (
                  <td
                    key={index}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {char.charCodeAt(0) - 97}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <br />
          After shifting by {key}:
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
            </thead>
            <tbody>
              <tr>
                {shiftedText.split("").map((char, index) => (
                  <td
                    key={index}
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {char.charCodeAt(0) - 97}
                  </td>
                ))}
              </tr>
              <tr>
                {shiftedText.split("").map((char, index) => (
                  <td
                    key={index}
                    // className="font-bold"
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    {char}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <br />
          <h2 className="font-semibold text-xl">Encryption</h2>
          <p>Plain text: {plainText}</p>
          <p>Shift key: {key}</p>
          <div>Encryption steps:</div>
          <div>
            {encryptionSteps.map((step, index) => (
              <p key={index}>
                Step {step.step}: {plainText[index]} = (
                {plainText.charCodeAt(index) - 97} + {key}) % 26 ={" "}
                {(plainText.charCodeAt(index) - 97 + key) % 26} = {step.char}
              </p>
            ))}
          </div>
          <p>Cipher text: {encryptedText}</p>
          <br />
          <h2 className="font-semibold text-xl">Decryption</h2>
          <p>Cipher text: {cipherText}</p>
          <p>Shift key: {key}</p>
          <div>Decryption steps:</div>
          <div>
            {decryptionSteps.map((step, index) => (
              <p key={index}>
                Step {step.step}: {cipherText[index]} = (
                {cipherText.charCodeAt(index) - 97} - {key}) % 26 ={" "}
                {step.char.charCodeAt(0) - 97} = {step.char}
              </p>
            ))}
          </div>
          <p>Decrypted text: {decryptedText}</p>
        </div>
      </div>
    </div>
  );
};

export default CaesarCipher;
