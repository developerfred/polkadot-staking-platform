"use client";

import  ValidatorRewardAnalyzer  from "@/components/ValidatorRewardAnalyzer";
import { Button } from "@/components/ui/button";
import { fontUnbounded } from "@/fonts";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnalyzerPage() {
    const router = useRouter();

    return (
        <main className="flex min-h-screen flex-col p-4 pb-20">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-[600px] bg-purple-700/20 blur-[150px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-1/2 h-[500px] bg-blue-700/20 blur-[180px] rounded-full -z-10" />

            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>

            <div className="max-w-6xl mx-auto w-full">
                <h1
                    className={cn(
                        "text-3xl md:text-4xl mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400",
                        fontUnbounded.className
                    )}
                >
                    Validator Reward Analyzer
                </h1>

                <ValidatorRewardAnalyzer />
            </div>
        </main>
    );
}