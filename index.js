// index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- AI Scoring Function ---
async function getLeadScore(description) {
    try {
        const prompt = `Based on the following lead description, score the conversion probability from 0 to 100. Consider factors like stated budget, urgency, and clarity of need. Respond with only a single number. Description: "${description}"`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 5,
        });

        const score = parseInt(response.choices[0].message.content.trim(), 10);
        return isNaN(score) ? 50 : Math.max(0, Math.min(100, score)); // Fallback and clamp
    } catch (error) {
        console.error("Error scoring lead:", error);
        return 50; // Return a default score on error
    }
}

// --- Business Logic for Assignment ---
function assignLead(score) {
    if (score > 75) return "Senior Sales";
    if (score >= 40) return "Junior Sales";
    return "Nurture Later";
}

// --- API Endpoints ---

// GET all leads
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch leads" });
    }
});

// POST a new lead
app.post('/api/leads', async (req, res) => {
    const { name, email, source, description } = req.body;
    if (!name || !email || !description) {
        return res.status(400).json({ error: "Name, email, and description are required." });
    }

    try {
        // 1. Create the lead first
        const newLead = await prisma.lead.create({
            data: { name, email, source, description },
        });

        // 2. Score and assign asynchronously (so the user gets a fast response)
        (async () => {
            const score = await getLeadScore(description);
            const assignedTo = assignLead(score);

            await prisma.lead.update({
                where: { id: newLead.id },
                data: { score, assignedTo },
            });
            console.log(`Lead ${newLead.id} scored and assigned.`);
        })();

        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ error: "Failed to create lead" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));