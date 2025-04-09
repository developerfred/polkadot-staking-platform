# Validator Reward Analyzer

![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=for-the-badge&logo=polkadot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)



Welcome to the **Validator Reward Analyzer**, a powerful tool built for the Polkadot ecosystem to help you analyze validator performance, manage staking, and optimize your rewards! This project is part of the PBA Lucerne DApps Offchain Assignment by developerfred.

## 🚀 What is this project?

This is a **Next.js-powered dApp** designed to make staking on Polkadot easier and more transparent. Whether you're a nominator or just curious about validator rewards, this tool has you covered with:

* Real-time validator performance data
* Staking management (bond, unbond, nominate)
* Bags list optimization
* A sleek, terminal-inspired UI

## [online](https://pba.aipop.fun) | [movie](https://www.youtube.com/embed/4mau2zRiVkg?autoplay=1)

## ✨ Key Features

| **Feature** | **Description** |
|-------------|-----------------|
| Validator Insights | Sort and analyze validators by commission and rewards across eras. |
| Nominator Dashboard | Check your staking status, bonded amount, and selected validators. |
| Bond/Unbond Tokens | Easily manage your DOT with interactive dialogs (28-day unbonding applies). |
| Bag List Checker | Detect and fix misplaced stakes in the bags list with one click. |
| Era Switcher | Compare historical and current validator performance. |

**Fun Fact:** The UI uses a retro terminal style with green text and purple accents—because staking should feel like hacking the blockchain!

## 🏁 Getting Started

Ready to dive in? Follow these steps to run the project locally:

### Prerequisites

* Node.js (v18 or higher)
* pnpm (package manager)
* A Polkadot wallet (e.g., Polkadot.js extension)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/developerfred/pba-lucerne-dapps-offchain-assignment-developerfred.git
cd pba-lucerne-dapps-offchain-assignment-developerfred
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open your browser at http://localhost:3000 and connect your wallet!

## 🛠️ Tech Stack

This project is built with modern tools to ensure performance and scalability:

* **Framework**: Next.js 15.2.3
* **Frontend**: React 19.0.0, TypeScript 5
* **Blockchain**: Polkadot-API 1.9.6
* **Styling**: Tailwind CSS 4, Lucide React icons
* **State Management**: Zustand 5.0.3
* **Animations**: Framer Motion 12.5.0


## 🔍 How It Works

1. **Connect Your Wallet**: Use the Polkadot.js extension to link your account.
2. **Explore Validators**: Sort by reward or commission and pick your favorites (up to 16!).
3. **Stake Your DOT**: Bond tokens and nominate validators with a sleek interface.
4. **Monitor Rewards**: Check your status and optimize your bag position if needed.

**Pro Tip:** The app loads data dynamically from the Polkadot chain—give it a moment to initialize!

## 📝 Example Usage

```typescript
// Bonding more DOT
const handleBondMore = async () => {
  const amount = stakingAPI.convertDOTtoPlanck(parseFloat(bondAmount));
  await stakingAPI.bondMore(activeSigner, amount);
  toast.success("Tokens bonded successfully!");
};
```

## 👥 Contributing

Want to make this tool even better? Contributions are welcome! Here's how:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-idea`)
3. Commit your changes (`git commit -m "Add amazing idea"`)
4. Push to the branch (`git push origin feature/amazing-idea`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License
— feel free to use, modify, and share it!

## 🔮 Future Plans

* Add reward prediction charts
* Support multiple Polkadot networks
* Mobile-friendly design
* Export staking data as CSV

---

*Happy staking with Validator Reward Analyzer! Built with ❤️ by codingsh.*
