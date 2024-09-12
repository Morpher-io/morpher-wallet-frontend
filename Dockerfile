FROM public.ecr.aws/docker/library/node:22-alpine AS builder

RUN apk add git python3 make gcc

ARG NPM_BUILD_ENV=production

# ARG DEBIAN_FRONTEND=noninteractive
# ENV TZ=Europe/Vienna
# RUN apt-get install -y tzdata
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./




RUN npm install

ENV NODE_ENV=${NPM_BUILD_ENV}

# If you are building your code for production
# RUN npm ci --only=production


# Bundle app source
COPY . /usr/src/app/

RUN npx vue-tsc --build --force
RUN npx vite build --mode ${NPM_BUILD_ENV}

FROM public.ecr.aws/nginx/nginx:stable-alpine

ARG ENABLE_HTACCESS=false
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/.htpasswd /etc/nginx/conf.d/.htpasswd
RUN if [ "$ENABLE_HTACCESS" = "true" ] ; then sed -ri -e "s!#auth!auth!g" /etc/nginx/conf.d/default.conf ; fi
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
