# --- Development/Build Stage ---
FROM node:23-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000

CMD [ "npm", "start:dev" ]

# --- Production Stage ---
# FROM node:23-alpine AS production
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY --from=development /usr/src/app/dist ./dist
# EXPOSE 3000
# CMD [ "node", "dist/main" ]
