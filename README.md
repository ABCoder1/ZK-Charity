🌙 ZK Charity – Private Donation Platform on Midnight

A privacy-preserving donation platform built on the Midnight Network that allows donors to contribute funds anonymously while still being able to prove their donations using Zero-Knowledge Proofs (ZKPs).

🚀 Built at the Midnight Hackathon.

____

✨ Why ZK Charity?

Most blockchains are fully transparent — anyone can see who sent what to whom.
This is bad for donors and charities:

	•	Donors may not want their identities (phone number, email, etc.) or donation amounts public.
	•	Charities may not want sensitive financial flows exposed.

ZK Charity solves this by enabling:

	•	🔒 Anonymous donations (shielded with Midnight’s $DUST token).
	•	🧾 ZK receipts: donors can prove they donated (e.g., for tax receipts, reputation) without revealing personal details.
	•	✅ Auditable transparency: charities and regulators can verify donation totals without exposing individual donor info.

____

🛠️ How It Works

	1.	Donor makes a donation via Midnight testnet using $DUST (shielded transaction). 
	2.	A ZK Proof is generated that proves:
	•	The donor donated to charity X. 
	•	(Optionally) The donation amount ≥ threshold. 
	3.	The commitment is stored on-chain; donor receives a ZK receipt. 
	4.	Donor can share the receipt with:
	•	Auditors → verify without revealing donor details. 
	•	Reputation system → mint a badge/NFT proving donation. 
____

⚙️ Architecture

```
Frontend (React) 
   ↕ Wallet SDK (Midnight)  
Smart Contract (Midnight Layer 1)
   ↕ Commitment + Proof Verification
Proof Server (Node.js + circom/snarkjs)
   ↕ ZK Proof Generation (donor secret + amount + charity_id)
Verifier Portal (React/Node)
```

	•	Frontend: React + Midnight Wallet SDK for donations & proof receipts. 
	•	Proof Server: Runs ZK circuits (circom/snarkjs) to generate donation proofs.
	•	Smart Contract: Deployed on Midnight testnet; stores commitments & verifies proofs. 
	•	Verifier UI: Simple portal for auditors/charities to validate proofs or aggregate totals.

____

🧩 Tech Stack

	•	Blockchain: Midnight Network (Layer 1, Cardano ecosystem)
	•	Privacy: Zero-Knowledge Proofs (circom + snarkjs) 
	•	Frontend: React + Vite + Midnight Wallet SDK
	•	Backend: Node.js proof server
	•	Storage: On-chain commitments, optional metadata in IPFS

____

🗂️ Repository Structure

```
zk-charity/
├── contracts/       # Midnight smart contract
├── circuits/        # ZK circuits (circom)
├── proof-server/    # Node.js server for proof generation
├── frontend/        # React frontend (donation & receipt UI)
├── verifier/        # Auditor/verification portal
└── README.md        # Project overview
```
____

🚀 Getting Started

1. Prerequisites :
```
    •	Node.js (>=16)
    •	Rust (if using Noir for circuits)
    •	circom & snarkjs
    •	Midnight Wallet SDK + Testnet wallet (Lace/OKX)
    •	$tDUST from Midnight Testnet Faucet
```
2. Clone repository

```
git clone https://github.com/ABCoder1/zk-charity.git
cd zk-charity
```

3. Install dependencies
```
cd frontend && npm install
cd ../proof-server && npm install
```

4. Compile circuits
```
cd circuits
circom donation.circom --r1cs --wasm --sym
snarkjs groth16 setup donation.r1cs powersOfTau28_hez_final_10.ptau donation.zkey
```

5. Run proof server
```
cd proof-server
npm start
```

6. Start frontend
```
cd frontend
npm run dev
```

7. Start verifier
```
cd verifier
npm start
```

____

🎯 Demo Flow

	1.	Connect wallet & get $tDUST from faucet.
	2.	Donate anonymously to a listed charity.
	3.	Generate a ZK receipt (downloadable JSON or QR code).
	4.	Share receipt with auditor → Auditor verifies via verifier portal.
	5.	(Optional) Mint donation badge NFT.

____

🔮 Future Work

	•	✅ Aggregate ZK proofs for total donations (without exposing donors).
	•	✅ Advanced selective disclosure (prove “donated at least X” without revealing X).
	•	✅ Mobile app support.
	•	✅ Real-world integration for charities & tax authorities.

____

👥 Team

Built by The MoonKnight Devs at the Midnight Hackathon (MLH) 💜.

____

📜 License

MIT License © 2025 The MoonKnight Devs