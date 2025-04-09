import { create } from 'zustand';
import { toast } from 'sonner';
import { TypedApi } from 'polkadot-api';
import { SS58String } from '@polkadot-api/substrate-bindings';

export interface Validator {
    address: string;
    displayName: string;
    commission: number;
    rewardPoints: number;
    reward: number;
    era: number;
    blocked?: boolean;
    identity?: boolean;
}

export interface NominatorStatus {
    isNominating: boolean;
    bondedAmount?: bigint;
    nominations?: string[];
    isEarningRewards?: boolean;
    error?: boolean;
}

interface BagListInfo {
    currentBag: bigint | null;
    correctBag: bigint | null;
    isMisplaced: boolean | null;
    active?: bigint;
    bagThresholds?: bigint[];
}

interface StakingState {
    validators: Validator[];
    activeEra: number | null;
    historicalEras: number[];
    selectedEra: number | null;
    loading: boolean;
    isLoading?: boolean;
    error?: string | null;
    nominatorStatus: NominatorStatus | null;
    minStake: bigint | null;
    canNominate: boolean | null;
    selectedValidators: Validator[];
    bagListInfo: BagListInfo;
    lastUpdated?: number;
    // Adicionamos cache para melhorar performance
    validatorCache: Record<number, Validator[]>;

    // UI states
    sortField: 'reward' | 'commission' | 'rewardPoints';
    sortDirection: 'asc' | 'desc';
    showNominatorSection: boolean;
    showMinStakeSection: boolean;
    showValidatorsSection: boolean;
    terminalReady: boolean;

    // Action methods
    setTerminalReady: (ready: boolean) => void;
    setLoading: (loading: boolean) => void;
    setSortField: (field: 'reward' | 'commission' | 'rewardPoints') => void;
    setSortDirection: (direction: 'asc' | 'desc') => void;
    toggleSection: (section: 'nominator' | 'minStake' | 'validators') => void;
    toggleValidatorSelection: (validator: Validator) => void;

    // Business logic methods
    fetchInitialData: (api: TypedApi<any>) => Promise<void>;
    fetchValidatorsForEra: (api: TypedApi<any>, era: number) => Promise<Validator[]>;
    checkNominatorStatus: (api: TypedApi<any>, address: string) => Promise<void>;
    checkCanNominate: (api: TypedApi<any>, address: string) => Promise<boolean>;
    fetchMinimumStake: (api: TypedApi<any>) => Promise<void>;
    submitNominations: (api: TypedApi<any>, signer: any) => Promise<void>;
    handleEraChange: (api: TypedApi<any>, era: number) => Promise<void>;
    checkBagListPosition: (api: TypedApi<any>, address: string) => Promise<void>;
    bondMoreTokens: (api: TypedApi<any>, signer: any, amount: bigint) => Promise<void>;
    unbondTokens: (api: TypedApi<any>, signer: any, amount: bigint) => Promise<void>;
    rebagNominator: (api: TypedApi<any>, signer: any) => Promise<void>;
}

const formatShortAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
};

export const useStakingStore = create<StakingState>((set, get) => ({
    validators: [],
    activeEra: null,
    historicalEras: [],
    selectedEra: null,
    loading: false,
    nominatorStatus: null,
    minStake: null,
    canNominate: null,
    selectedValidators: [],
    bagListInfo: {
        currentBag: null,
        correctBag: null,
        isMisplaced: null
    },
    
    validatorCache: {},

    sortField: 'reward',
    sortDirection: 'desc',
    showNominatorSection: true,
    showMinStakeSection: true,
    showValidatorsSection: true,
    terminalReady: false,

    setTerminalReady: (ready) => set({ terminalReady: ready }),
    setLoading: (loading) => set({ loading }),
    setSortField: (field) => set((state) => ({
        sortField: field,
        sortDirection: state.sortField === field ?
            (state.sortDirection === 'asc' ? 'desc' : 'asc') :
            'desc'
    })),
    setSortDirection: (direction) => set({ sortDirection: direction }),
    toggleSection: (section) => set((state) => ({
        showNominatorSection: section === 'nominator' ? !state.showNominatorSection : state.showNominatorSection,
        showMinStakeSection: section === 'minStake' ? !state.showMinStakeSection : state.showMinStakeSection,
        showValidatorsSection: section === 'validators' ? !state.showValidatorsSection : state.showValidatorsSection
    })),
    toggleValidatorSelection: (validator) => set((state) => {
        const isSelected = state.selectedValidators.some(v => v.address === validator.address);

        if (isSelected) {
            return {
                selectedValidators: state.selectedValidators.filter(v => v.address !== validator.address)
            };
        } else {
            if (state.selectedValidators.length >= 16) {
                toast.error('You can select a maximum of 16 validators');
                return { selectedValidators: state.selectedValidators };
            }
            return {
                selectedValidators: [...state.selectedValidators, validator]
            };
        }
    }),

    fetchInitialData: async (api) => {
        try {
            
            set({ error: null });

            
            const [activeEraInfo, minNominatorBond] = await Promise.all([
                (api.query.Staking.ActiveEra as unknown as { getValue: () => Promise<{ index: number }> }).getValue(),
                (api.query.Staking.MinNominatorBond as unknown as { getValue: () => Promise<bigint> }).getValue()
            ]);

            const currentEra = Number(activeEraInfo.index);
            const histEras = Array.from({ length: 7 }, (_, i) => currentEra - i - 1).filter(era => era >= 0);

            
            set({
                activeEra: currentEra,
                historicalEras: histEras,
                selectedEra: currentEra,
                minStake: minNominatorBond
            });

                        
            await get().fetchValidatorsForEra(api, currentEra);
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Failed to load validator data');
            set({ error: String(error) });
        }
    },

    fetchValidatorsForEra: async (api, era) => {
        
        const { validatorCache } = get();
        if (validatorCache[era] && validatorCache[era].length > 0) {
            set({
                validators: validatorCache[era],
                lastUpdated: Date.now()
            });
            return validatorCache[era];
        }

        try {
            set({ loading: true, error: null });


            
            
            const [validatorAddresses, eraRewardPoints] = await Promise.all([
                (api.query.Session.Validators as unknown as { getValue: () => Promise<SS58String[]> }).getValue(),
                (api.query.Staking.ErasRewardPoints as unknown as { getValue: (era: number) => Promise<{ individual: [SS58String, bigint][] }> }).getValue(era),
            ]);

            const individualPoints = eraRewardPoints.individual || [];

            
            const emptyValidators = validatorAddresses.map(address => ({
                address,
                displayName: formatShortAddress(address),
                commission: 0,
                rewardPoints: 0,
                reward: 0,
                era,
                blocked: false,
                identity: false,
                loading: true
            }));

           
            set({ validators: emptyValidators });

            const validatorsWithInfo = await Promise.all(
                validatorAddresses.map(async (address) => {
                    try {
                       
                        const [prefs, identity] = await Promise.all([
                            (api.query.Staking.ErasValidatorPrefs as unknown as { getValue: (era: number, address: string) => Promise<{ commission: bigint; blocked: boolean }> }).getValue(era, address),
                            'Identity' in api.query && 'IdentityOf' in api.query.Identity
                                ? ((api.query.Identity.IdentityOf as unknown as { getValue: (address: string) => Promise<any> }).getValue(address)
                                ) : Promise.resolve(null)
                        ]);

                        const hasIdentity = !!identity;
                        const commission = Number(prefs.commission) / 1_000_000_000;
                        const points = individualPoints.find(([validator]) => validator === address)?.[1] || 0;
                        const rewardPoints = typeof points === 'bigint' ? Number(points) : points;
                        const reward = rewardPoints * (1 - commission / 100);

                        let displayName = formatShortAddress(address);
                        if (hasIdentity && identity?.info?.display?.value) {
                            const displayValue = identity.info.display.value;
                            displayName = typeof displayValue.asText === 'function'
                                ? displayValue.asText()
                                : displayName;
                        }

                        return {
                            address,
                            displayName,
                            commission,
                            rewardPoints,
                            reward,
                            era,
                            blocked: prefs.blocked || false,
                            identity: hasIdentity
                        };
                    } catch (error) {
                        console.error(`Error fetching validator information for ${address}:`, error);
                        return {
                            address,
                            displayName: formatShortAddress(address),
                            commission: 0,
                            rewardPoints: 0,
                            reward: 0,
                            era,
                            blocked: false,
                            identity: false
                        };
                    }
                })
            );

            
            const state = get();
            const sortField = state.sortField;
            const sortDir = state.sortDirection === 'asc' ? 1 : -1;

            const sortedValidators = validatorsWithInfo.sort((a, b) =>
                (a[sortField] - b[sortField]) * sortDir
            );

            
            set({
                validators: sortedValidators,
                loading: false,
                lastUpdated: Date.now(),
                validatorCache: {
                    ...validatorCache,
                    [era]: sortedValidators
                }
            });

            return sortedValidators;
        } catch (error) {
            console.error('Error fetching validators:', error);
            toast.error('Failed to load validator data');
            set({ loading: false, error: String(error) });
            return [];
        }
    },

    checkNominatorStatus: async (api, address) => {
        if (!api || !address) return;

        try {
            set({ loading: true, error: null });

            
            const [stakingLedger, nominations, activeEraInfo, activeValidators] = await Promise.all([
                (api.query.Staking.Ledger as unknown as { getValue: (address: string) => Promise<{ active: bigint }> }).getValue(address),
                (api.query.Staking.Nominators as unknown as { getValue: (address: string) => Promise<{ targets: string[] }> }).getValue(address),
                (api.query.Staking.ActiveEra as unknown as { getValue: () => Promise<{ index: number }> }).getValue(),
                (api.query.Session.Validators as unknown as { getValue: () => Promise<SS58String[]> }).getValue()
            ]);

            if (!stakingLedger) {
                set({
                    nominatorStatus: { isNominating: false },
                    loading: false
                });
                return;
            }

            const targets = nominations ? nominations.targets : [];
            const currentEra = Number(activeEraInfo.index);

            const hasActiveValidator = targets.some(target =>
                activeValidators.some(v => v === target)
            );

            set({
                nominatorStatus: {
                    isNominating: !!nominations,
                    bondedAmount: stakingLedger ? stakingLedger.active : BigInt(0),
                    nominations: targets,
                    isEarningRewards: hasActiveValidator
                },
                loading: false
            });
        } catch (error) {
            console.error('Error checking nominator status:', error);
            set({
                nominatorStatus: { isNominating: false, error: true },
                loading: false,
                error: String(error)
            });
        }
    },

    checkCanNominate: async (api, address) => {
        if (!api || !address) return false;

        try {
            set({ loading: true, error: null });

            
            const [accountInfo, minBond] = await Promise.all([
                (api.query.System.Account as unknown as { getValue: (address: string) => Promise<{ data: { free: bigint } }> }).getValue(address),
                (api.query.Staking.MinNominatorBond as unknown as { getValue: () => Promise<bigint> }).getValue()
            ]);

            const canNom = accountInfo.data.free > minBond;
            set({ canNominate: canNom, loading: false });

            return canNom;
        } catch (error) {
            console.error('Error checking if can nominate:', error);
            set({ canNominate: false, loading: false, error: String(error) });
            return false;
        }
    },

    fetchMinimumStake: async (api) => {
        if (!api) return;

        try {
            set({ loading: true, error: null });

            const minNominatorBond = await (api.query.Staking.MinNominatorBond as unknown as { getValue: () => Promise<bigint> }).getValue();
            set({ minStake: minNominatorBond, loading: false });
        } catch (error) {
            console.error('Error fetching minimum stake:', error);
            set({ loading: false, error: String(error) });
        }
    },

    submitNominations: async (api, signer) => {
        const { selectedValidators } = get();

        if (!api || !signer || selectedValidators.length === 0) {
            toast.error('Missing API, signer, or validators selection');
            return;
        }

        try {
            toast.info('Preparing nomination transaction...');

            const targets = selectedValidators.map(v => v.address);
            const tx = (api.tx.Staking.nominate as unknown as (targets: string[]) => any)(targets);

            await toast.promise(
                tx.signAndSubmit(signer),
                {
                    loading: 'Submitting nomination...',
                    success: 'Nomination successful!',
                    error: 'Nomination failed. Please try again.'
                }
            );

            
            await get().checkNominatorStatus(api, signer.address);

        } catch (error) {
            console.error('Error submitting nominations:', error);
            toast.error('Failed to submit nomination');
        }
    },

    handleEraChange: async (api, era) => {
        
        const { validatorCache } = get();
        if (validatorCache[era] && validatorCache[era].length > 0) {
            
            set({
                selectedEra: era,
                validators: validatorCache[era]
            });
            return;
        }

        
        set({ selectedEra: era });

        
        await get().fetchValidatorsForEra(api, era);
    },

    checkBagListPosition: async (api, address) => {
        if (!api || !address) {
            set({ error: "API or address not available" });
            return;
        }

        try {
            set({ isLoading: true, error: null });

            
            const [bagThresholds, stakingLedger, listNode] = await Promise.all([
                (api.query.VoterList.BagThresholds as unknown as { getValue: () => Promise<bigint[]> }).getValue(),
                (api.query.Staking.Ledger as unknown as { getValue: (address: string) => Promise<{ active: bigint }> }).getValue(address),
                (api.query.VoterList.ListNodes as unknown as { getValue: (address: string) => Promise<{ bagUpper: bigint } | null> }).getValue(address)
            ]);

            if (!stakingLedger) {
                set({
                    bagListInfo: {
                        currentBag: null,
                        correctBag: null,
                        isMisplaced: null,
                        active: BigInt(0),
                        bagThresholds
                    },
                    isLoading: false
                });
                return;
            }

            const active = stakingLedger.active;

            let currentBag = null;
            if (listNode) {
                currentBag = listNode.bagUpper;
            }

            
            let correctBag = null;
            for (let i = 0; i < bagThresholds.length; i++) {
                if (active >= bagThresholds[i]) {
                    correctBag = bagThresholds[i];
                    break;
                }
            }

            if (correctBag === null && bagThresholds.length > 0) {
                correctBag = bagThresholds[bagThresholds.length - 1];
            }

            const isMisplaced = currentBag !== correctBag;

            set({
                bagListInfo: {
                    currentBag,
                    correctBag,
                    isMisplaced,
                    active,
                    bagThresholds
                },
                isLoading: false
            });
        } catch (error) {
            console.error('Error checking bag list position:', error);
            set({
                error: String(error),
                isLoading: false
            });
        }
    },

    bondMoreTokens: async (api, signer, amount) => {
        if (!api || !signer || !amount) {
            toast.error('Missing API, signer, or amount');
            return;
        }

        try {
            toast.info('Preparing bond transaction...');

            const tx = (api.tx.Staking.bondExtra as unknown as (amount: bigint) => any)(amount);

            await toast.promise(
                tx.signAndSubmit(signer),
                {
                    loading: 'Bonding tokens...',
                    success: 'Successfully bonded more tokens!',
                    error: 'Failed to bond tokens. Please try again.'
                }
            );

            
            await Promise.all([
                get().checkNominatorStatus(api, signer.address),
                get().checkBagListPosition(api, signer.address)
            ]);

        } catch (error) {
            console.error('Error bonding tokens:', error);
            toast.error('Failed to bond tokens');
        }
    },

    unbondTokens: async (api, signer, amount) => {
        if (!api || !signer || !amount) {
            toast.error('Missing API, signer, or amount');
            return;
        }

        try {
            toast.info('Preparing unbond transaction...');

            const tx = (api.tx.Staking.unbond as unknown as (amount: bigint) => any)(amount);

            await toast.promise(
                tx.signAndSubmit(signer),
                {
                    loading: 'Unbonding tokens...',
                    success: 'Successfully unbonded tokens! They will be available after the unbonding period (28 days).',
                    error: 'Failed to unbond tokens. Please try again.'
                }
            );

            
            await Promise.all([
                get().checkNominatorStatus(api, signer.address),
                get().checkBagListPosition(api, signer.address)
            ]);

        } catch (error) {
            console.error('Error unbonding tokens:', error);
            toast.error('Failed to unbond tokens');
        }
    },

    rebagNominator: async (api, signer) => {
        if (!api || !signer) {
            toast.error('Missing API or signer');
            return;
        }

        try {
            const { bagListInfo } = get();

            if (!bagListInfo.isMisplaced) {
                toast.info('You are already in the correct bag.');
                return;
            }

            toast.info('Preparing rebag transaction...');

            const tx = (api.tx.VoterList.rebag as unknown as (args: any) => any)(api.tx.Staking.rebag ? {} : {
                dislocated: signer.address
            });

            await toast.promise(
                tx.signAndSubmit(signer),
                {
                    loading: 'Updating bag position...',
                    success: 'Successfully updated bag position!',
                    error: 'Failed to update bag position. Please try again.'
                }
            );

            
            await get().checkBagListPosition(api, signer.address);

        } catch (error) {
            console.error('Error updating bag position:', error);
            toast.error('Failed to update bag position');
        }
    }
}));