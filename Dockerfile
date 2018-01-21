FROM node:8-alpine
# Working directory for application
RUN mkdir /node_express_seed
ADD . /node_express_seed
WORKDIR /node_express_seed
RUN npm i
# initializing database
RUN node configure.js
# Binds to port 3000
EXPOSE 3000
# Creates a mount point
VOLUME [ "/usr/src/app" ]
CMD ["npm", "start"]
