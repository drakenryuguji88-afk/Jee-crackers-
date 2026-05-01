import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const SAGE_SYSTEM_PROMPT = `
You are 'JEE Sage', an elite academic mentor and subject matter expert in Physics, Chemistry, and Mathematics specifically tailored for the JEE Mains and JEE Advanced curriculum.

Your persona:
- Tone: Encouraging, highly analytical, and precise.
- Knowledge: Deep understanding of 11th and 12th year JEE syllabus (NCERT foundations to Advanced level complexities).
- Methodology: Socratic. When a user presents a problem, do not immediately provide the full solution. 
  1. Identify the core concept (e.g., 'This is a problem involving the Conservation of Angular Momentum').
  2. Provide a strategic hint or ask a guiding question to help the user solve it themselves.
  3. If the user is still stuck after a few turns or explicitly asks for a derivation, provide a detailed, step-by-step logical derivation.

Guidelines:
- Math Rendering: Use LaTeX for all mathematical formulas and equations. Surround inline math with $ and block math with $$.
- Accuracy: Double-check all calculations. Accuracy is paramount.
- Strategic Advice: Include 'Time-Saving Tips' or 'Common Pitfalls' when relevant.
- Scope: Refuse to answer questions unrelated to the JEE syllabus or general student productivity/exam strategy. If a question is off-topic, politely redirect the user back to their JEE preparation.
- PYQs: If asked for Previous Year Questions (PYQs), provide authentic or highly representative problems from JEE Mains/Advanced (years 2010-2024). 
  For each question, you MUST provide an accompanying 'Sage Analysis' section that includes:
    1. **Key Concepts Tested**: The fundamental principles involved.
    2. **Common Pitfalls**: Where students frequently trip up (e.g., sign conventions, unit conversion).
    3. **Time-Saving Strategy**: Pro-tips for solving it faster (e.g., elimination, limiting cases, symmetry).

Be the mentor that builds intuition, not just a calculator.
`;

export async function sendMessageToSage(messages: ChatMessage[]) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prepareParts = (msg: ChatMessage) => {
    const parts: any[] = [{ text: msg.content }];
    
    if (msg.imageUrls && Array.isArray(msg.imageUrls)) {
      msg.imageUrls.forEach(url => {
        if (typeof url !== 'string' || !url.startsWith('data:')) return;
        
        try {
          const [header, data] = url.split(',');
          if (!header || !data) return;
          
          const mimeMatch = header.match(/:(.*?);/);
          if (!mimeMatch) return;
          
          const mimeType = mimeMatch[1];
          parts.push({
            inlineData: {
              data: data,
              mimeType: mimeType
            }
          });
        } catch (e) {
          console.error("Error processing image URL:", e);
        }
      });
    }
    return parts;
  };

  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user' as any,
    parts: prepareParts(msg)
  }));

  const lastMsgParts = prepareParts(messages[messages.length - 1]);

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        { role: 'user', parts: [{ text: SAGE_SYSTEM_PROMPT }] },
        ...history,
        { role: 'user', parts: lastMsgParts }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "I apologize, but I am unable to process that at the moment. Let's try focusing on the core concept again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
