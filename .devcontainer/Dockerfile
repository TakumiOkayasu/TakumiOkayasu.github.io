FROM oven/bun:latest

ARG USER_NAME
ARG USER_UID
ARG USER_GID

ENV TZ=Asia/Tokyo \
    LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP:jp \
    LC_ALL=ja_JP.UTF-8 \
    DEVCONTAINER=true

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    bash \
    curl \
    git \
    sudo \
    ssh \
    unzip \
    locales \
    tzdata \
    build-essential \
    ca-certificates \
    libicu-dev \
    nodejs \
    npm \
    webp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && locale-gen ja_JP.UTF-8 \
    && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8

# Node.js LTSのインストール（エラーハンドリング付き）
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - || { \
    echo "NodeSource setup failed, falling back to default nodejs"; \
    apt-get install -y nodejs npm; \
    } \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# npmとpnpmのインストール（エラーチェック付き）
RUN if command -v npm &> /dev/null; then \
    npm install -g npm@latest pnpm; \
    else \
    echo "npm not found, skipping global package installation"; \
    fi

WORKDIR /tmp/scripts/

# terminal config
RUN curl -o ./create_user.sh https://raw.githubusercontent.com/TakumiOkayasu/shellscript_utility/refs/heads/main/create_user.sh \
    && curl -o ./terminal_config.sh https://raw.githubusercontent.com/TakumiOkayasu/shellscript_utility/refs/heads/main/terminal_config.sh \
    && chmod 777 ./*.sh \
    && ./create_user.sh \
    && ./terminal_config.sh \
    && rm *.sh

WORKDIR /workspaces
USER ${USER_NAME}
SHELL ["/bin/bash", "-c"]