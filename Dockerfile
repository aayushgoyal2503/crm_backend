# Use a specific Node.js version
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# ** THE CRITICAL FIX **
# Copy the Prisma schema file BEFORE installing dependencies
COPY prisma ./prisma/

# Install dependencies (the postinstall script will now work)
RUN npm install --omit=dev

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# The command to run your app
CMD ["node", "index.js"]
