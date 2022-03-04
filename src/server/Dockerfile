FROM node:14-alpine

# Create app directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json /src/

# Install npm dependencies
ENV NODE_ENV=production
RUN npm ci --only=production

# Bundle app source
COPY . /src

EXPOSE 4000
CMD [ "node", "index.js" ]