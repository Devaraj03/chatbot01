const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.static(__dirname + "/public"));

// 🔐 Paste your Hugging Face API token here
const HUGGINGFACE_API_KEY = "your_hf_api_key_her";

app.post("/chat", async (req, res) => {
    const userInput = req.body.message;

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<|user|>\n${userInput}\n<|assistant|>`,
                parameters: {
                    max_new_tokens: 250,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        });

        const data = await response.json();
        console.log("Hugging Face Response:", data);

        const reply = data[0]?.generated_text?.split("<|assistant|>")[1]?.trim() || "No reply";
        res.json({ reply });

    } catch (err) {
        res.json({ reply: "⚠️ Error: " + err.message });
    }
});

app.listen(3000, () => {
    console.log("🟢 Server running at http://localhost:3000");
});
