This is the backend for the Use Case 1 assignment. It is a Node.js/Express server that manages leads, scores them using an AI model, and assigns them to sales teams.

---

### Live Frontend URL
You can test the full application here: **[Your Live Vercel Frontend URL]**

---

### Features
- **CRUD Operations:** Full API for creating, reading, and updating leads.
- **AI Lead Scoring:** Integrates with an AI to score leads based on their description.
- **Automatic Assignment:** Automatically routes leads to "Senior Sales", "Junior Sales", or "Nurture Later" based on their score.
- **Containerized:** Fully containerized with Docker for consistent deployment.
- **CI/CD:** Deployed via a CI/CD pipeline on Render.

---

### Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL on Neon
- **ORM:** Prisma
- **AI:** OpenAI API (currently mocked due to account quota limits)
- **Deployment:** Render, Docker

---

### How to Run Locally
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file and add your `DATABASE_URL` and `OPENAI_API_KEY`.
4. Run `npx prisma migrate dev` to set up the database.
5. Run `npm start`.
