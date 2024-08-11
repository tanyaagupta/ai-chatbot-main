import { NextResponse } from 'next/server';
import LlamaAI from 'llamaai';

const apiToken = process.env.LLAMA_API_KEY;
const llamaAPI = new LlamaAI(apiToken);

const systemPrompt = `
You are a travel planning chatbot. Your main task is to assist users in planning their trips by providing personalized recommendations based on their preferences and interests. When a user specifies a destination, activity, or type of travel experience, you should recommend itineraries, accommodations, activities, and travel tips that suit their request. Your recommendations should cover a wide range of travel types, including leisure, adventure, cultural, and business travel. Include relevant details like travel costs, best times to visit, and local insights to help users make informed decisions.

Examples of user inputs:

"Can you suggest a romantic getaway in Europe?"
"I'm planning a family vacation to Japan. What are some must-see places?"
"I want to go on an adventure trip. Any suggestions for hiking destinations?"
"Help me plan a business trip to New York City."
"What are the best budget-friendly destinations in Southeast Asia?"

Example of a response:

"If you're looking for a romantic getaway in Europe, I recommend Santorini, Greece. Known for its stunning sunsets, whitewashed buildings, and crystal-clear waters, Santorini offers a perfect romantic setting. You can explore the charming village of Oia, relax on the unique black sand beaches, and enjoy a sunset dinner at one of the cliffside restaurants. The best time to visit is from late April to early November."
`

export async function GET() {
    console.log("GET route hit");
    return NextResponse.json({ message: "API is working" });
}

export async function POST(req) {
    try {
        const data = await req.json();
        console.log("message is",data);

        // Build the request for the Llama API
        const apiRequestJson = {
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...data,
            ],
            stream: false,  
            // max_new_tokens: 4096,
            // max_length: 10000,
            model: 'llama3.1-405b'
        };

        // Execute the Request
        console.log("Initial checkpoint 1")
        const completion = await llamaAPI.run(apiRequestJson);
        console.log("The entire message", completion);
        const response = completion.choices[0].message.content;
        console.log("Generated recipes:", response);
        return NextResponse.json({response}, { status: 200 });



        console.log("Initial checkpoint 2")
        // const stream = new ReadableStream({
        //     async start(controller) {
        //         const encoder = new TextEncoder();
        //         try {
        //             console.log("1rst checkpoint")
        //             // for await (const chunk of completion) {
        //             //     console.log("2nd checkpoint")
        //             //     const content = chunk.choices[0].delta.content;
        //             //     console.log("3rd checkpoint")
        //             //     if (content) {
        //             //         const text = encoder.encode(content);
        //             //         controller.enqueue(text);
        //             //     }
        //             // }
        //         } catch (error) {
        //             controller.error(error);
        //         } finally {
        //             controller.close();
        //         }
        //     }
        // });

        // return new NextResponse(stream);

    } catch (error) {
        console.error('Error:', error);
        return new NextResponse('Failed to fetch from Llama API', { status: 500 });
    }
}

// export async function POST(req) {
//     console.log("POST route hit");
//     try {
//         const body = await req.json();
//         console.log("Received body:", body);

//         const { inventory } = body;
//         console.log("Received inventory:", inventory);

//         // Prepare the prompt based on the inventory
//         const ingredients = inventory.map(item => `${item.name} (${item.quantity})`).join(', ');
//         const prompt = `Generate a recipe based on these ingredients: ${ingredients}`;

//         // Build the request JSON for LlamaAI
//         const apiRequestJson = {
//             "messages": [
//                 { "role": "user", "content": prompt }
//             ],
//             "stream": false
//         };

//         // Execute the request to LlamaAI
//         const response = await llamaAPI.run(apiRequestJson);
//         const recipes = response.choices[0].message.content.trim();
//         console.log("Generated recipes:", recipes);

//         return NextResponse.json({ recipes: recipes }, { status: 200 });
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
//     }
// }