import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../../../../lib/prisma";

// Define TypeScript interfaces for better type safety
interface Todo {
    title: string;
    userId: string;
}

interface GeminiResponse {
    todos: Todo[];
}

interface ProgressResponse {
    status: string;
    message: string;
    progress?: number;
    data?: Todo[];
}

export async function POST(request: NextRequest) {
    // Initialize response encoder for streaming
    const encoder = new TextEncoder();
    
    // Set up response headers for streaming
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    // Create a transform stream for handling the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Helper function to send progress updates
    const sendProgress = async (data: ProgressResponse) => {
        await writer.write(
            encoder.encode(JSON.stringify(data) + '\n')
        );
    };

    // Process the request in an async context
    (async () => {
        try {
            // Authentication check
            const { userId } = await auth();
            if (!userId) {
                await sendProgress({
                    status: 'error',
                    message: 'Unauthorized access'
                });
                return;
            }

            // API key validation
            const GEMINI_KEY = process.env.GEMINI_KEY;
            if (!GEMINI_KEY) {
                await sendProgress({
                    status: 'error',
                    message: 'Missing API configuration'
                });
                return;
            }

            // Extract prompt from request
            const { prompt } = await request.json();
            if (!prompt) {
                await sendProgress({
                    status: 'error',
                    message: 'Prompt is required'
                });
                return;
            }

            // Initialize Gemini AI
            await sendProgress({
                status: 'processing',
                message: 'Initializing AI model...'
            });

            const genAI = new GoogleGenerativeAI(GEMINI_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                },
            });

            // Define the schema for structured output
            const schema = {
                type: "object",
                properties: {
                    todos: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                userId: { type: "string" },
                            },
                            required: ["title", "userId"],
                        },
                    },
                },
                required: ["todos"],
            };

            // Generate todos using Gemini
            await sendProgress({
                status: 'processing',
                message: 'Generating todos...'
            });

            const result = await model.generateContent([
                {
                    text: `Generate a JSON response with todos based on this prompt: "${prompt}".
                           Each todo should have a title and userId: "${userId}".
                           Keep todos short and actionable.
                           Format the response as valid JSON matching this schema: ${JSON.stringify(schema)}
                           Example format: {"todos": [{"title": "Pack toothbrush", "userId": "${userId}"}]}`
                }
            ]);

            // Parse and validate the Gemini response
            let generatedTodos: GeminiResponse;
            try {
                const responseText = result.response.text();
                // Find the JSON object in the response
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('No valid JSON found in response');
                }
                generatedTodos = JSON.parse(jsonMatch[0]);

                // Validate the response structure
                if (!generatedTodos.todos || !Array.isArray(generatedTodos.todos)) {
                    throw new Error('Invalid response structure');
                }
            } catch (error) {
                await sendProgress({
                    status: 'error',
                    message: 'Failed to parse AI response'
                });
                return;
            }

            // Save todos to database in chunks
            await sendProgress({
                status: 'processing',
                message: 'Saving todos to database...'
            });

            const chunkSize = 5;
            const todos = generatedTodos.todos;

            for (let i = 0; i < todos.length; i += chunkSize) {
                const chunk = todos.slice(i, i + chunkSize);
                await prisma.todos.createMany({
                    data: chunk,
                });

                // Send progress update
                await sendProgress({
                    status: 'processing',
                    message: 'Saving todos...',
                    progress: Math.round(((i + chunk.length) / todos.length) * 100)
                });
            }

            // Send final success response
            await sendProgress({
                status: 'completed',
                message: 'Successfully generated and saved todos',
                data: todos
            });

        } catch (error) {
            // Handle any unexpected errors
            await sendProgress({
                status: 'error',
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        } finally {
            // Always close the writer
            await writer.close();
        }
    })().catch(console.error);

    // Return the stream response
    return new Response(stream.readable, { headers });
}
