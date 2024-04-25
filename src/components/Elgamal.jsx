import React, { useEffect, useState } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";

const ElGamal = () => {
  const [p, setP] = useState(23); // Prime modulus
  const [g, setG] = useState(5); // Generator
  const [x, setX] = useState(6); // Private key
  const [y, setY] = useState(8); // Public key
  const [k, setK] = useState(3); // Random number for encryption
  const [error, setError] = useState(null);
  const [keys, setKeys] = useState(null);
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isValid, setIsValid] = useState({ p: true, g: true, x: true });

  const handlePChange = (e) => {
    const value = parseInt(e.target.value);
    setIsValid((prevIsValid) => ({
      ...prevIsValid,
      p: isPrime(value),
      x: false,
    }));
    setP(value);
    setX(-1);
    setY(-1);
    setError(null);
    setKeys(null);
  };

  const handleGChange = (e) => {
    const value = parseInt(e.target.value);
    setIsValid((prevIsValid) => ({ ...prevIsValid, x: false }));
    setG(value);
    setX(-1);
    setY(-1);
    setError(null);
    setKeys(null);
  };

  const handleXChange = (e) => {
    const value = parseInt(e.target.value);
    setX(value);
    setIsValid((prevIsValid) => ({
      ...prevIsValid,
      x: value >= 0 && value < p ? true : false,
    }));
    const publicKey = BigInt(g) ** BigInt(value) % BigInt(p);
    console.log("🚀 ~ handleXChange ~ publicKey:", publicKey);
    setY(publicKey.toString());
    setError(null);
    setKeys(null);
  };

  const generateKeys = () => {
    if (!isValid.p || !isValid.g || isNaN(x) || x >= p || x < 1 || y == -1) {
      toast.error("Enter valid values to generate keys");
      return null;
    }
    return { publicKey: y, privateKey: x };
  };

  const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }
    return true;
  };

  const handleGenerateKeys = () => {
    const keys = generateKeys();
    if (keys) {
      setKeys(keys);
    }
  };

  const handleReset = () => {
    setP(23);
    setG(5);
    setX(6);
    setY(8);
    setK(3);
    setKeys(null);
    setError(null);
    setIsValid({ p: true, g: true, x: true });
  };

  const handleEncrypt = () => {
    if (keys == null) {
      toast.error("Generate keys first");
      return;
    }
    if (isNaN(plainText) || Number(plainText) >= p) {
      toast.error("PlainText should be a number less than " + p);
      return;
    }

    const m = BigInt(plainText);
    const r = BigInt(k);
    const a = BigInt(g) ** r % BigInt(p);
    const b = (m * BigInt(keys.publicKey) ** r) % BigInt(p);

    setEncryptedText({ a: a.toString(), b: b.toString() }); // Convert BigInt to string for display
  };

  const handleDecrypt = () => {
    if (keys == null) {
      toast.error("Generate keys first");
      return;
    }
    if (!cipherText) {
      toast.error("Enter valid ciphertext");
      return;
    }

    const [aStr, bStr] = cipherText.split(",");
    const a = BigInt(aStr.trim());
    const b = BigInt(bStr.trim());

    if (isNaN(Number(a)) || isNaN(Number(b))) {
      toast.error("Enter valid ciphertext (a,b)");
      return;
    }

    const s = BigInt(keys.privateKey);
    const m = (b * a ** (BigInt(p) - BigInt(1) - s)) % BigInt(p);
    setDecryptedText(m.toString());
  };

  return (
    <div className="w-full flex gap-2 px-20">
      <div className="w-1/2 p-4 rounded-xl shadow-xl">
        <h1 className="text-center text-2xl font-semibold underline">
          Procedure
        </h1>
        <div className="flex gap-4 flex-col">
          <h1>Key Generation</h1>
          <div className="flex gap-4">
            <Input
              type="number"
              id="p"
              label="Enter prime number p:"
              value={p}
              onChange={handlePChange}
              variant="bordered"
              isInvalid={!isValid.p}
              color="success"
              errorMessage={!isValid.p && "Please enter a valid prime number."}
              size="sm"
            />
            <Input
              label="Enter generator g:"
              type="number"
              id="g"
              value={g}
              onChange={handleGChange}
              variant="bordered"
              color="success"
              isInvalid={!isValid.g}
              errorMessage={!isValid.g && "Please enter a valid generator."}
              size="sm"
            />
          </div>
          <div className="flex gap-4 w-full">
            <Input
              type="number"
              id="x"
              label="Enter private key x:"
              value={x}
              onChange={handleXChange}
              variant="bordered"
              color="success"
              isInvalid={!isValid.x}
              errorMessage={
                !isValid.x &&
                `Please enter a valid value in range [1, ${p - 2}]`
              }
              size="sm"
              className="w-1/2"
            />
            <Card className="w-1/2">
              <CardBody>
                <p>Public Key (y): {y}</p>
              </CardBody>
            </Card>
          </div>
          <div className="flex gap-4 w-full">
            <Button onClick={handleGenerateKeys} className="max-w-xs">
              Generate Keys
            </Button>
            <Button onClick={handleReset} className="max-w-xs">
              Reset
            </Button>
            <>
              {keys && (
                <div>
                  <p>
                    Public Key (p,g,y): ({p},{g},{keys.publicKey})
                  </p>
                  <p>Private Key: ({keys.privateKey})</p>
                </div>
              )}
            </>
          </div>
          <Textarea
            variant="bordered"
            type="number"
            label="Enter text to encrypt"
            onChange={(e) => setPlainText(e.target.value)}
          />
          <Input
            label="Enter k (random number for encryption):"
            type="number"
            id="k"
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
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
              <p>
                Encrypted text: (c1: {encryptedText.a}, c1: {encryptedText.b})
              </p>
            </CardBody>
          </Card>
          <Textarea
            variant="bordered"
            type="number"
            label="Enter text to decrypt"
            placeholder="c1,c2"
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
        <div class="overflow-scroll max-h-[750px] min-h-[750px] p-4">
          <div>
            <h2 class="text-2xl font-semibold mb-4">
              ElGamal Encryption and Decryption Process
            </h2>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 1: Choose Parameters
              </h3>
              <p>
                Choose prime number 'p', generator 'g', and private key 'x'.
              </p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Prime Number (p):{" "}
                <span id="prime" class="font-medium">
                  {p}
                </span>
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Generator (g):{" "}
                <span id="generator" class="font-medium">
                  {g}
                </span>
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Private Key (x):{" "}
                <span id="private-key" class="font-medium">
                  {x}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 2: Generate Public Key
              </h3>
              <p>
                Calculate public key 'y' using 'g<sup>x</sup> mod p'.
              </p>
              <p class="mt-2">
                y = {g}
                <sup>{x}</sup> mod {p}
              </p>
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Public Key (y):{" "}
                <span id="public-key" class="font-medium">
                  {y}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 3: Encrypt Message
              </h3>
              <p>
                Choose random integer 'k', then calculate 'c<sub>1</sub>' and 'c
                <sub>2</sub>'.
              </p>
              <p class="mt-2" className="bg-gray-200 p-2 rounded-md">
                Random Integer (k):{" "}
                <span id="random-k" class="font-medium">
                  {k}
                </span>
              </p>
              <p className="my-2">
                c1 = g<sup>k</sup> mod p = {g}
                <sup>{k}</sup> mod {p}
                <br />
                c2 = (m * y<sup>k</sup>) mod p = ({plainText} * {y}
                <sup>{k}</sup>) mod {p}
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Ciphertext (c<sub>1</sub>):{" "}
                <span id="ciphertext-c1" class="font-medium">
                  {encryptedText.a}
                </span>
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Ciphertext (c<sub>2</sub>):{" "}
                <span id="ciphertext-c2" class="font-medium">
                  {encryptedText.b}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 4: Decrypt Message
              </h3>
              <p>
                Calculate 'm' using 'c<sub>2</sub> * (c<sub>1</sub>
                <sup>x</sup>)<sup>-1</sup> mod p'.
              </p>
              m = (c2 * (c1
              <sup>x</sup>)<sup>-1</sup>) mod p = ({cipherText?.split(",")[1]} *
              ({cipherText?.split(",")[0]}
              <sup>{x}</sup>)<sup>-1</sup>) mod {p}
              <p class="mt-2 bg-gray-200 p-2 rounded-md">
                Decrypted Message (m):{" "}
                <span id="decrypted-message" class="font-medium">
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

export default ElGamal;
