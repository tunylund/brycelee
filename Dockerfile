# specify the node base image with your desired version node:<version>
FROM node:9.3
EXPOSE 8888
ENV NODE_ENV=production
USER node
ADD . /opt/brycelee
WORKDIR '/opt/brycelee'
EXPOSE 8888
CMD ["node","server.js"]
