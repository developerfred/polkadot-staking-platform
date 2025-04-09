import { TypedApi } from 'polkadot-api';
import { useStakingStore } from '@/store/useStakingStore';
import { toast } from 'sonner';
import { useChain } from '@/providers/chain-provider';

export class StakingAPI {
    private api: TypedApi<any>;

    constructor(api: TypedApi<any>) {
        this.api = api;
    }

    async initialize(accountAddress?: string) {
        const store = useStakingStore.getState();

        try {
            await store.fetchInitialData(this.api);

            if (accountAddress) {
                await this.loadAccountData(accountAddress);
            }

            return true;
        } catch (error) {
            console.error("Failed to initialize staking API:", error);
            toast.error("Failed to connect to the Polkadot network");
            return false;
        }
    }


    async loadAccountData(address: string) {
        const store = useStakingStore.getState();

        try {
            await Promise.all([
                store.checkNominatorStatus(this.api, address),
                store.checkCanNominate(this.api, address),
                store.checkBagListPosition(this.api, address)
            ]);

            return true;
        } catch (error) {
            console.error("Failed to load account data:", error);
            toast.error("Failed to load account staking information");
            return false;
        }
    }


    async loadValidatorsForEra(era: number) {
        const store = useStakingStore.getState();
        return store.handleEraChange(this.api, era);
    }


    async nominate(signer: any) {
        const store = useStakingStore.getState();
        return store.submitNominations(this.api, signer);
    }


    async bondMore(signer: any, amount: bigint) {
        const store = useStakingStore.getState();
        return store.bondMoreTokens(this.api, signer, amount);
    }


    async unbond(signer: any, amount: bigint) {
        const store = useStakingStore.getState();
        return store.unbondTokens(this.api, signer, amount);
    }

  
    async rebag(signer: any) {
        const store = useStakingStore.getState();
        return store.rebagNominator(this.api, signer);
    }

 
    async checkBagPosition(address: string) {
        const store = useStakingStore.getState();
        return store.checkBagListPosition(this.api, address);
    }


    convertDOTtoPlanck(dot: number): bigint {
        return BigInt(Math.floor(dot * 10000000000));
    }

   
    convertPlanckToDOT(planck: bigint): number {
        return Number(planck) / 10000000000;
    }

    formatDOT(planck: bigint | null): string {
        if (!planck) return '0 DOT';
        const dots = Number(planck) / 10000000000;
        return `${dots.toFixed(4)} DOT`;
    }
}

export function useStakingAPI() {
    const { api } = useChain();

    const getAPI = () => {
        if (!api) {
            throw new Error("Chain API not available");
        }
        return new StakingAPI(api);
    };

    return {
        getAPI
    };
}