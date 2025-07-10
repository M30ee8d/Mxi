import 'dotenv/config'; // تحميل التوكن من ملف .env
import OpenAI from "openai";
import readline from "readline";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o";

let userTone = "نبرة عادية: رد بأدب ووضوح دون مبالغة";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: token
});

async function ask(question) {
  const response = await client.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: `أنت مساعد ذكي. استخدم الأسلوب التالي دائماً: ${userTone}`
      },
      {
        role: "user",
        content: question
      }
    ],
    temperature: 1,
    top_p: 1
  });
  console.log("\n🤖:", response.choices[0].message.content);
}

function promptUser() {
  rl.question("\n🧠 اكتب سؤالك أو قل (نبرة:...) لتغيير الأسلوب > ", async (input) => {
    if (input.toLowerCase().startsWith("نبرة:")) {
      userTone = input.slice(6).trim();
      console.log(`✅ تم تغيير النبرة إلى: ${userTone}`);
    } else {
      await ask(input);
    }
    promptUser();
  });
}

console.log("مرحبًا بك في M-4X Prime 🤖\n");
console.log("🔄 يمكنك تغيير النبرة بكتابة: نبرة: رسمية | ساخرة | ودية |... الخ\n");
promptUser();
