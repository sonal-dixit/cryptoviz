import React from "react";
import { Tab, Tabs } from "@nextui-org/react";
import Rsa from "./components/Rsa";
import { Toaster } from "react-hot-toast";
import CaeserCipher from "./components/CaeserCipher";
import VigenereCipher from "./components/VigenereCipher";
import RailFenceCipher from "./components/RailFenceCipher";
import PlayfairCipher from "./components/PlayfairCipher";
import RowTranspositionCipher from "./components/RowTransposition";
import HillCipher from "./components/HillCipher";
import ElGamal from "./components/Elgamal";

const App = () => {
  return (
    <>
      <Toaster />
      {/* <h1 className="text-center font-bold text-4xl p-4 border-b-2">
        CryptoViz
      </h1> */}
      <Tabs>
        <Tab key="1" title="Caeser Cipher">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              CAESER CIPHER ALGORITHM
            </h1>
            <CaeserCipher/>
          </div>
        </Tab>
        <Tab key="2" title="Vigenere Cipher">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              VIGENERE CIPHER ALGORITHM
            </h1>
            <VigenereCipher/>
          </div>
        </Tab>
        <Tab key="3" title="Playfair Cipher">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              PLAYFAIR CIPHER
            </h1>
            <PlayfairCipher/>
          </div>
        </Tab>
        <Tab key="4" title="Hill Cipher">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              HILL CIPHER ALGORITHM
            </h1>
            <HillCipher/>
          </div>
        </Tab>
        <Tab key="5" title="Rail fence Cipher">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              RAIL FENCE CIPHER ALGORITHM
            </h1>
            <RailFenceCipher/>
          </div>
        </Tab>
        <Tab key="6" title="Row Transposition Cipher">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              ROW TRANSPOSITION CIPHER
            </h1>
            <RowTranspositionCipher/>
          </div>
        </Tab>
        <Tab key="7" title="RSA">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              RSA ALGORITHM
            </h1>
            <Rsa />
          </div>
        </Tab>
        <Tab key="8" title="Elgamal">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold text-center p-2">
              ELGAMAL ALGORITHM
            </h1>
            <ElGamal/>
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default App;
