import { useEffect, useState, useCallback, useRef } from 'react';
import type { WebSocketMessage, AgentPersonality, AgentActivity, SwarmMetrics } from '../types';

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [agents, setAgents] = useState<AgentPersonality[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [metrics, setMetrics] = useState<SwarmMetrics>({
    activeTasks: 0,
    completedTasks: 0,
    successRate: 0,
    totalActivities: 0,
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to Agent Swarm');
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'initial_state':
              setAgents(message.data.agents || []);
              setMetrics(message.data.metrics || metrics);
              break;
            case 'activities':
              setActivities(message.data || []);
              break;
            case 'activity':
              setActivities(prev => [message.data, ...prev].slice(0, 50));
              break;
            case 'metrics':
              setMetrics(message.data || metrics);
              break;
          }
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from Agent Swarm');
        setIsConnected(false);
        
        // Try to reconnect every 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    agents,
    activities,
    metrics,
  };
}
