'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  answer?: {
    answer: string;
    explanation: string;
    failureModes: Array<{
      id: string;
      name: string;
      category: string;
      causes: string[];
      symptoms: string[];
      prevention: string[];
      severity: string;
      timeToFailure: string;
    }>;
    compatibilityIssues: Array<{
      materialType: string;
      status: string;
      reason: string;
    }>;
    recommendations: string[];
    warnings: string[];
    confidence: number;
    sources: string[];
  };
  timestamp: Date;
}

const suggestedQuestions = [
  'What happens if water gets behind EPDM?',
  'Can I use PVC over polystyrene insulation?',
  'What is incompatible with TPO?',
  'Minimum application temperature for SBS?',
  'What causes adhesion loss in self-adhered membranes?',
];

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (question?: string) => {
    const q = question || input;
    if (!q.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'I could not find a specific answer.',
        answer: data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your question.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold">Ask Engineering Questions</h1>
        <p className="text-muted-foreground">
          Ask anything about construction materials, compatibility, and failure modes
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground mb-6">
              Ask me anything about construction materials
            </p>
            <div className="grid gap-2 max-w-md mx-auto">
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="text-left justify-start h-auto py-3"
                  onClick={() => handleSubmit(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg p-4',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {/* Structured Answer */}
                {message.answer && (
                  <div className="mt-4 space-y-4">
                    {/* Failure Modes */}
                    {message.answer.failureModes?.length > 0 && (
                      <div className="space-y-2">
                        {message.answer.failureModes.map((fm) => (
                          <Card key={fm.id} className="bg-background/50">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                {fm.name}
                                <Badge
                                  variant={
                                    fm.severity === 'structural' ||
                                    fm.severity === 'catastrophic'
                                      ? 'destructive'
                                      : 'warning'
                                  }
                                >
                                  {fm.severity}
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 text-sm space-y-2">
                              {fm.causes?.length > 0 && (
                                <div>
                                  <strong>Causes:</strong>
                                  <ul className="list-disc list-inside ml-2">
                                    {fm.causes.slice(0, 2).map((c, i) => (
                                      <li key={i}>{c}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {fm.prevention?.length > 0 && (
                                <div>
                                  <strong>Prevention:</strong>
                                  <ul className="list-disc list-inside ml-2">
                                    {fm.prevention.slice(0, 2).map((p, i) => (
                                      <li key={i}>{p}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div>
                                <strong>Time to Failure:</strong> {fm.timeToFailure}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {message.answer.recommendations?.length > 0 && (
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <strong className="text-sm">Recommendations</strong>
                        </div>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {message.answer.recommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Warnings */}
                    {message.answer.warnings?.length > 0 && (
                      <div className="bg-yellow-500/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <strong className="text-sm">Warnings</strong>
                        </div>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {message.answer.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sources */}
                    {message.answer.sources?.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Sources: {message.answer.sources.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-lg p-4">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask an engineering question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
