
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Ban, Loader2, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { marked } from 'marked';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [language, setLanguage] = useState('en-US');
  const [model, setModel] = useState('gemini');
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices for the selected language
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      
      setAvailableVoices(voices);
      
      // Find voice that matches the selected language
      const langPrefix = language.split('-')[0].toLowerCase();
      const matchingVoices = voices.filter(voice => 
        voice.lang.toLowerCase().startsWith(langPrefix)
      );
      
      if (matchingVoices.length > 0) {
        setSelectedVoice(matchingVoices[0].name);
      } else {
        // Fall back to any available voice if no specific match
        setSelectedVoice(voices[0].name);
      }
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup speech synthesis when component unmounts
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  // Auto-scroll chat to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-speak assistant message when it appears (if enabled)
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && autoSpeak) {
      speakText(lastMessage.content, messages.length - 1);
    }
  }, [messages, autoSpeak]);

  // Clean speaking text by removing markdown and HTML
  const cleanTextForSpeaking = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
      .replace(/#{1,6}\s(.*)/g, '$1')  // Remove headers
      .replace(/<[^>]*>/g, '')         // Remove HTML tags
      .replace(/```[\s\S]*?```/g, '')  // Remove code blocks
      .replace(/`([^`]+)`/g, '$1');    // Remove inline code
  };

  // Speak text with selected voice and language
  const speakText = useCallback((text: string, messageIndex?: number) => {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentlyPlayingIndex(null);
      
      // If trying to play the same message that was just stopped, return
      if (messageIndex !== undefined && messageIndex === currentlyPlayingIndex) {
        return;
      }
    }
    
    const cleanText = cleanTextForSpeaking(text);
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set voice if one is selected
    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    // Set language
    utterance.lang = language;
    utterance.rate = 1;
    
    // Set speaking state
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (messageIndex !== undefined) {
        setCurrentlyPlayingIndex(messageIndex);
      }
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentlyPlayingIndex(null);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setCurrentlyPlayingIndex(null);
      toast.error("Speech synthesis Interpreted");
    };
    
    // Store reference for potential cancellation
    speechSynthesisRef.current = utterance;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [language, selectedVoice, availableVoices, currentlyPlayingIndex]);

  // Toggle speech for a specific message
  const toggleSpeech = (message: ChatMessage, index: number) => {
    if (isSpeaking && currentlyPlayingIndex === index) {
      // Stop speaking this message
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentlyPlayingIndex(null);
      }
    } else {
      // Start speaking this message
      speakText(message.content, index);
    }
  };

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
      toast.info("Recording started");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access your microphone. Please check permissions.');
      toast.error("Microphone access error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      toast.info("Recording stopped");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);

      const response = await fetch(`/api/${model}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || `Server responded with ${response.status}`);
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      setMessages(prev => [
        ...prev,
        { role: 'user', content: data.transcript, audioUrl },
        { role: 'assistant', content: data.response }
      ]);

    } catch (error) {
      console.error('Error processing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error("Error in processing");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[90vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>AI Voice Chat</span>
          <div className="flex space-x-4 items-center">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-speak" 
                checked={autoSpeak} 
                onCheckedChange={setAutoSpeak} 
              />
              <Label htmlFor="auto-speak">Auto-speak</Label>
            </div>
            
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
            
            {availableVoices.length > 0 && (
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {availableVoices
                    .filter(voice => voice.lang.startsWith(language.split('-')[0]))
                    .map(voice => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name.length > 20 
                          ? `${voice.name.substring(0, 18)}...` 
                          : voice.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
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
              Start a conversation by recording your voice.
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <div className="flex justify-between items-start">
                  <div
                    className="mt-1 flex-grow"
                    dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                  />
                  {message.role === 'assistant' && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="ml-2 flex-shrink-0" 
                      onClick={() => toggleSpeech(message, index)}
                    >
                      {isSpeaking && currentlyPlayingIndex === index ? 
                        <VolumeX className="h-4 w-4" /> : 
                        <Volume2 className="h-4 w-4" />
                      }
                    </Button>
                  )}
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
            {isRecording ? <Ban size={24} /> : <Mic size={36} />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VoiceChat;