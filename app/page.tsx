'use client';


import { fontUnbounded } from "@/fonts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import router from "next/router";

const GlowBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-1/2 h-[600px] bg-purple-700/20 blur-[150px] rounded-full" />
    <div className="absolute bottom-1/4 right-1/4 w-1/2 h-[500px] bg-blue-700/20 blur-[180px] rounded-full" />
  </div>
);

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen p-8 pb-20 flex-col gap-[48px] items-center justify-center relative">
      <GlowBackground />

      <div className="flex flex-col items-center gap-6 max-w-4xl text-center">
        <h1
          className={cn(
            "text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400",
            fontUnbounded.className
          )}
        >
          Polkadot Staking Platform
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl">
          A modern staking platform for Polkadot, optimized for nominators with
          simplified Bags List management and intelligent validator selection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => router.push('/education')}
            className="border-purple-500/30 text-white hover:bg-purple-900/20 text-lg px-8 py-6"
          >
            Learn about Staking
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/analyzer')}
            className="border-purple-500/30 text-white hover:bg-purple-900/20 text-lg px-8 py-6"
          >
            Analyzer
          </Button>
        </div>
      </div>

      {/* Plans to feature 

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-8">
        <FeatureCard
          title="Simplified Staking"
          description="Bond tokens and nominate validators with an intuitive interface. Manage your staking positions with ease."
          icon="/icons/staking.svg"
        />
        <FeatureCard
          title="Bags List Optimization"
          description="Visualize and optimize your position in the Bags List to maximize your chances of being in the active set."
          icon="/icons/optimization.svg"
        />
        <FeatureCard
          title="Validator Intelligence"
          description="Select validators based on performance, commissions, and risk factors with our intelligent recommendation system."
          icon="/icons/validators.svg"
        />
      </div>*/}

      <div className="mt-16 border-t border-purple-900/30 pt-8 w-full max-w-5xl">
        <p className="text-center text-white/60">
          Built with Next.js and Polkadot-API. Using light client technology for secure and efficient blockchain interactions.
        </p>
      </div>
    </main>
  );
}

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-black/30 backdrop-blur-md border border-purple-900/30 rounded-xl p-6 hover:border-purple-500/30 transition-all">
    <div className="h-12 w-12 mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">      
      <div className="h-6 w-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);