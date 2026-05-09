# Project Context: Discord Monitor

## Overview
`discord-monitor` is a specialized Discord bot designed to track user activities and log them in real-time to a Google Spreadsheet. It serves as a bridge between Discord's event stream and external data analysis tools (Google Sheets).

## Core Purpose
The bot aims to provide detailed logging of:
- **Voice State**: When users join, leave, or move between voice channels.
- **Message Activity**: When users send messages (tracking frequency/timing, not necessarily content).
- **Interaction Logging**: Tracking how users interact with the bot via slash commands.
- **Data Persistence**: Ensuring all events are recorded with accurate timestamps in a structured format for long-term monitoring.

## Tech Stack
- **Runtime**: Node.js (v18.16.0+)
- **Library**: `discord.js` (v14.9.0) - Core Discord integration.
- **Database/Storage**: `google-spreadsheet` (v4.1.4) & `google-auth-library` (v9.15.1).
- **Automation**: Docker support for containerized deployment.
- **Utilities**: `axios` for potential external API calls, `dotenv` for configuration.

## Project Structure
- `index.js`: Entry point, initializes Discord client and event listeners.
- `events/`: Event handlers for Discord gateway events (e.g., `voiceStateUpdate`, `messageCreate`).
- `lib/`:
    - `google-sheet/`: Logic for interacting with Google Sheets API (updating rows, logging info).
    - `common/`: Shared utilities like date formatting.
    - `user-name/`: (To be explored) Likely handles user display name normalization.
- `scripts/`: Deployment scripts for slash commands.
- `docs/`: Architecture diagrams and detailed system documentation.

## Domain Language
- **Monitor**: The process of listening to Discord events and recording them.
- **Log Entry**: A single record in the Google Sheet (Id, Username, Timestamp, Action).
- **Voice State**: The current status of a user in a voice channel (Joined/Left).
- **Slash Command**: Modern Discord interaction model used for bot control.

## Guiding Principles
- **Reliability**: Ensure the bot stays online and handles connection drops gracefully.
- **Data Integrity**: Every relevant Discord event should be accurately reflected in the Google Sheet.
- **Transparency**: Clear console logging for monitoring bot performance locally.
- **Scalability**: The system should allow easy addition of new event monitors (e.g., presence changes, reactions).

## Current Roadmap / Goals
1. **Dynamic Sheet Control**: Allow switching between different sheets or tabs dynamically.
2. **Auto-Restart**: Implement robust reconnection logic for both Discord and Google Sheets.
3. **Advanced User Tracking**: Improve the logic for tracking user state transitions to avoid redundant or missed logs.
4. **Command Expansion**: Build out more slash commands to query or manage the monitoring status.
