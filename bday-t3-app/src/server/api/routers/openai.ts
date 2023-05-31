import { env } from "~/env.mjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Function to generate a response from the ChatGPT model
async function generateResponse(prompt: string) {
    try {
        // Generate a completion using the prompt
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            temperature: 0.7,
            // n: 1,
            // stop: '\n'
        });

        // Extract the generated answer from the API response
        const answer = response.data.choices[0]?.text?.trim();

        return answer;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, something went wrong.';
    }
}

export const openaiRouter = createTRPCRouter({
    prompt: publicProcedure
        .input(z.object({ prompt: z.string() }))
        .query(async ({ input }) => {
            const response = await generateResponse(input.prompt);
            return {
                response: response
            };
        }),
});

