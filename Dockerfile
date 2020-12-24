
# FROM yarnpkg/node-yarn as builder

#RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

#RUN npm install -g node-sass postcss-cli autoprefixer watch

# ADD . /src
# WORKDIR /src

# RUN yarn install
# RUN npm run build:prod

FROM nginx

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

RUN rm -v /etc/nginx/nginx.conf
ADD nginx.conf /etc/nginx/

RUN rm -rf /usr/share/nginx/html
# COPY --from=builder /src/dist /usr/share/nginx/html
COPY dist /usr/share/nginx/html
EXPOSE 80

CMD ["/entrypoint.sh"]
#build: docker build -t starlink-erp/web .

#for dev test: docker run -p 8091:80  -e GATEWAY_URL=192.168.0.8 -e GATEWAY_PORT=8765  ccr.ccs.tencentyun.com/starlink/erp-web

#docker run --rm --volume /Users/Raymond/projects/htds/erp-web:/src --volume npm-module:/src/node_modules --workdir /src ccr.ccs.tencentyun.com/starlink-staging/web_builder ./build.sh
