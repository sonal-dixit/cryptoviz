import React, { useEffect, useState } from "react";
import { Input, Button, CardBody, Card, Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";

const Rsa = () => {
  const [p, setP] = useState(11);
  const [q, setQ] = useState(13);
  const [n, setN] = useState(143);
  const [phi, setPhi] = useState(120);
  const [e, setE] = useState(67);
  const [d, setD] = useState(43);
  const [error, setError] = useState(null);
  const [keys, setKeys] = useState(null);
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isValid, setIsValid] = useState({ p: true, q: true, e: true });
  // const ascii = "abcdefghijklmnopqrstuvwxyz";

  const handlePChange = (e) => {
    const value = parseInt(e.target.value);
    setP(value);
    setD(-1);
    setE(-1);
    setIsValid((prevIsValid) => ({
      ...prevIsValid,
      p: isPrime(value),
      e: false,
    }));
    setN(value * q);
    setPhi((value - 1) * (q - 1));
    setError(null);
    setKeys(null);
  };

  const handleQChange = (e) => {
    const value = parseInt(e.target.value);
    setQ(value);
    setE(-1);
    setD(-1);
    setIsValid((prevIsValid) => ({
      ...prevIsValid,
      q: isPrime(value),
      e: false,
    }));
    setN(value * p);
    setPhi((value - 1) * (p - 1));
    setKeys(null);
  };

  const handleEChange = (e) => {
    const value = parseInt(e.target.value);
    setE(value);
    setIsValid((prevIsValid) => ({ ...prevIsValid, e: isCoPrime(value) }));
    setD(calcPrivate(value, phi));
    setError(null);
    setKeys(null);
  };

  const isPrime = (num) => {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return num > 1;
  };

  const calcPrivate = (A, M) => {
    for (let i = 1; i < M; i++) {
      if (((A % M) * (i % M)) % M == 1) return i;
    }
    return -1;
  };

  const isCoPrime = (num) => {
    let smaller = Math.min(num, phi);
    let hcf = 1;
    for (let i = 1; i <= smaller; i++) {
      if (num % i === 0 && phi % i === 0) {
        hcf = i;
      }
    }
    return hcf === 1 ? true : false;
  };

  const generateKeys = () => {
    if (!isValid.e || !isValid.p || !isValid.q || e == -1 || d == -1) {
      toast.error("Enter valid values to generate keys");
      return;
    }
    return { publicKey: e, privateKey: d };
  };

  const handleGenerateKeys = () => {
    const keys = generateKeys();
    setKeys(keys);
  };

  const handleReset = () => {
    setP(11);
    setQ(13);
    setN(143);
    setPhi(120);
    setE(67);
    setD(43);
    setKeys(null);
    setError(null);
    setIsValid({ p: true, q: true, e: true });
  };

  const handleEncrypt = () => {
    if (keys == null) {
      toast.error("Generate keys first");
      return;
    }
    if (isNaN(plainText) || Number(plainText) >= n) {
      toast.error("PlainText should be a number less than " + n);
      return;
    }
    // let code = ascii.indexOf(plainText);
    // let val = Number(
    //   (BigInt(code) ** BigInt(keys.publicKey) % BigInt(n)) % BigInt(26)
    // );
    // setEncryptedText(ascii[val]);
    // let code = ascii.indexOf(plainText);
    let val = Number(BigInt(plainText) ** BigInt(keys.publicKey) % BigInt(n));
    setEncryptedText(val);
  };

  const handleDecrypt = () => {
    // let code = ascii.indexOf(cipherText);
    // let val = Number(
    //   (BigInt(code) ** BigInt(keys.privateKey) % BigInt(n)) % BigInt(26)
    // );
    // setDecryptedText(ascii[val]);
    // let code = ascii.indexOf(cipherText);
    let val = Number(BigInt(cipherText) ** BigInt(keys.privateKey) % BigInt(n));
    setDecryptedText(val);
  };

  const printEncryptionTable = () => {
    if (keys == null) return;

    const encryptionTable = [];

    for (let i = 0; i < n; i++) {
      const encryptedValue = Number(
        BigInt(i) ** BigInt(keys.publicKey) % BigInt(n)
      );
      encryptionTable.push(
        <p
          key={"en" + i}
          id={"en" + i}
          className="border-2 border-red-600 py-2 text-center"
        >
          {i}
          <sup>{keys.publicKey}</sup>mod{n}={encryptedValue}
        </p>
      );
    }

    return <div className="grid grid-cols-4 gap-2">{encryptionTable}</div>;
  };

  const printDecryptionTable = () => {
    if (keys == null) return;

    const decryptionTable = [];

    for (let i = 0; i < n; i++) {
      const decryptedValue = Number(
        BigInt(i) ** BigInt(keys.privateKey) % BigInt(n)
      );
      decryptionTable.push(
        <p
          key={"de" + i}
          id={"de" + i}
          className="border-2 border-red-600 py-2 text-center"
        >
          {i}
          <sup>{keys.privateKey}</sup>mod{n}={decryptedValue}
        </p>
      );
    }

    return <div className="grid grid-cols-4 gap-2">{decryptionTable}</div>;
  };

  const printTables = () => {
    if (keys == null) return;

    const encryptionTable = [];
    const decryptionTable = [];

    for (let i = 0; i < n; i++) {
      // Encryption table
      const encryptedValue = Number(
        BigInt(i) ** BigInt(keys.publicKey) % BigInt(n)
      );
      const isPlaintext = "en" + plainText === "en" + i;

      const cellClassName = isPlaintext ? "bg-yellow-500" : "";

      encryptionTable.push(
        <p
          key={"en" + i}
          id={"en" + i}
          className={`border-2 border-red-600 py-2 text-center ${cellClassName}`}
        >
          {i}
          <sup>{keys.publicKey}</sup>mod{n}={encryptedValue}
        </p>
      );

      // Decryption table
      const decryptedValue = Number(
        BigInt(i) ** BigInt(keys.privateKey) % BigInt(n)
      );
      const isDecryptionPlaintext = "de" + cipherText === "de" + i;

      const cellClassName1 = isDecryptionPlaintext ? "bg-yellow-500" : "";

      decryptionTable.push(
        <p
          key={"de" + i}
          id={"de" + i}
          className={`border-2 border-red-600 py-2 text-center ${cellClassName1}`}
        >
          {i}
          <sup>{keys.privateKey}</sup>mod{n}={decryptedValue}
        </p>
      );
    }

    return (
      <div className="flex">
        <div className="mr-4 flex flex-col items-center w-1/2">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Encryption Table
          </h3>
          <div className="grid grid-cols-2 gap-2">{encryptionTable}</div>
        </div>
        <div className="flex flex-col items-center w-1/2">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Decryption Table
          </h3>
          <div className="grid grid-cols-2 gap-2">{decryptionTable}</div>
        </div>
      </div>
    );
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
              label="Enter prime number q:"
              type="number"
              id="q"
              value={q}
              onChange={handleQChange}
              variant="bordered"
              color="success"
              isInvalid={!isValid.q}
              errorMessage={!isValid.q && "Please enter a valid prime number."}
              size="sm"
            />
          </div>
          <div className="flex gap-4 w-full">
            <Card className="w-1/2">
              <CardBody>
                <p>n=p*q-1: {n}</p>
              </CardBody>
            </Card>
            <Card className="w-1/2">
              <CardBody>
                <p>φ(n)=(p-1)*(q-1): {phi}</p>
              </CardBody>
            </Card>
          </div>
          <div className="flex gap-4 w-full">
            <Input
              label="Enter a number e coprime to φ(n):"
              type="number"
              id="e"
              value={e}
              onChange={handleEChange}
              variant="bordered"
              color="success"
              isInvalid={!isValid.e}
              errorMessage={
                !isValid.e && "Please enter a number coprime to φ(n)."
              }
              className="w-1/2"
              size="sm"
            />
            <Card className="w-1/2">
              <CardBody>
                <p>d: {d}</p>
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
            {error != null ? (
              error
            ) : (
              <>
                {keys && (
                  <div>
                    <p>
                      Public Key: ({keys.publicKey}, {n})
                    </p>
                    <p>
                      Private Key: ({keys.privateKey}, {n})
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <Textarea
            variant="bordered"
            type="number"
            label="Enter text to encrypt"
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
            type="number"
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
          <div>
            <h2 class="text-2xl font-semibold mb-4">
              RSA Encryption and Decryption Process
            </h2>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 1: Choose Prime Numbers
              </h3>
              <p>Choose two distinct prime numbers 'p' and 'q'.</p>
              <p class="bg-gray-200 p-2 rounded-md mt-2">
                Prime Number (p):{" "}
                <span id="prime-p" class="font-medium">
                  {p}
                </span>
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Prime Number (q):{" "}
                <span id="prime-q" class="font-medium">
                  {q}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 2: Calculate Modulus and Totient
              </h3>
              <p>
                Calculate 'n' (modulus) and 'φ(n)' (totient) using 'p' and 'q'.
              </p>
              <p class="bg-gray-200 p-2 rounded-md mt-2">
                Modulus (n): p x q = {p} x {q} ={" "}
                <span id="modulus-n" class="font-medium">
                  {n}
                </span>
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Totient (φ(n)): (p-1) x (q-1) = {p - 1} x {q - 1} ={" "}
                <span id="totient-phi" class="font-medium">
                  {phi}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 3: Choose Public Key
              </h3>
              <p>
                Choose an integer 'e' such that '1 &lt; e &lt; φ(n)' and 'gcd(e,
                φ(n)) = 1'.
              </p>
              <p class="bg-gray-200 p-2 rounded-md mt-2">
                Public Key (e):
                <span id="public-key-e" class="font-medium">
                  {e}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 4: Calculate Private Key
              </h3>
              <p>
                Calculate private key 'd' using the extended Euclidean
                algorithm.
              </p>
              <p class="bg-gray-200 p-2 rounded-md mt-2">
                Private Key (d):{" "}
                <span id="private-key-d" class="font-medium">
                  {d}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 5: Encrypt Message
              </h3>
              <p>
                Choose plaintext 'm' and calculate ciphertext 'c' using 'c ≡ m
                <sup>e</sup> (mod n)'.
              </p>
              <p class="bg-gray-200 p-2 rounded-md mt-2">
                Plaintext (m):{" "}
                <span id="plaintext-m" class="font-medium">
                  {plainText}
                </span>
              </p>
              <p className="mt-2">
                c ≡ {plainText} <sup>{e}</sup> (mod {n})
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Ciphertext (c):{" "}
                <span id="ciphertext-c" class="font-medium">
                  {encryptedText}
                </span>
              </p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">
                Step 6: Decrypt Message
              </h3>
              <p>
                Calculate plaintext 'm' using 'm ≡ c<sup>d</sup> (mod n)'.
              </p>
              <p className="bg-gray-200 p-2 rounded-md mt-2">
                Ciphertext (c):{" "}
                <span id="ciphertext-c" class="font-medium">
                  {cipherText}
                </span>
              </p>
              <p className="mt-2">
                m ≡ {cipherText} <sup>{d}</sup> (mod {n})
              </p>
              <p class="bg-gray-200 p-2 rounded-md mt-2">
                Decrypted Message (m):{" "}
                <span id="decrypted-message" class="font-medium">
                  {decryptedText}
                </span>
              </p>
            </div>
          </div>
          <br />
          {printTables()}
          {/* <h2 className="text-2xl font-semibold">Encryption Table</h2>
          {printEncryptionTable()}
          <br />
          <h2 className="text-2xl font-semibold">Decryption Table</h2>
          {printDecryptionTable()} */}
        </div>
      </div>
    </div>
  );
};

export default Rsa;
