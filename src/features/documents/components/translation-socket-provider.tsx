'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, type Socket } from 'socket.io-client';
import { translationKeys, walletKeys } from '@/lib/query-client';
import { getAccessToken, useAccessToken } from '@/features/auth/store';
import { useTranslationStore, setActiveJobId } from '../store/translation.store';
import type { TranslationJobResponse } from '../types';

interface JobStatusSocketEvent {
  jobId: string;
  status: TranslationJobResponse['status'];
  error?: string;
  resultFileId?: string;
  outputFileName?: string;
  finishedAt?: string;
  job: TranslationJobResponse;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Persistent socket provider that lives in the dashboard layout.
 *
 * Unlike the old per-component hook, this component maintains a socket
 * connection for as long as there is an active translation job, regardless
 * of which page the user is currently on. When the user navigates away from
 * the documents page, the connection stays open and continues to receive
 * job:status events from the backend.
 *
 * Renders nothing — purely a side-effect component.
 */
export function TranslationSocketProvider() {
  const queryClient = useQueryClient();
  const accessToken = useAccessToken();
  const activeJobId = useTranslationStore((s) => s.activeJobId);

  // Only connect when there is an active job and a valid token
  const shouldConnect = !!activeJobId && !!accessToken;

  useEffect(() => {
    if (!shouldConnect || !activeJobId) {
      return;
    }

    const socket: Socket = io(API_BASE_URL, {
      path: '/ws',
      transports: ['websocket'],
      autoConnect: true,
      auth: (cb: (data: { token: string | null }) => void) => {
        cb({ token: getAccessToken() });
      },
    });

    const handleConnect = () => {
      socket.emit('translation:watch', { jobId: activeJobId });
      void queryClient.invalidateQueries({
        queryKey: translationKeys.detail(activeJobId),
      });
    };

    const handleJobStatus = (event: JobStatusSocketEvent) => {
      if (event.jobId !== activeJobId) {
        return;
      }

      queryClient.setQueryData(translationKeys.detail(activeJobId), event.job);

      // Clear the active job from the store once it reaches a terminal state
      if (event.status === 'succeeded' || event.status === 'failed') {
        setActiveJobId(null);

        // Refresh history and wallet after job completes
        void queryClient.invalidateQueries({ queryKey: translationKeys.all });
        void queryClient.invalidateQueries({ queryKey: walletKeys.all });
      }
    };

    socket.on('connect', handleConnect);
    socket.on('job:status', handleJobStatus);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('job:status', handleJobStatus);
      socket.disconnect();
    };
  }, [activeJobId, shouldConnect, queryClient]);

  return null;
}
