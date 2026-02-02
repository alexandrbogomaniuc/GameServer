FROM nginx:1.13.10

COPY nginx.conf /etc/nginx/nginx.conf
COPY games.conf /etc/nginx/conf.d/games.conf

RUN echo "deb http://archive.debian.org/debian stretch main contrib non-free" > /etc/apt/sources.list
RUN mkdir -p /etc/nginx/sites-enabled

RUN rm /etc/nginx/conf.d/default.conf
RUN chmod 777 /etc/nginx/nginx.conf && chmod -R 777 /etc/nginx/sites-enabled
RUN useradd uploader-stat && echo uploader-stat:Squ2pKvGUmJjsecX | chpasswd
RUN apt-get update
RUN apt-get install -y --allow-unauthenticated openssh-server
RUN echo "Port 222" >> /etc/ssh/sshd_config && echo "AllowUsers uploader-stat" >> /etc/ssh/sshd_config \
    RUN update-rc.d ssh defaults  \
    RUN systemctl enable ssh


RUN apt-get install -y --allow-unauthenticated gettext-base

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
