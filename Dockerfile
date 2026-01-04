# Use Node.js 16.20.2 official image as the base image
FROM node:18.20.2

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files to the working directory
COPY . .

# Pass varoables to env
ARG DISCORD_TOKEN
ARG CLIENT_ID
ARG GOOGLE_SERVICE_ACCOUNT_EMAIL
ARG GOOGLE_PRIVATE_KEY
ARG GOOGLE_SHEET_ID

ENV DISCORD_TOKEN=$DISCORD_TOKEN
ENV CLIENT_ID=$CLIENT_ID
ENV GOOGLE_SERVICE_ACCOUNT_EMAIL=$GOOGLE_SERVICE_ACCOUNT_EMAIL
ENV GOOGLE_PRIVATE_KEY=$GOOGLE_PRIVATE_KEY
ENV GOOGLE_SHEET_ID=$GOOGLE_SHEET_ID

# Start the application
CMD ["npm", "run", "start:prod"]
