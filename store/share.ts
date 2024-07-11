import { create } from 'zustand';
import { Replicache } from 'replicache';
import { useEffect } from 'react';
import { M } from '@/mutators';
import { Share, sharesByList } from '@/entities';

type ShareState = {
  shares: Share[];
  loading: boolean;
  error: boolean;
  initialiseReplicacheSubscription: (replicache: Replicache<M>, listID: string) => () => void;
};

export const useShareStore = create<ShareState>((set) => ({
  shares: [],
  loading: false,
  error: false,
  initialiseReplicacheSubscription: (replicache: Replicache<M>, listID) => {
    const unsubscribe = replicache.subscribe(
      async (tx) => {
        try {
          return await sharesByList(tx, listID);
        } catch (err) {
          console.error('Error in Replicache transaction:', err);
          return [];
        }
      },
      {
        onData: (shares) => {
          set({ shares });
        },
        onError: (error) => {
          console.error('Error in Replicache subscription:', error);
          set({ error: true });
        },
      }
    );
    return () => {
      unsubscribe();
    };
  },
}));

export const useShares = (rep: Replicache<M> | null, listID: string) => {
  const { shares, initialiseReplicacheSubscription } = useShareStore();

  useEffect(() => {
    if (rep) {
      const unsubscribe = initialiseReplicacheSubscription(rep as Replicache<M>, listID);
      return () => {
        unsubscribe();
      };
    }
  }, [rep, listID]);

  const createShare = async (share: Share) => {
    try {
      await rep?.mutate.createShare(share);
    } catch (error) {
      console.error('Error creating share:', error);
    }
  };

  const deleteShare = async (shareId: string) => {
    try {
      await rep?.mutate.deleteShare(shareId);
    } catch (error) {
      console.error('Error deleting share:', error);
    }
  };

  return { shares, shareAdaptors: { createShare, deleteShare } };
};