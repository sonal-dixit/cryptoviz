import React, { useState, useEffect, useRef } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";

const HillCipher = () => {
  const [error, setError] = useState(null);
  const [keyMatrix, setKeyMatrix] = useState([
    [17, 21, 2],
    [17, 18, 2],
    [5, 21, 19],
  ]);
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [inverseMatrix, setInverseMatrix] = useState([]);
  const [showInverse, setShowInverse] = useState(false);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const canvasRef3 = useRef(null);

  const ascii = "abcdefghijklmnopqrstuvwxyz";

  useEffect(() => {
    setInverseMatrix(calculateInverseMatrix(keyMatrix));
    drawMatrix(3, 3, keyMatrix, canvasRef1);
    drawMatrix(3, 3, keyMatrix, canvasRef2);
  }, [keyMatrix]);

  const handleKeyMatrixChange = (e, row, col) => {
    const newMatrix = keyMatrix.map((r, rowIndex) =>
      r.map((val, colIndex) =>
        rowIndex === row && colIndex === col ? parseInt(e.target.value) : val
      )
    );
    setKeyMatrix(newMatrix);
  };

  const encrypt = (text, keyMatrix) => {
    text = text.replace(/ /g, "").toLowerCase();
    let encrypted = "";
    for (let i = 0; i < text.length; i += 3) {
      const vector = [
        ascii.indexOf(text[i]),
        ascii.indexOf(text[i + 1]),
        ascii.indexOf(text[i + 2]),
      ];
      // console.log(vector);
      // drawMatrix(1, 3, vector, canvasRef3);
      const result = multiplyMatrix(vector, keyMatrix);
      encrypted += result.map((val) => ascii[(val + 26) % 26]).join("");
    }
    return encrypted;
  };

  const decrypt = (text, inverseMatrix) => {
    text = text.replace(/ /g, "").toLowerCase();
    let decrypted = "";
    for (let i = 0; i < text.length; i += 3) {
      const vector = [
        ascii.indexOf(text[i]),
        ascii.indexOf(text[i + 1]),
        ascii.indexOf(text[i + 2]),
      ];
      const result = multiplyMatrix(vector, inverseMatrix);
      for (let j = 0; j < result.length; j++) {
        let positiveVal = result[j] % 26; // Ensure positive value
        while (positiveVal < 0) positiveVal += 26; // Handle negative values properly
        decrypted += ascii[positiveVal];
      }
    }
    return decrypted;
  };

  const multiplyMatrix = (vector, matrix) => {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += vector[j] * matrix[i][j];
      }
      result.push(sum);
    }
    return result;
  };

  const calculateInverseMatrix = (matrix) => {
    const det = determinant(matrix);
    const invDet = modInverse(det, 26);
    const adjointMatrix = adjugate(matrix).map((row) =>
      row.map((val) => {
        let result = val % 26; // Apply modulo 26 to bring the value within the range of 0 to 25
        while (result < 0) {
          result += 26; // Add 26 repeatedly until the value becomes non-negative
        }
        return result;
      })
    );
    const inverseMatrix = adjointMatrix.map((row) =>
      row.map((val) => (val * invDet) % 26)
    );
    // Transpose the matrix by swapping rows with columns
    const transposedMatrix = inverseMatrix[0].map((col, i) =>
      inverseMatrix.map((row) => row[i])
    );
    drawMatrix(3, 3, transposedMatrix, canvasRef3);
    return transposedMatrix;
  };

  const determinant = (matrix) => {
    if (matrix.length === 2) {
      let det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      det = ((det % 26) + 26) % 26;
      return det;
    }
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
      const sign = i % 2 === 0 ? 1 : -1;
      det += sign * matrix[0][i] * determinant(minor(matrix, 0, i));
    }
    det = ((det % 26) + 26) % 26;
    return det;
  };

  const minor = (matrix, row, col) => {
    return matrix
      .filter((r, i) => i !== row)
      .map((r) => r.filter((_, j) => j !== col));
  };

  const adjugate = (matrix) => {
    return matrix.map((row, i) =>
      row.map((_, j) => {
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        return sign * determinant(minor(matrix, i, j));
      })
    );
  };

  const modInverse = (a, m) => {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return 1;
  };

  const handleEncrypt = () => {
    if (plainText === "") {
      setError("Please enter some text to encrypt.");
      return;
    }
    setError(null);
    const encrypted = encrypt(plainText, keyMatrix);
    setEncryptedText(encrypted);
  };

  const handleDecrypt = () => {
    if (cipherText === "") {
      setError("Please enter some text to decrypt.");
      return;
    }
    setError(null);
    const decrypted = decrypt(cipherText, inverseMatrix);
    setDecryptedText(decrypted);
  };

  // const handleGenerateInverse = () => {
  //   const newInverseMatrix = calculateInverseMatrix(keyMatrix);
  //   setInverseMatrix(newInverseMatrix);
  //   console.log(newInverseMatrix);
  //   setShowInverse(true);
  // };

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
          <h1>Hill Cipher</h1>
          <div className="flex gap-4 w-full">
            {keyMatrix[0].map((_, j) => (
              <div key={j} className="flex flex-col">
                {keyMatrix.map((row, i) => (
                  <Input
                    key={i}
                    type="number"
                    value={keyMatrix[i][j]}
                    onChange={(e) => handleKeyMatrixChange(e, i, j)}
                    variant="bordered"
                    color="success"
                    className="w-24"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex gap-4 w-full">
            <Textarea
              variant="bordered"
              label="Enter text to encrypt"
              onChange={(e) => setPlainText(e.target.value)}
            />
          </div>
          <Button onClick={handleEncrypt} className="max-w-xs">
            Encrypt
          </Button>
          {/* <Button onClick={handleGenerateInverse} className="max-w-xs">
            Generate Inverse
          </Button> */}
          <Card>
            <CardBody>
              <p>Encrypted text: {encryptedText}</p>
            </CardBody>
          </Card>
          <div className="flex gap-4 w-full">
            <Textarea
              variant="bordered"
              label="Enter text to decrypt"
              onChange={(e) => setCipherText(e.target.value)}
            />
          </div>
          <Button onClick={handleDecrypt} className="max-w-xs">
            Decrypt
          </Button>
          <Card>
            <CardBody>
              <p>Decrypted text: {decryptedText}</p>
            </CardBody>
          </Card>
          {error && <p>{error}</p>}
        </div>
      </div>
      <div className="w-2/3 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Explanation
        </h1>
        <div className="overflow-scroll max-h-[750px] min-h-[750px] p-4">
          <div>
            <h2 class="text-2xl font-semibold mb-4">
              Hill Cipher Encryption Process
            </h2>

            <div class="">
              <h3 class="text-lg font-semibold mb-2">
                Step 1: Choose a Key Matrix
              </h3>
              <p>Define a key matrix to use for encryption.</p>
              <canvas ref={canvasRef1} />
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 2: Prepare the Plaintext
              </h3>
              <p>Remove spaces and punctuation from the plaintext.</p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Plaintext:{" "}
                <span id="plaintext" class="font-medium">
                  {plainText?.toUpperCase()}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 3: Convert Plaintext to Numerical Values
              </h3>
              <p>
                Map each letter of the plaintext to its corresponding numerical
                value.
              </p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Numerical Values:{" "}
                <span id="numerical-values" class="font-medium">
                  {plainText
                    ?.toLowerCase()
                    .split("")
                    .map((char, index) => (
                      <span key={index}>{ascii?.indexOf(char)} </span>
                    ))}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 4: Encrypt the Plaintext
              </h3>
              <p>
                Multiply the key matrix with the numerical values of the
                plaintext to obtain the encrypted values.
              </p>
              <pre id="encrypted-values" class="bg-gray-200 p-2 rounded-md">
                {encryptedText
                  ?.toLowerCase()
                  .split("")
                  .map((char, index) => (
                    <span key={index}>{ascii?.indexOf(char)} </span>
                  ))}
              </pre>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 5: Convert Encrypted Values to Ciphertext
              </h3>
              <p>
                Map the encrypted numerical values to their corresponding
                letters to obtain the ciphertext.
              </p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Ciphertext:{" "}
                <span id="ciphertext" class="font-medium">
                  {encryptedText?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-semibold mb-4">
              Hill Cipher Decryption Process
            </h2>

            <div class="">
              <h3 class="text-lg font-semibold mb-2">
                Step 1: Choose a Key Matrix
              </h3>
              <p>Define the key matrix used for encryption.</p>
              <canvas ref={canvasRef2} />
            </div>

            <div class="">
              <h3 class="text-lg font-semibold mb-2">
                Step 2: Inverse of the Key Matrix
              </h3>
              <p>Calculate the inverse of the key matrix.</p>
              <canvas ref={canvasRef3} />
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 3: Convert Ciphertext to Numerical Values
              </h3>
              <p>
                Map each letter of the ciphertext to its corresponding numerical
                value.
              </p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Ciphertext:{" "}
                <span id="ciphertext" class="font-medium">
                  {cipherText?.toUpperCase()}
                </span>
              </p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Numerical Values:{" "}
                <span id="numerical-values" class="font-medium">
                  {cipherText
                    ?.toLowerCase()
                    .split("")
                    .map((char, index) => (
                      <span key={index}>{ascii?.indexOf(char)} </span>
                    ))}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 4: Decrypt the Ciphertext
              </h3>
              <p>
                Multiply the inverse key matrix with the numerical values of the
                ciphertext to obtain the decrypted values.
              </p>
              <pre id="decrypted-values" class="bg-gray-200 p-2 rounded-md">
                {decryptedText
                  ?.toLowerCase()
                  .split("")
                  .map((char, index) => (
                    <span key={index}>{ascii?.indexOf(char)} </span>
                  ))}
              </pre>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 5: Convert Decrypted Values to Plaintext
              </h3>
              <p>
                Map the decrypted numerical values to their corresponding
                letters to obtain the plaintext.
              </p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Plaintext:{" "}
                <span id="plaintext" class="font-medium">
                  {decryptedText}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HillCipher;
