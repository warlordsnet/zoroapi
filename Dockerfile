# build stage for building .ts files
FROM node:18-alpine as build

RUN mkdir /home/app

WORKDIR /home/app

COPY package.json .

RUN npm install --ignore-scripts

COPY . .

RUN npm run build

# prod stage for including only necessary files
FROM node:18-alpine as prod

LABEL org.opencontainers.image.source=https://github.com/warlordsnet/aniwatch-api
LABEL org.opencontainers.image.description="Aniwatch API docker image"
LABEL org.opencontainers.image.licenses=MIT

# create a non-privileged user
RUN addgroup -S aniwatch && adduser -S zoro -G aniwatch

# set secure folder permissions
RUN mkdir -p /app/public /app/dist && chown -R zoro:aniwatch /app

# set non-privileged user
USER zoro

# set working directory
WORKDIR /app

# copy config file for better use of layers
COPY --chown=zoro:aniwatch package.json .

# install dependencies
RUN npm install --omit=dev --ignore-scripts

# copy public folder from build stage to prod
COPY --from=build --chown=zoro:aniwatch /home/app/public /app/public

# copy dist folder from build stage to prod
COPY --from=build --chown=zoro:aniwatch /home/app/dist /app/dist

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD [ "npm", "run", "healthcheck" ]

ENV NODE_ENV=production
ENV PORT=4000

# exposed port
EXPOSE 4000

CMD [ "node", "dist/server.js" ]

# exit