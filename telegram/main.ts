// src/main.ts
import 'dotenv/config'; // Load .env variables FIRST
import { Telegraf, Context } from 'telegraf';
import axios from 'axios';

// --- Environment Variable Validation ---
const botToken = process.env.BOT_TOKEN;
const aiApiUrl = process.env.AI_API_URL;

if (!botToken) {
    console.error('Error: BOT_TOKEN is not defined in your .env file.');
    process.exit(1); // Exit if token is missing
}

if (!aiApiUrl) {
    console.error('Error: AI_API_URL is not defined in your .env file.');
    process.exit(1); // Exit if API URL is missing
}

// --- Bot Initialization ---
const bot = new Telegraf(botToken);

// --- Middleware for Logging ---
bot.use(async (ctx, next) => {
    const start = Date.now();
    await next(); // Continues to the next middleware or handler
    const ms = Date.now() - start;
    const userName = ctx.from?.username || ctx.from?.id || 'unknown_user';
    console.log(`Response time for ${userName}: ${ms}ms`);
});

// --- Command Handlers ---
bot.start((ctx) => {
    console.log(`Received /start command from ${ctx.from.username || ctx.from.id}`);
    ctx.reply('Welcome! Send me a text prompt, and I will forward it to the AI.');
});

bot.help((ctx) => {
    console.log(`Received /help command from ${ctx.from.username || ctx.from.id}`);
    ctx.reply('Just send me any text message. I will process it using an AI model.');
});

// --- Text Message Handler ---
bot.on('text', async (ctx: Context) => {
    // Narrow down the type for text messages if needed, but Context often works
    // Ensure message and text exist (TypeScript might require this)
    if (!ctx.message || !('text' in ctx.message)) {
        console.log('Received non-text message or message without text field.');
        return ctx.reply('Please send only text messages.');
    }

    const userPrompt = ctx.message.text;
    const userId = ctx.from?.id;
    const userName = ctx.from?.username || userId;

    console.log(`Received prompt from ${userName}: "${userPrompt}"`);

    // 1. Acknowledge receipt (optional but good practice)
    try {
        await ctx.reply('🧠 Processing your request, please wait...');
        // Optionally send 'typing...' action
        await ctx.sendChatAction('typing');
    } catch (replyError) {
        console.error(`Error sending acknowledgment to ${userName}:`, replyError);
        // Continue processing even if acknowledgment fails
    }


    // 2. Call the AI API
    try {
        console.log(`Sending prompt to AI API: ${aiApiUrl}`);

        // --- IMPORTANT: Adjust the request structure based on YOUR AI API ---
        // This example assumes your API expects a POST request with a JSON body
        // like: { "prompt": "user's text" }
        // And returns a JSON response like: { "answer": "ai's response" }
        const apiResponse = await axios.post(
            aiApiUrl,
            {
                prompt: userPrompt, // The data sent TO the API
                // You might need to add other fields or headers depending on your API
                // headers: { 'Authorization': 'Bearer YOUR_API_KEY' } // Example header
            },
            {
                timeout: 60000, // Optional: Set a timeout (e.g., 60 seconds)
            }
        );

        // --- IMPORTANT: Adjust how you extract the response based on YOUR AI API ---
        const aiResult = apiResponse.data?.answer; // Adjust 'answer' based on the actual response key

        if (apiResponse.status === 200 && aiResult) {
            console.log(`Received AI response for ${userName}: "${aiResult}"`);
            // 3. Send the AI's response back to the user
            await ctx.reply(aiResult);
        } else {
            console.error(`AI API responded with status ${apiResponse.status} or missing 'answer'. Response data:`, apiResponse.data);
            await ctx.reply("Sorry, I received an unexpected response from the AI service.");
        }

    } catch (error: any) {
        console.error(`Error calling AI API for ${userName}:`, error);

        let errorMessage = "Sorry, I couldn't connect to the AI service or process your request.";
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('API Error Response Status:', error.response.status);
                console.error('API Error Response Data:', error.response.data);
                errorMessage = `Sorry, the AI service returned an error (Status: ${error.response.status}). Please try again later.`;
            } else if (error.request) {
                // The request was made but no response was received
                console.error('API No Response Error:', error.request);
                errorMessage = "Sorry, I couldn't get a response from the AI service. It might be down or unreachable.";
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('API Request Setup Error:', error.message);
            }
        } else {
            // Non-Axios error
             console.error('Non-API Error:', error.message);
        }
        // 4. Send an error message to the user
        try {
            await ctx.reply(errorMessage);
        } catch (replyError) {
            console.error(`Error sending error message to ${userName}:`, replyError);
        }
    }
});

// --- Error Handler (for Telegraf errors) ---
bot.catch((err, ctx) => {
    console.error(`Telegraf error for ${ctx.updateType}`, err);
    // Optionally inform the user generically, but avoid detailed error exposure
    // try {
    //   ctx.reply('Sorry, an internal error occurred.');
    // } catch (e) {
    //   console.error('Failed to send error message to user:', e);
    // }
});


// --- Start the Bot ---
bot.launch().then(() => {
    console.log(`Bot started successfully! Username: @${bot.botInfo?.username}`);
}).catch(err => {
    console.error('Failed to launch bot:', err);
});


// --- Enable graceful stop ---
// These signals are sent when you stop the process (e.g., Ctrl+C)
process.once('SIGINT', () => {
    console.log('SIGINT received, stopping bot...');
    bot.stop('SIGINT');
    console.log('Bot stopped.');
    process.exit(0);
});
process.once('SIGTERM', () => {
    console.log('SIGTERM received, stopping bot...');
    bot.stop('SIGTERM');
    console.log('Bot stopped.');
    process.exit(0);
});