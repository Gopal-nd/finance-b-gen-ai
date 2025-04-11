// components/VoiceChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Ban, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert';
import { marked } from 'marked';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

const VoiceChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [model, setModel] = useState('gemini');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setError(null);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info(
             "Recording started",);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access your microphone. Please check permissions.');
      toast("error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      toast("Recording stopped")

    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);
      
      // Use the selected AI model endpoint
      const response = await fetch(`/api/${model}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || `Server responded with ${response.status}`);
      }
      
      // Create a URL for the audio to allow playback
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Add the transcribed user message and AI response to chat
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: data.transcript, audioUrl },
        { role: 'assistant', content: data.response }
      ]);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast("errror in processing"); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/${model}/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: language,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || `Server responded with ${response.status}`);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
  toast.error("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[90vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI Voice Chat</span>
          <div className="flex space-x-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Spanish</SelectItem>
                <SelectItem value="hi-IN">Hindi</SelectItem>
                <SelectItem value="bn-IN">Bengali</SelectItem>
                <SelectItem value="ta-IN">Tamil</SelectItem>
                <SelectItem value="te-IN">Telugu</SelectItem>
                <SelectItem value="ml-IN">Malayalam</SelectItem>
                <SelectItem value="kn-IN">Kannada</SelectItem>
                <SelectItem value="mr-IN">Marathi</SelectItem>
                <SelectItem value="gu-IN">Gujarati</SelectItem>
                <SelectItem value="pa-IN">Punjabi</SelectItem>
                <SelectItem value="or-IN">Odia</SelectItem>
                <SelectItem value="as-IN">Assamese</SelectItem>
                <SelectItem value="ur-IN">Urdu</SelectItem>
              </SelectContent>
            </Select>
            
 
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto pb-4" ref={chatContainerRef}>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 my-8">
              Start a conversation by recording your voice or typing a message.
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                  <div className={`mx-2 py-3 px-4 rounded-2xl ${message?.role === 'assistant' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                                }`}>
                                 <div
                                className="mt-1"
                                dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                                />
                            </div>
                {message.audioUrl && (
                  <div className="mt-2">
                    <audio src={message.audioUrl} controls className="w-full h-8" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-2">
      <div className="flex w-full items-end space-x-2 justify-center">
    <Button
      className="w-24 h-24 rounded-full text-xl"
      size="icon"
      variant={isRecording ? "destructive" : "default"}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
    >
      {isRecording ? (
        <Ban size={24} />
      ) : (
        <Mic size={36} />
      )}
    </Button>
  </div>
      </CardFooter>
    </Card>
  );
};

export default VoiceChat;