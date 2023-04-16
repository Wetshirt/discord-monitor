# ReadMe

Discord bot to monitor channel and user status.
and log data to google sheet. 

## Prerequire

- node.js (18.16.0)
- npm (9.5.1)

## Installation

`npm install`

## Config .env
if not exist create it under root folder
```
# Discord Bot token
DISCORD_TOKEN=

# Google Sheet
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

## Run

run `node index.js`

## Issues

### logout 
run `node logout.js` after terminate main script or the not will still exist


## Deploy

目前是部屬到[replit](https://replit.com/@thisisforsmeeth/channel-monitor)，預計未來建api讓google sheet觸發同時保持replit服務運作


## Future

- log service statue and auto restart when bot disconnected
- some logic error when checking user state.