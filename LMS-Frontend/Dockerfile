FROM node:18.19

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the Angular app directory
COPY ./app/package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install frontend dependencies
RUN npm install

# Copy the entire Angular app to the working directory
COPY ./app .

# Build the Angular application for production
RUN ng build --configuration production

# Install a lightweight HTTP server to serve the application
RUN npm install -g http-server

# Expose the port the application will run on
EXPOSE 8080

# Serve the Angular application
CMD ["http-server", "dist/your-angular-app-name", "-p", "8080"]
