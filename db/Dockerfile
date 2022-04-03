FROM archlinux

RUN echo "Server = https://mirror.yandex.ru/archlinux/\$repo/os/\$arch" > /etc/pacman.d/mirrorlist && \
  pacman -Syu --noconfirm && \
  rm -rf /var/cache/pacman/pkg/*

RUN pacman -S --noconfirm postgresql openbsd-netcat && \
  rm -rf /var/cache/pacman/pkg/*

COPY run.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/run.sh && \
  mkdir /run/postgresql && \
  chown postgres:postgres /run/postgresql

USER postgres
CMD ["/usr/local/bin/run.sh"]
