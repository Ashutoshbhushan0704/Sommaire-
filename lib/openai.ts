import { SUMMARY_SYSTEM_PROMPT } from "@/utils/pormpts";
import OpenAI from "openai";
const openai = new OpenAI(
    {
        apiKey:process.env.OPEN_AI_KEY,
    }
);
 export async function generateSummaryFromOpenAi(pdfText:string) {


    try {
    const completion = await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        messages:[
            {
                role:'system',content:SUMMARY_SYSTEM_PROMPT
            },
            {
                role:'user',
                content:`Transform  this document into an engaging, easy to read summary with contextually relevent emojis and peoper markdown formatting:\n\n{pdfText} `,
            },
        ],
        temperature:0.7,
        max_tokens:1000,
    });
    return completion.choices[0].message.content;
    }catch(error:any){
if (error?.status === 429){
   throw new Error('Rate_LIMIT_EXCEEDED')
}
 throw error;
    }
 }



