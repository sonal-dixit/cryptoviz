import React, { useRef, useState } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";

const PlayfairCipher = () => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [encryptionSteps, setEncryptionSteps] = useState([]);
  const [decryptionSteps, setDecryptionSteps] = useState([]);
  const [preparedText, setPreparedText] = useState("");
  const [stepcountEn, setStepcountEn] = useState(0);
  const [stepcountDe, setStepcountDe] = useState(0);
  const [keyword, setKeyword] = useState(""); // User input keyword for Playfair cipher
  const [matrix, setMatrix] = useState([]); // Playfair cipher matrix
  const alphabet = "abcdefghiklmnopqrstuvwxyz"; // Playfair alphabet without 'j'
  const canvasRef = useRef();
  const canvasRef1 = useRef();
  // Function to generate the Playfair cipher matrix
  const generateMatrix = () => {
    if (keyword.length <= 0) {
      toast.error("Enter key to generate the matrix");
      return;
    }
    let key = keyword.toLowerCase(); // Convert keyword to lowercase
    let matrix = [];
    let tempKeyword = key.replace(/j/g, "i"); // Replace 'j' with 'i' for simplicity
    // Remove duplicate letters from the keyword
    tempKeyword = tempKeyword
      .split("")
      .filter((char, index, self) => self.indexOf(char) === index)
      .join("");
    let tempAlphabet =
      tempKeyword + alphabet.replace(new RegExp(`[${tempKeyword}]`, "g"), "");

    for (let i = 0; i < 25; i += 5) {
      matrix.push(tempAlphabet.slice(i, i + 5).split(""));
    }
    drawMatrix(5, 5, matrix, canvasRef1);
    drawMatrix(5, 5, matrix, canvasRef);
    setMatrix(matrix);
  };

  // Function to prepare plaintext by grouping letters and adding padding if necessary
  const preparePlainText = (text) => {
    let preparedText = text.toLowerCase().replace(/j/g, "i"); // Replace 'j' with 'i' for simplicity
    preparedText = preparedText.replace(/[^a-z]/g, ""); // Remove non-alphabetic characters
    preparedText = preparedText.replace(/(.)(?=\1)/g, "$1x"); // Add 'x' between repeated characters
    if (preparedText.length % 2 !== 0) preparedText += "x"; // Add 'x' if the length is odd
    return preparedText;
  };

  // Function to encrypt using the Playfair cipher
  const encrypt = (text) => {
    let result = "";
    let steps = [];
    for (let i = 0; i < text.length; i += 2) {
      let pair = text.slice(i, i + 2);
      let row1, col1, row2, col2;
      for (let j = 0; j < 5; j++) {
        let idx1 = matrix[j].indexOf(pair[0]);
        let idx2 = matrix[j].indexOf(pair[1]);
        if (idx1 !== -1) {
          row1 = j;
          col1 = idx1;
        }
        if (idx2 !== -1) {
          row2 = j;
          col2 = idx2;
        }
      }
      if (row1 === row2) {
        // Same row
        result += matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5];
      } else if (col1 === col2) {
        // Same column
        result += matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2];
      } else {
        // Different row and column
        result += matrix[row1][col2] + matrix[row2][col1];
      }
      steps.push({ pair, encryptedPair: result.slice(-2) });
    }
    setEncryptionSteps([]);
    steps.forEach((step, index) => {
      setTimeout(() => {
        setEncryptionSteps((prevSteps) => [...prevSteps, step]);
      }, (index + 1) * 400); // Display each step after 1 second
    });
    return result.toLowerCase();
  };

  // Function to decrypt using the Playfair cipher
  // Function to decrypt using the Playfair cipher
  const decrypt = (text) => {
    let result = "";
    let steps = [];
    for (let i = 0; i < text.length; i += 2) {
      let pair = text.slice(i, i + 2);
      let row1, col1, row2, col2;
      for (let j = 0; j < 5; j++) {
        let idx1 = matrix[j].indexOf(pair[0]);
        let idx2 = matrix[j].indexOf(pair[1]);
        if (idx1 !== -1) {
          row1 = j;
          col1 = idx1;
        }
        if (idx2 !== -1) {
          row2 = j;
          col2 = idx2;
        }
      }
      if (row1 === row2) {
        // Same row
        result += matrix[row1][(col1 + 4) % 5] + matrix[row2][(col2 + 4) % 5];
      } else if (col1 === col2) {
        // Same column
        result += matrix[(row1 + 4) % 5][col1] + matrix[(row2 + 4) % 5][col2];
      } else {
        // Different row and column
        result += matrix[row1][col2] + matrix[row2][col1];
      }
      steps.push({ pair, decryptedPair: result.slice(-2) }); // Push the decrypted pair
    }
    setDecryptionSteps([]);
    steps.forEach((step, index) => {
      setTimeout(() => {
        setStepcountDe(index);
        setDecryptionSteps((prevSteps) => [...prevSteps, step]);
      }, (index + 1) * 400); // Display each step after 1 second
    });
    return result.toLowerCase(); // Remove 'x' padding
  };

  // Handle encryption
  const handleEncrypt = () => {
    if (!keyword) return;
    let preparedText1 = preparePlainText(plainText);
    setPreparedText(preparedText1);
    if (encryptedText.length > 0) setEncryptedText("");
    setEncryptedText(encrypt(preparedText1).toLowerCase());
  };

  // Handle decryption
  const handleDecrypt = () => {
    if (!keyword) return;
    if (decryptedText.length > 0) setDecryptedText("");
    setDecryptedText(decrypt(cipherText));
  };

  // Function to render the matrix
  const renderMatrix = () => {
    return (
      <Card className="w-fit">
        <CardBody>
          <h2>Keyword Matrix</h2>
          {matrix.map((row, index) => (
            <div key={index}>{row.join(" ")}</div>
          ))}
        </CardBody>
      </Card>
    );
  };
  const drawMatrix = (numRows, numCols, matrix, canvasRef) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const cellWidth = 30;
    const cellHeight = 30;
    const padding = 10;
    const matrixWidth = numCols * cellWidth + 2 * padding;
    const matrixHeight = numRows * cellHeight + 2 * padding;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellWidth + padding;
        const y = rowIndex * cellHeight + padding;

        ctx.fillStyle = "lightgray";
        ctx.fillRect(x, y, cellWidth, cellHeight);

        ctx.font = "14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cell, x + cellWidth / 2, y + cellHeight / 2);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      });
    });
  };

  return (
    <div className="w-full flex gap-2 px-20">
      <div className="w-1/2 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Procedure
        </h1>
        <div className="flex gap-4 flex-col">
          <h1>Playfair Cipher</h1>
          <Textarea
            variant="bordered"
            label="Enter text to encrypt"
            onChange={(e) => setPlainText(e.target.value)}
          />
          <Input
            label="Enter keyword:"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.toLowerCase())}
            variant="bordered"
            color="success"
            className="w-1/2"
            size="sm"
          />
          <div className="flex gap-2 ">
            <Button onClick={generateMatrix} className="max-w-xs">
              Generate Matrix
            </Button>
            <Button onClick={handleEncrypt} className="max-w-xs">
              Encrypt
            </Button>
          </div>
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
          <>
            <h2 class="text-2xl font-semibold mb-4">
              Playfair Encryption Process
            </h2>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 1: Generate the Key Square
              </h3>
              <p>
                Choose a keyword and remove duplicate letters. Append the
                remaining unique letters of the alphabet to form a 5x5 matrix.
              </p>
              <p class="mt-2">
                Keyword:{" "}
                <span id="prepared-plaintext" class="font-medium"></span>
                {keyword.toUpperCase()}
              </p>
              <canvas ref={canvasRef} width={200} height={180} />
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 2: Prepare the Plaintext
              </h3>
              <p>
                Remove spaces and punctuation from the plaintext. Insert an
                extra letter ('X') between consecutive letters.
              </p>
              <p class="mt-2">
                Plaintext:{" "}
                <span id="plaintext" class="font-medium">
                  {plainText}
                </span>
              </p>
              <p>
                Prepared Plaintext:{" "}
                <span id="prepared-plaintext" class="font-medium">
                  {preparedText.toUpperCase()}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 3: Break Plaintext into Pairs
              </h3>
              <p>
                Break the prepared plaintext into pairs of two letters each.
              </p>
              <pre id="encrypted-pairs" class="bg-gray-200 p-2 rounded-md">
                Pairs:{" "}
                {encryptionSteps.map((step, index) => (
                  <span key={index}>{step.pair.toUpperCase()} </span>
                ))}
              </pre>
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">Step 4: Encrypt Pairs</h3>
              <p>For each pair of letters, apply the encryption rules.</p>
              <div>
                Encryption steps:
                <ul>
                  {encryptionSteps.map((step, index) => (
                    <li key={index}>
                      Step {index + 1}: Encrypt {step.pair} -&gt;{" "}
                      {step.encryptedPair}
                    </li>
                  ))}
                </ul>
              </div>
              <pre id="encrypted-pairs" class="bg-gray-200 p-2 rounded-md">
                Encrypted Pairs:{" "}
                {encryptionSteps.map((step, index) => (
                  <span key={index}>{step.encryptedPair.toUpperCase()} </span>
                ))}
              </pre>
            </div>
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 5: Concatenate Encrypted Pairs
              </h3>
              <p>Concatenate the encrypted pairs to form the ciphertext.</p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Ciphertext:{" "}
                <span id="ciphertext" class="font-medium">
                  {encryptedText.toUpperCase()}
                </span>
              </p>
            </div>
          </>

          <br />
          <>
            <h2 class="text-2xl font-semibold mb-4">
              Playfair Decryption Process
            </h2>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 1: Obtain the Key Square
              </h3>
              <p>Use the same keyword to generate the key square.</p>
              <p class="mt-2">
                Keyword:{" "}
                <span id="prepared-plaintext" class="font-medium">
                  {keyword.toUpperCase()}
                </span>
              </p>
              <canvas ref={canvasRef1} width={200} height={180} />
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 2: Split Ciphertext into Pairs
              </h3>
              <p>Split the ciphertext into pairs of two letters each.</p>
              <pre id="encrypted-pairs" class="bg-gray-200 p-2 rounded-md">
                Pairs:{" "}
                {decryptionSteps.map((step, index) => (
                  <span key={index}>{step.pair.toUpperCase()} </span>
                ))}
              </pre>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">Step 3: Decrypt Pairs</h3>
              <p>For each pair of letters, apply the decryption rules.</p>
              <div>
                Decryption steps:
                <ul>
                  {decryptionSteps.map((step, index) => (
                    <li key={index}>
                      Step {index + 1}: Decrypt {step.pair} -&gt;{" "}
                      {step.decryptedPair}
                    </li>
                  ))}
                </ul>
              </div>
              <pre id="decrypted-pairs" class="bg-gray-200 p-2 rounded-md">
                Decrypted Pairs:{" "}
                {decryptionSteps.map((step, index) => (
                  <span key={index}>{step.decryptedPair.toUpperCase()} </span>
                ))}
              </pre>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 4: Concatenate Decrypted Pairs
              </h3>
              <p>Concatenate the decrypted pairs to form the plaintext.</p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Plaintext:{" "}
                <span id="plaintext" class="font-medium">
                  {decryptedText.toUpperCase()}
                </span>
              </p>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default PlayfairCipher;
