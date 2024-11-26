import { useState } from 'react';

interface TodoProgress {
    status: 'idle' | 'processing' | 'completed' | 'error';
    message: string;
    progress?: number;
    data?: any[];
}

export function useGenerateTodos() {
    const [progress, setProgress] = useState<TodoProgress>({
        status: 'idle',
        message: ''
    });

    const generateTodos = async (prompt: string) => {
        setProgress({
            status: 'processing',
            message: 'Starting generation...'
        });

        try {
            const response = await fetch('/api/todos/generate-todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Stream not available');

            // Process the stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Convert chunks to text and parse updates
                const text = new TextDecoder().decode(value);
                const updates = text.split('\n')
                    .filter(Boolean)
                    .map(line => JSON.parse(line));

                // Process each update
                for (const update of updates) {
                    setProgress({
                        status: update.status,
                        message: update.message,
                        progress: update.progress,
                        data: update.data
                    });
                }
            }
        } catch (error) {
            setProgress({
                status: 'error',
                message: error instanceof Error ? error.message : 'Failed to generate todos'
            });
        }
    };

    return { progress, generateTodos };
}