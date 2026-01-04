# ReadMe

Discord bot to monitor channel and user status.
and log data to google sheet. 

Supports **Discord Slash Commands (Global)** and is designed for
**Docker-based deployment**.

------------------------------------------------------------------------

## Features

-   Monitor voice state, presence, messages, reactions, and deletions
-   Log events and data into Google Sheets
-   Supports Discord **Slash Commands**
-   Designed to run in **Docker**
-   Can auto-deploy slash commands on startup

------------------------------------------------------------------------

## Prerequire

- node.js (18.16.0)
- npm (9.5.1)

## Installation

`npm install`

## Config .env
if not exist create it under root folder

``` env
# Discord Bot
DISCORD_TOKEN=

# Discord Application (for Slash Commands)
CLIENT_ID=

# Google Sheet
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

------------------------------------------------------------------------

## Run (Local)

``` bash
node index.js
```

If you are using slash commands and want to deploy them manually:

``` bash
node scripts/deploy-commands.js
node index.js
```

------------------------------------------------------------------------

## Run with Docker

``` bash
docker build -t discord-bot .
docker run -d \
  -e DISCORD_TOKEN=xxxx \
  -e CLIENT_ID=yyyy \
  -e GOOGLE_SERVICE_ACCOUNT_EMAIL=zzz \
  -e GOOGLE_PRIVATE_KEY=aaa \
  -e GOOGLE_SHEET_ID=bbb \
  discord-bot
```

------------------------------------------------------------------------

## Issues

Run `node logout.js` if the bot does not go offline.

------------------------------------------------------------------------

## Future

-   Dynamic Google Sheet index control
-   Auto restart when disconnected
-   Improve user state logic

------------------------------------------------------------------------
