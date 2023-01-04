FROM keymetrics/pm2:14-alpine

# Bundle APP files
COPY package.json .
COPY package-lock.json .
COPY pm2.json .
COPY . .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Show current folder structure in logs
RUN ls -al -R

EXPOSE 3001

CMD [ "pm2-runtime", "start", "pm2.json" ]