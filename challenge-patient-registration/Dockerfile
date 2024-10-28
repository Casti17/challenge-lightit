# Use official Node.js image to build the frontend
FROM node:18 AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application and build it
COPY . .
RUN npm run build

# Use a lightweight Node.js server to serve the built files
FROM node:18 AS serve
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g http-server

EXPOSE 3001
CMD ["http-server", "build", "-p", "3001"]