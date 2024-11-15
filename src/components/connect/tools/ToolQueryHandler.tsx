import React from 'react';
import { useChatContext } from '../../../contexts/ChatContext';
import { ToolQuery, ToolResponse } from '../../../types/tools';

export default function ToolQueryHandler() {
  const { subscribeToMessages, sendMessage } = useChatContext();

  React.useEffect(() => {
    const unsubscribe = subscribeToMessages(async (message) => {
      if (message.type === 'tool-query') {
        const query = message.data as ToolQuery;
        
        try {
          let response: ToolResponse;

          switch (query.action) {
            case 'getStatus':
              response = {
                toolId: query.toolId,
                success: true,
                data: {
                  status: 'active',
                  lastChecked: new Date().toISOString()
                }
              };
              break;

            case 'executeCommand':
              response = {
                toolId: query.toolId,
                success: true,
                data: {
                  result: 'Command executed successfully',
                  timestamp: new Date().toISOString()
                }
              };
              break;

            case 'fetchData':
              response = {
                toolId: query.toolId,
                success: true,
                data: {
                  items: [],
                  count: 0
                }
              };
              break;

            default:
              throw new Error(`Unknown action: ${query.action}`);
          }

          sendMessage({
            type: 'tool-response',
            data: response
          });
        } catch (error: any) {
          sendMessage({
            type: 'tool-response',
            data: {
              toolId: query.toolId,
              success: false,
              error: error.message
            }
          });
        }
      }
    });

    return () => unsubscribe();
  }, [subscribeToMessages, sendMessage]);

  return null;
}