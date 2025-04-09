"use client";

import { fontUnbounded } from "@/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ChevronRight,
    Terminal,
    Award,
    Layers,
    List,
    Users,
    DollarSign,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EducationPage() {
    const router = useRouter();

    return (
        <main className="flex min-h-screen flex-col p-8 pb-20">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-[600px] bg-purple-700/20 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-1/2 h-[500px] bg-blue-700/20 blur-[180px] rounded-full -z-10" />

            <div className="flex items-center mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>

            <div className="max-w-4xl mx-auto w-full">
                <h1
                    className={cn(
                        "text-4xl md:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400",
                        fontUnbounded.className
                    )}
                >
                    Understanding Polkadot Staking
                </h1>

                <div className="prose prose-invert max-w-none">
                    <div className="bg-black/40 border border-purple-900/30 rounded-lg p-6 mb-8">
                        <h2 className="flex items-center text-2xl mb-4 text-purple-300">
                            <Terminal className="mr-2 h-5 w-5" />
                            Basic Staking Concepts
                        </h2>
                        <p className="text-gray-300">
                            Staking is the process of participating in the Polkadot network by locking up DOT tokens to help secure the network. In return, stakers receive rewards in the form of additional DOT.
                        </p>
                        <p className="text-gray-300 mt-4">
                            There are two main roles in the Polkadot staking system:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-purple-300 font-medium">Validators</span>: Run nodes that secure the network by validating proofs and processing transactions.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-purple-300 font-medium">Nominators</span>: Stake their DOT to validators, contributing to network security without running nodes themselves.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-black/40 border border-purple-900/30 rounded-lg p-6 mb-8">
                        <h2 className="flex items-center text-2xl mb-4 text-green-400">
                            <Award className="mr-2 h-5 w-5" />
                            Validator Selection
                        </h2>
                        <p className="text-gray-300">
                            Choosing the right validators is crucial for maximizing your staking rewards. Consider these factors:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-green-300 font-medium">Commission</span>: The percentage of rewards validators keep for themselves. Lower means higher returns for you.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-green-300 font-medium">Performance</span>: Validators that consistently produce blocks and stay online earn more rewards.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-green-300 font-medium">Reputation</span>: Established validators with a track record of reliability reduce risk.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-green-300 font-medium">Diversification</span>: Spreading your nominations across multiple validators reduces risk if one performs poorly.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-black/40 border border-purple-900/30 rounded-lg p-6 mb-8">
                        <h2 className="flex items-center text-2xl mb-4 text-blue-400">
                            <Layers className="mr-2 h-5 w-5" />
                            The Staking Process
                        </h2>
                        <ol className="space-y-4 mt-4 ml-0 pl-0 list-none">
                            <li className="flex">
                                <div className="bg-blue-500/20 text-blue-300 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</div>
                                <div>
                                    <span className="text-blue-300 font-medium">Bond tokens</span>: Lock up your DOT as stake. This amount is subject to slashing if your chosen validators misbehave.
                                </div>
                            </li>
                            <li className="flex">
                                <div className="bg-blue-500/20 text-blue-300 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</div>
                                <div>
                                    <span className="text-blue-300 font-medium">Nominate validators</span>: Select up to 16 validators you trust. You can change your nominations at any time.
                                </div>
                            </li>
                            <li className="flex">
                                <div className="bg-blue-500/20 text-blue-300 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
                                <div>
                                    <span className="text-blue-300 font-medium">Wait for activation</span>: Your nominations become active in the next era (approximately 24 hours).
                                </div>
                            </li>
                            <li className="flex">
                                <div className="bg-blue-500/20 text-blue-300 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">4</div>
                                <div>
                                    <span className="text-blue-300 font-medium">Earn rewards</span>: Rewards are distributed automatically at the end of each era.
                                </div>
                            </li>
                            <li className="flex">
                                <div className="bg-blue-500/20 text-blue-300 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">5</div>
                                <div>
                                    <span className="text-blue-300 font-medium">Unbond (optional)</span>: When you want to unlock your tokens, you need to unbond them. This process takes 28 days.
                                </div>
                            </li>
                        </ol>
                    </div>

                    <div className="bg-black/40 border border-purple-900/30 rounded-lg p-6 mb-8">
                        <h2 className="flex items-center text-2xl mb-4 text-orange-400">
                            <List className="mr-2 h-5 w-5" />
                            Bags List
                        </h2>
                        <p className="text-gray-300">
                            The Bags List is a crucial part of the nominator selection mechanism in Polkadot:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    Nominators are organized into `&apos;`bags`&apos;` according to their staked amount.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    Each bag has a range of stake amounts (e.g., 1000-2000 DOT).
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    Nominators with more stake have a higher chance of being selected.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    When compounding rewards, your position might need to be updated to a higher bag.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-black/40 border border-purple-900/30 rounded-lg p-6 mb-8">
                        <h2 className="flex items-center text-2xl mb-4 text-red-400">
                            <Users className="mr-2 h-5 w-5" />
                            Active vs. Inactive Nominators
                        </h2>
                        <p className="text-gray-300">
                            Not all nominators earn rewards on Polkadot:
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 mt-4">
                            <div className="flex-1 bg-black/30 rounded-lg p-4 border border-red-900/30">
                                <h3 className="text-red-300 font-medium mb-2">Why You Might Not Earn Rewards</h3>
                                <ul className="space-y-2">
                                    <li className="flex">
                                        <ChevronRight className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>Your nominated validators aren`&apos;`t in the active set</div>
                                    </li>
                                    <li className="flex">
                                        <ChevronRight className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>Your stake is too low to be in the active nominators list</div>
                                    </li>
                                    <li className="flex">
                                        <ChevronRight className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>You`&apos;`re in the wrong bag (after compounding rewards)</div>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 bg-black/30 rounded-lg p-4 border border-green-900/30">
                                <h3 className="text-green-300 font-medium mb-2">How to Increase Your Chances</h3>
                                <ul className="space-y-2">
                                    <li className="flex">
                                        <ChevronRight className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>Nominate a diverse set of validators (up to 16)</div>
                                    </li>
                                    <li className="flex">
                                        <ChevronRight className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>Increase your bonded amount</div>
                                    </li>
                                    <li className="flex">
                                        <ChevronRight className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>Regularly check and update your bag position</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-purple-900/30 rounded-lg p-6">
                        <h2 className="flex items-center text-2xl mb-4 text-yellow-400">
                            <DollarSign className="mr-2 h-5 w-5" />
                            Reward Calculation
                        </h2>
                        <p className="text-gray-300">
                            Understanding how rewards are calculated can help you maximize your returns:
                        </p>
                        <ul className="space-y-2 mt-4">
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-yellow-300 font-medium">Base Reward Rate</span>: Determined by the total amount of DOT staked in the network.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-yellow-300 font-medium">Validator Performance</span>: Better-performing validators earn more rewards for their nominators.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-yellow-300 font-medium">Commission</span>: Validators take a percentage (commission) of rewards before distributing to nominators.
                                </div>
                            </li>
                            <li className="flex">
                                <ChevronRight className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-yellow-300 font-medium">Your Stake Amount</span>: Rewards are proportional to your stake amount relative to the total stake for that validator.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={() => router.push('/analyzer')}
                            className="bg-purple-700 hover:bg-purple-600 text-white text-lg px-8 py-6"
                        >
                            Go to Validator Analyzer
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}