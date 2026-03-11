'use client';

import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { io, type Socket } from "socket.io-client"
import { translationKeys } from "@/lib/query-client"
import { useAccessToken, getAccessToken } from "@/features/auth/store"
import type { TranslationJobResponse } from "../types"

type SocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

interface JobStatusSocketEvent {
  jobId: string;
  status: TranslationJobResponse['status'];
  error?: string;
  resultFileId?: string;
  outputFileName?: string;
  finishedAt?: string;
  job: TranslationJobResponse;
}

interface UseTranslationJobSocketResult {
  connectionState: SocketConnectionState;
  socketError: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useTranslationJobSocket(
  jobId: string | null,
  options: { enabled?: boolean } = {},
): UseTranslationJobSocketResult {
  const { enabled = true } = options;
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] =
    useState<SocketConnectionState>('idle');
  const [socketError, setSocketError] = useState<string | null>(null);

  const accessToken = useAccessToken();
  const activeToken = enabled && jobId ? accessToken : null;

  useEffect(() => {
    if (!enabled || !jobId || !activeToken) {
      return;
    }

    const socket: Socket = io(API_BASE_URL, {
      path: '/ws',
      transports: ['websocket'],
      autoConnect: true,
      // Use a callback so every reconnect attempt fetches the latest token
      // from the Zustand store instead of reusing the stale closure value
      auth: (cb: (data: { token: string | null }) => void) => {
        cb({ token: getAccessToken() })
      },
    })

    const handleConnect = () => {
      setConnectionState('connected');
      setSocketError(null);
      socket.emit('translation:watch', { jobId });
      void queryClient.invalidateQueries({
        queryKey: translationKeys.detail(jobId),
      });
    };

    const handleDisconnect = () => {
      setConnectionState('disconnected');
    };

    const handleConnectError = (error: Error) => {
      setConnectionState('error');
      setSocketError(error.message || 'Socket connection failed');
    };

    const handleJobStatus = (event: JobStatusSocketEvent) => {
      if (event.jobId !== jobId) {
        return;
      }

      queryClient.setQueryData(translationKeys.detail(jobId), event.job);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('job:status', handleJobStatus);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('job:status', handleJobStatus);
      socket.disconnect();
    };
  }, [activeToken, enabled, jobId, queryClient]);

  if (!enabled || !jobId) {
    return { connectionState: 'idle', socketError: null };
  }

  if (!activeToken) {
    return {
      connectionState: 'error',
      socketError: 'Missing access token for live translation updates',
    };
  }

  return {
    connectionState:
      connectionState === 'idle' ? 'connecting' : connectionState,
    socketError,
  };
}
