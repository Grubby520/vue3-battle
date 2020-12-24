FROM node:12.14.0 as build

WORKDIR /export
ADD . .
RUN npm install && npm run build

# 使用nginx 作为运行进行
FROM nginx as prod

RUN rm -v /etc/nginx/nginx.conf && rm -rf /usr/share/nginx/html

COPY --from=build /export/entrypoint.sh /
COPY --from=build /export/dist /usr/share/nginx/html
COPY --from=build /export/nginx.conf /etc/nginx/
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]

