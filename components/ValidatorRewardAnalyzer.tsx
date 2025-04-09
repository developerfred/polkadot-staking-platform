
import { useState, useEffect } from 'react';
import { useChain } from '@/providers/chain-provider';
import { usePolkadotExtension } from '@/providers/polkadot-extension-provider';
import { Loader2, Info, ChevronDown, ChevronUp, Award, Users,  WalletIcon, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fontMono } from '@/fonts';
import { cn, trimAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { useStakingStore } from '@/store/useStakingStore';
import { StakingAPI } from '@/services/stakingAPI';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTxContext } from '@/providers/tx-provider';

const ValidatorRewardAnalyzer = () => {
    const { api, client } = useChain();
    const { activeSigner, selectedAccount } = usePolkadotExtension();
    const { isProcessing, setIsProcessing } = useTxContext();

    
    const {
        validators,
        activeEra,
        historicalEras,
        selectedEra,
        loading,
        nominatorStatus,
        minStake,
        canNominate,
        selectedValidators,
        bagListInfo,
        sortField,
        sortDirection,
        showNominatorSection,
        showMinStakeSection,
        showValidatorsSection,
        terminalReady,
        setTerminalReady,
        toggleSection,
        toggleValidatorSelection,
        setSortField
    } = useStakingStore();

    
    const [showBondDialog, setShowBondDialog] = useState(false);
    const [showUnbondDialog, setShowUnbondDialog] = useState(false);
    const [bondAmount, setBondAmount] = useState('');
    const [unbondAmount, setUnbondAmount] = useState('');

    
    const [stakingAPI, setStakingAPI] = useState<StakingAPI | null>(null);

    
    useEffect(() => {
        if (terminalReady) return;

        const timeout = setTimeout(() => {
            setTerminalReady(true);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [terminalReady, setTerminalReady]);

    
    useEffect(() => {
        if (!api || !terminalReady) return;

        const initializeAPI = async () => {
            try {
                setIsProcessing(true);
                const newAPI = new StakingAPI(api);
                setStakingAPI(newAPI);

    
                await newAPI.initialize(selectedAccount?.address);

                setIsProcessing(false);
            } catch (error) {
                console.error('Error initializing staking API:', error);
                toast.error('Failed to initialize staking system');
                setIsProcessing(false);
            }
        };

        initializeAPI();
    }, [api, terminalReady, setIsProcessing, selectedAccount]);

    
    useEffect(() => {
        if (!stakingAPI || !selectedAccount?.address) return;

        stakingAPI.loadAccountData(selectedAccount.address);
    }, [stakingAPI, selectedAccount]);

    
    const handleEraChange = async (era: number) => {
        if (!stakingAPI) return;
        await stakingAPI.loadValidatorsForEra(era);
    };

    
    const handleBondMore = async () => {
        if (!stakingAPI || !activeSigner || !bondAmount) return;

        try {
            const amount = stakingAPI.convertDOTtoPlanck(parseFloat(bondAmount));
            await stakingAPI.bondMore(activeSigner, amount);
            setBondAmount('');
            setShowBondDialog(false);

            
            if (selectedAccount?.address) {
                setTimeout(() => {
                    stakingAPI.loadAccountData(selectedAccount.address);
                }, 12000); 
            }
        } catch (error) {
            console.error('Error bonding tokens:', error);
            toast.error('Failed to bond tokens');
        }
    };


    const handleUnbond = async () => {
        if (!stakingAPI || !activeSigner || !unbondAmount) return;

        try {
            const amount = stakingAPI.convertDOTtoPlanck(parseFloat(unbondAmount));
            await stakingAPI.unbond(activeSigner, amount);
            setUnbondAmount('');
            setShowUnbondDialog(false);

            
            if (selectedAccount?.address) {
                setTimeout(() => {
                    stakingAPI.loadAccountData(selectedAccount.address);
                }, 12000); 
            }
        } catch (error) {
            console.error('Error unbonding tokens:', error);
            toast.error('Failed to unbond tokens');
        }
    };

    
    const handleRebag = async () => {
        if (!stakingAPI || !activeSigner) return;

        try {
            await stakingAPI.rebag(activeSigner);
    
            if (selectedAccount?.address) {
                setTimeout(() => {
                    stakingAPI.loadAccountData(selectedAccount.address);
                }, 12000); 
            }
        } catch (error) {
            console.error('Error updating bag position:', error);
            toast.error('Failed to update bag position');
        }
    };

    
    const submitNominations = async () => {
        if (!stakingAPI || !activeSigner) return;

        try {
            await stakingAPI.nominate(activeSigner);

    
            if (selectedAccount?.address) {
                setTimeout(() => {
                    stakingAPI.loadAccountData(selectedAccount.address);
                }, 12000); 
            }
        } catch (error) {
            console.error('Error submitting nominations:', error);
            toast.error('Failed to submit nominations');
        }
    };

    
    const formatDOT = (amount?: bigint | null) => {
        if (!stakingAPI || !amount) return '0 DOT';
        return stakingAPI.formatDOT(amount);
    };

    
    const sortedValidators = [...validators].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortDirection === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });

    if (!terminalReady) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className={cn(fontMono.className, "text-green-400 text-lg animate-pulse")}>
                    Initializing validator analyzer...
                </div>
            </div>
        );
    }

    return (
        <div className={cn("w-full max-w-6xl mx-auto p-4", fontMono.className)}>
            <div className="bg-black/60 border border-purple-900/40 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-green-400 text-xl font-bold">Validator Reward Analyzer </h2>
                    <div className="flex gap-2">
                        <div className="px-2 py-1 text-xs bg-green-900/30 border border-green-500/30 rounded text-green-400">
                            Active Era: {activeEra !== null ? activeEra : '...'}
                        </div>
                        {loading && <Loader2 className="animate-spin w-5 h-5 text-green-400" />}
                    </div>
                </div>

                {/* Nominator Status Section */}
                <div className="mb-6">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('nominator')}
                    >
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-400" />
                            <h3 className="text-green-400 text-lg">Nominator Status</h3>
                        </div>
                        {showNominatorSection ?
                            <ChevronUp className="w-5 h-5 text-green-400" /> :
                            <ChevronDown className="w-5 h-5 text-green-400" />
                        }
                    </div>

                    {showNominatorSection && (
                        <div className="mt-3 border-t border-green-900/40 pt-3">
                            {!selectedAccount ? (
                                <div className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 p-3 rounded">
                                    Connect your wallet to view nominator status
                                </div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-black/40 p-3 rounded border border-purple-900/40">
                                            <div className="text-purple-300 mb-1">Account</div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-white">{selectedAccount.name}</div>
                                                <div className="text-gray-400 text-sm">{trimAddress(selectedAccount.address, 8)}</div>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 p-3 rounded border border-purple-900/40">
                                            <div className="text-purple-300 mb-1">Can Nominate</div>
                                            {canNominate === null ? (
                                                <Loader2 className="animate-spin w-5 h-5 text-purple-300" />
                                            ) : canNominate ? (
                                                <div className="text-green-400">Yes ✓</div>
                                            ) : (
                                                <div className="text-red-400">No ✗ (Insufficient balance)</div>
                                            )}
                                        </div>
                                    </div>

                                    {nominatorStatus && (
                                        <div className="mt-4">
                                            {nominatorStatus.isNominating ? (
                                                <div className="bg-black/40 p-3 rounded border border-purple-900/40">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                                        <div>
                                                            <div className="text-purple-300 text-sm">Status</div>
                                                            <div className="text-white">Nominating</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-purple-300 text-sm">Bonded Amount</div>
                                                            <div className="text-white">{formatDOT(nominatorStatus.bondedAmount)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-purple-300 text-sm">Earning Rewards</div>
                                                            <div className={nominatorStatus.isEarningRewards ? "text-green-400" : "text-red-400"}>
                                                                {nominatorStatus.isEarningRewards ? "Yes" : "No"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="text-purple-300 text-sm mb-2">Selected Validators ({nominatorStatus.nominations?.length || 0})</div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {nominatorStatus.nominations?.map((validator, index) => (
                                                                <div key={index} className="text-gray-300 text-sm">
                                                                    {trimAddress(validator, 6)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Bags List Information */}
                                                    {bagListInfo.isMisplaced !== null && (
                                                        <div className="mt-3 border-t border-purple-900/40 pt-3">
                                                            <div className="text-purple-300 text-sm mb-2">Bags List Status</div>

                                                            {bagListInfo.isMisplaced ? (
                                                                <div className="bg-red-900/20 border border-red-500/30 p-2 rounded mb-2">
                                                                    <div className="text-red-300 font-medium">Misplaced in bags list!</div>
                                                                    <div className="text-gray-300 text-sm mt-1">
                                                                            Your stake puts you in bag {bagListInfo.correctBag}, but you`&apos;`re currently in bag {bagListInfo.currentBag}.
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        className="mt-2 bg-red-900/20 border-red-500/30 text-red-300 hover:bg-red-900/40 hover:text-red-200"
                                                                        onClick={handleRebag}
                                                                        disabled={isProcessing || !activeSigner}
                                                                    >
                                                                        Fix Bag Position
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className="text-green-400">Correctly placed in bag {bagListInfo.currentBag} ✓</div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Staking Management Buttons */}
                                                    <div className="flex gap-2 mt-3 pt-3 border-t border-purple-900/40">
                                                        <Button
                                                            variant="outline"
                                                            className="border-green-500/30 text-green-400 hover:bg-green-900/20"
                                                            onClick={() => setShowBondDialog(true)}
                                                            disabled={isProcessing || !activeSigner}
                                                        >
                                                            <WalletIcon className="w-4 h-4 mr-2" />
                                                            Bond More
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                                                            onClick={() => setShowUnbondDialog(true)}
                                                            disabled={isProcessing || !activeSigner}
                                                        >
                                                            <ArrowUpDown className="w-4 h-4 mr-2" />
                                                            Unbond
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-black/40 p-3 rounded border border-purple-900/40 text-yellow-200">
                                                    This account is not currently nominating any validators.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Minimum Stake Section */}
                <div className="mb-6">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('minStake')}
                    >
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-green-400" />
                            <h3 className="text-green-400 text-lg">Minimum Stake</h3>
                        </div>
                        {showMinStakeSection ?
                            <ChevronUp className="w-5 h-5 text-green-400" /> :
                            <ChevronDown className="w-5 h-5 text-green-400" />
                        }
                    </div>

                    {showMinStakeSection && (
                        <div className="mt-3 border-t border-green-900/40 pt-3">
                            <div className="bg-black/40 p-4 rounded border border-purple-900/40">
                                <div className="text-purple-300 mb-2">Current Minimum Stake Required:</div>
                                {minStake ? (
                                    <div className="text-xl font-bold text-white">{formatDOT(minStake)}</div>
                                ) : (
                                    <Loader2 className="animate-spin w-5 h-5 text-purple-300" />
                                )}
                                <div className="mt-2 text-sm text-gray-400">
                                    You need at least this amount to participate in nomination.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Validators Section */}
                <div>
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('validators')}
                    >
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-green-400" />
                            <h3 className="text-green-400 text-lg">Validator Performance</h3>
                        </div>
                        {showValidatorsSection ?
                            <ChevronUp className="w-5 h-5 text-green-400" /> :
                            <ChevronDown className="w-5 h-5 text-green-400" />
                        }
                    </div>

                    {showValidatorsSection && (
                        <div className="mt-3 border-t border-green-900/40 pt-3">
                            {/* Era selector */}
                            <div className="mb-4 flex items-center gap-2">
                                <div className="text-green-400 mr-2">Era:</div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "h-8 text-xs border-green-500/30 hover:bg-green-900/20",
                                            selectedEra === activeEra ? "bg-green-900/30 text-green-400" : "text-gray-400"
                                        )}
                                        onClick={() => handleEraChange(activeEra || 0)}
                                    >
                                        Current
                                    </Button>

                                    {historicalEras.map(era => (
                                        <Button
                                            key={era}
                                            variant="outline"
                                            className={cn(
                                                "h-8 text-xs border-purple-500/30 hover:bg-purple-900/20",
                                                selectedEra === era ? "bg-purple-900/30 text-purple-300" : "text-gray-400"
                                            )}
                                            onClick={() => handleEraChange(era)}
                                        >
                                            Era {era}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Validators table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="text-left text-green-400 border-b border-green-900/40">
                                            {selectedAccount && (
                                                <th className="p-2 text-center">Select</th>
                                            )}
                                            <th className="p-2">Validator</th>
                                            <th
                                                className="p-2 cursor-pointer"
                                                onClick={() => setSortField('commission')}
                                            >
                                                Commission
                                                {sortField === 'commission' && (
                                                    sortDirection === 'asc' ? ' ↑' : ' ↓'
                                                )}
                                            </th>
                                            <th
                                                className="p-2 cursor-pointer"
                                                onClick={() => setSortField('reward')}
                                            >
                                                Reward
                                                {sortField === 'reward' && (
                                                    sortDirection === 'asc' ? ' ↑' : ' ↓'
                                                )}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={selectedAccount ? 4 : 3} className="p-4 text-center text-gray-400">
                                                    <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                                                    <div className="mt-2">Loading validators...</div>
                                                </td>
                                            </tr>
                                        ) : sortedValidators.length === 0 ? (
                                            <tr>
                                                <td colSpan={selectedAccount ? 4 : 3} className="p-4 text-center text-gray-400">
                                                    No validators found for this era
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedValidators.map((validator, index) => (
                                                <tr
                                                    key={validator.address}
                                                    className={cn(
                                                        "border-b border-gray-800 hover:bg-black/40",
                                                        index % 2 === 0 ? "bg-black/20" : ""
                                                    )}
                                                >
                                                    {selectedAccount && (
                                                        <td className="p-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 accent-purple-500"
                                                                checked={selectedValidators.some(v => v.address === validator.address)}
                                                                onChange={() => toggleValidatorSelection(validator)}
                                                                disabled={
                                                                    !selectedValidators.some(v => v.address === validator.address) &&
                                                                    selectedValidators.length >= 16
                                                                }
                                                            />
                                                        </td>
                                                    )}
                                                    <td className="p-2">
                                                        <div className="font-medium text-white">{validator.displayName}</div>
                                                        <div className="text-gray-400 text-xs">{trimAddress(validator.address, 6)}</div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="text-gray-300">{validator.commission}%</div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="text-gray-300">{validator.reward.toLocaleString()}</div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Nomination Controls */}
                            {selectedAccount && selectedValidators.length > 0 && (
                                <div className="mt-4 p-3 border border-purple-500/30 rounded bg-black/40">
                                    <div className="flex justify-between items-center">
                                        <div className="text-purple-300">
                                            Selected validators: {selectedValidators.length}/16
                                        </div>
                                        <Button
                                            className="bg-purple-700 hover:bg-purple-600 text-white"
                                            onClick={submitNominations}
                                            disabled={isProcessing || !activeSigner || selectedValidators.length === 0}
                                        >
                                            Submit Nominations
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bond Dialog */}
            <Dialog open={showBondDialog} onOpenChange={setShowBondDialog}>
                <DialogContent className="bg-black/80 border border-purple-900/40">
                    <DialogHeader>
                        <DialogTitle className="text-purple-300">Bond Additional Tokens</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="text-gray-300 mb-2">
                            Enter the amount of DOT you would like to bond:
                        </div>
                        <Input
                            type="number"
                            value={bondAmount}
                            onChange={(e) => setBondAmount(e.target.value)}
                            placeholder="e.g., 10"
                            className="bg-black/50 border-purple-500/30 text-white"
                        />
                        <div className="text-gray-400 text-sm mt-2">
                            Bonded tokens are locked and used for staking. You`&apos;`ll need to unbond them if you want to transfer or sell.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowBondDialog(false)}
                            className="border-gray-500/30 text-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBondMore}
                            disabled={!bondAmount || isProcessing}
                            className="bg-purple-700 hover:bg-purple-600 text-white"
                        >
                            Bond Tokens
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Unbond Dialog */}
            <Dialog open={showUnbondDialog} onOpenChange={setShowUnbondDialog}>
                <DialogContent className="bg-black/80 border border-purple-900/40">
                    <DialogHeader>
                        <DialogTitle className="text-red-300">Unbond Tokens</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="text-gray-300 mb-2">
                            Enter the amount of DOT you would like to unbond:
                        </div>
                        <Input
                            type="number"
                            value={unbondAmount}
                            onChange={(e) => setUnbondAmount(e.target.value)}
                            placeholder="e.g., 5"
                            className="bg-black/50 border-red-500/30 text-white"
                        />
                        <div className="text-yellow-300 text-sm mt-2">
                            Note: Unbonded tokens have a 28-day waiting period before they can be withdrawn.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowUnbondDialog(false)}
                            className="border-gray-500/30 text-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUnbond}
                            disabled={!unbondAmount || isProcessing}
                            className="bg-red-700 hover:bg-red-600 text-white"
                        >
                            Unbond Tokens
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ValidatorRewardAnalyzer