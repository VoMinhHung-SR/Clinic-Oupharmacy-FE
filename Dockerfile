# Stage 1: Build the React app
FROM node:16 AS build

WORKDIR /app

COPY package*.json/ ./

RUN npm install

COPY . ./
RUN npm run build

RUN ls -la /app

# Stage 2: Use Nginx to serve the React app
FROM nginx:1.21-alpine

# Copy build files from the build stage
# with react app it will be /app/build
# but react app + Vite it will be app/dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]