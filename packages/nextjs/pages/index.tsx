import { useState } from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address, AddressInput, EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const [addresses, setAddresses] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<string[]>([]);

  let total = 0n;
  if (amounts) {
    for (let i = 0; i < amounts.length; i++) {
      total += parseEther(amounts[i]);
    }
  }

  const display = [];
  for (let a in addresses) {
    display.push(
      <div className="flex flex-col">
        <Address address={addresses[a]} /> : {amounts[a]}
      </div>,
    );
  }

  const { writeAsync: split } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "split",
    args: [addresses, amounts.map(a => parseEther(a))],
    value: "" + formatEther(total),
  });

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="p-4">{display}</div>

        <div>
          <AddressInput placeholder="address" value={address} onChange={a => setAddress(a)} />
          <EtherInput placeholder="amount" value={amount} onChange={a => setAmount(a)} />
          <div className="flex items-center flex-col flex-grow pt-10">
            <button
              className="btn"
              onClick={() => {
                setAddresses([...addresses, address]);
                setAmounts([...amounts, amount]);
                setAddress("");
                setAmount("");
              }}
            >
              add
            </button>
          </div>
          <div className="flex items-center flex-col flex-grow pt-10">
            <button
              className="btn btn-primary"
              disabled={addresses.length === 0}
              onClick={() => {
                split();
              }}
            >
              split {formatEther(total)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
