# Step 1: Use the official Node.js image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json/yarn.lock
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Expose the development server port
EXPOSE 3000

# Step 7: Start the React development server
CMD ["npm", "start"]
