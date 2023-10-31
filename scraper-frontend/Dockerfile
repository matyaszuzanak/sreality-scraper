# Stage 1: Build the React application
FROM node:latest AS build

# Define working directory
WORKDIR /app

# Use create-react-app to bootstrap the project
RUN npx create-react-app scraper --use-npm

# Copy your custom App.js into the created project directory
COPY src/App.js /app/scraper/src/
COPY src/App.css /app/scraper/src/

# Switch to the created project directory
WORKDIR /app/scraper

# Build the React app
RUN npm run build

# Stage 2: Serve the React application
FROM nginx:alpine

COPY --from=build /app/scraper/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

