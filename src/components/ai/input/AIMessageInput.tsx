import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WAKTIAIMode } from '@/types/ai-assistant.types';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';
import { InputToolbar } from './InputToolbar';
import { VoiceInputSection } from './VoiceInputSection';
import { Send, Loader2, RefreshCw, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIMessageInputProps {
  activeMode: WAKTIAIMode;
}

export const AIMessageInput = ({ activeMode }: AIMessageInputProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const { 
    sendMessage, 
    isLoading, 
    isMessageProcessing, 
    getCurrentProcessingMessage,
    retryLastMessage,
    hasFailedMessage
  } = useAIAssistant();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevMessageRef = useRef('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isConnectionChecking, setIsConnectionChecking] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setIsConnectionChecking(true);
    
    try {
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        setSendError(null);
      } else {
        setConnectionStatus('disconnected');
        setSendError("Connection to server unavailable. Check your internet connection.");
      }
    } catch (error) {
      console.warn("Connection check failed:", error);
      setConnectionStatus('disconnected');
      setSendError("Connection to server unavailable. Check your internet connection.");
    } finally {
      setIsConnectionChecking(false);
    }
  };

  useEffect(() => {
    const currentProcessingMessage = getCurrentProcessingMessage();
    if (currentProcessingMessage && inputMessage === '') {
      console.log("Restoring failed message to input:", currentProcessingMessage.substring(0, 20) + "...");
      setInputMessage(currentProcessingMessage);
      setSendError("Your previous message wasn't sent. You can edit and try again.");
    }
  }, [getCurrentProcessingMessage, inputMessage]);

  useEffect(() => {
    if (inputMessage && !isLoading) {
      prevMessageRef.current = inputMessage;
    }
  }, [inputMessage, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading || isMessageProcessing()) return;

    if (connectionStatus === 'disconnected') {
      await checkConnection();
      if (connectionStatus === 'disconnected') {
        setSendError("Cannot send message while offline. Please check your connection.");
        return;
      }
    }

    const messageCopy = inputMessage.trim();
    setSendError(null);
    
    try {
      console.log("Sending message:", messageCopy.substring(0, 20) + "...");
      const result = await sendMessage(messageCopy);
      const { success, error, keepInputText } = result;
      const isConnectionError = 'isConnectionError' in result ? result.isConnectionError : false;

      if (success) {
        console.log("Message sent successfully, clearing input");
        setInputMessage('');
        prevMessageRef.current = '';
        setSendError(null);
        setRetryCount(0);
        setConnectionStatus('connected');
      } else {
        if (isConnectionError) {
          setConnectionStatus('disconnected');
          setSendError("Connection to AI service failed. Please check your internet connection and try again.");
        } else {
          setSendError(error?.message || 'Failed to send message. Try again.');
        }
        
        console.warn('Message failed to send. Input preserved.', error);
        
        if (!keepInputText) {
          setInputMessage('');
        }
        
        setRetryCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError(error.message || 'An unexpected error occurred');
      setConnectionStatus('disconnected');
      setRetryCount(prev => prev + 1);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setSendError(null);
    
    await checkConnection();
    
    if (connectionStatus === 'disconnected') {
      setSendError("Still offline. Please check your connection before retrying.");
      setIsRetrying(false);
      return;
    }
    
    try {
      console.log("Attempting to retry last message");
      const result = await retryLastMessage();
      const { success, keepInputText } = result;
      const isConnectionError = 'isConnectionError' in result ? result.isConnectionError : false;
      
      if (success) {
        console.log("Retry successful, clearing input");
        setInputMessage('');
        prevMessageRef.current = '';
        setRetryCount(0);
        setConnectionStatus('connected');
      } else if (isConnectionError) {
        setConnectionStatus('disconnected');
        setSendError("Connection to AI service failed. Please try again later.");
      } else if (!keepInputText) {
        setInputMessage('');
      }
    } catch (error) {
      console.error('Error retrying message:', error);
      setSendError('Failed to retry message: ' + (error.message || 'Unknown error'));
      setConnectionStatus('disconnected');
    } finally {
      setIsRetrying(false);
    }
  };

  const getModeButtonStyle = () => {
    switch (activeMode) {
      case 'general':
        return 'bg-wakti-blue hover:bg-wakti-blue/90';
      case 'productivity':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'student':
        return 'bg-green-600 hover:bg-green-700';
      case 'creative':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2 text-xs">
      {connectionStatus === 'checking' || isConnectionChecking ? (
        <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
      ) : connectionStatus === 'connected' ? (
        <Wifi className="h-3 w-3 text-green-500" />
      ) : (
        <WifiOff className="h-3 w-3 text-red-500" />
      )}
      <span className={cn(
        connectionStatus === 'connected' ? 'text-green-500' : 
        connectionStatus === 'disconnected' ? 'text-red-500' : 
        'text-amber-500'
      )}>
        {connectionStatus === 'checking' || isConnectionChecking ? 'Checking connection...' : 
         connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
      </span>
      {connectionStatus === 'disconnected' && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkConnection} 
          className="h-5 px-1 text-xs"
          disabled={isConnectionChecking}
        >
          {isConnectionChecking ? 
            <Loader2 className="h-3 w-3 animate-spin mr-1" /> : 
            <RefreshCw className="h-3 w-3 mr-1" />}
          Retry
        </Button>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSendMessage} className="space-y-2">
      {sendError && (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{sendError}</span>
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 h-auto"
              onClick={() => setSendError(null)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="relative">
        <Textarea
          ref={inputRef}
          placeholder={showVoiceInput ? "Listening..." : "Type a message..."}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className={cn(
            "min-h-10 pr-24 resize-none",
            showVoiceInput && "bg-pink-50",
            sendError && "border-red-300 focus-visible:ring-red-500",
            retryCount > 0 && "bg-amber-50/30",
            connectionStatus === 'disconnected' && "border-red-200 bg-red-50/20"
          )}
          disabled={isLoading || showVoiceInput || connectionStatus === 'disconnected'}
        />
        
        <InputToolbar 
          isLoading={isLoading} 
          isListening={showVoiceInput}
          onVoiceToggle={() => setShowVoiceInput(!showVoiceInput)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <ConnectionIndicator />
        
        <div className="flex items-center gap-2">
          {(hasFailedMessage() || retryCount > 0) && (
            <Button 
              type="button" 
              onClick={handleRetry}
              variant="outline"
              className={cn("px-3", isRetrying && "bg-amber-50")}
              disabled={isRetrying || isLoading || connectionStatus === 'disconnected'}
            >
              {isRetrying ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Retry
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={
              !inputMessage.trim() || 
              isLoading || 
              isMessageProcessing() || 
              isRetrying || 
              connectionStatus === 'disconnected'
            } 
            className={cn("px-4", getModeButtonStyle())}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            Send
          </Button>
        </div>
      </div>
    </form>
  );
};
