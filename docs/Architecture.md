# System Architecture

本文件說明 `discord-monitor` 的運作架構與資料流向。

## 架構圖 (Architecture Diagram)

```mermaid
graph TD
    %% 定義樣式
    classDef container fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef config fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;
    classDef user fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;

    subgraph "User Interaction"
        User["<i class='fa fa-user'></i> User"]:::user
    end

    subgraph "Configuration"
        EnvFile["<i class='fa fa-file-code'></i> .env File"]:::config
    end

    subgraph "Docker Container"
        Bot["<i class='fab fa-node-js'></i> Discord Monitor Bot"]:::container
    end

    subgraph "External Services"
        Discord["<i class='fab fa-discord'></i> Discord Gateway & API"]:::external
        GSheets["<i class='fa fa-table'></i> Google Sheets API"]:::external
    end

    %% 流程連接
    User -- "Slash Commands / Messages" --> Discord
    Discord -- "Real-time Events (WebSocket)" --> Bot
    
    Bot -- "Loads Config on Startup" --> EnvFile
    Bot -- "Logs Data / Updates Sheet" --> GSheets
```

## 元件說明

1.  **Discord Monitor Bot**: 核心應用程式，基於 Node.js 開發。負責監聽 Discord 事件並處理邏輯。
2.  **Discord Gateway & API**: 提供即時事件（如訊息、語音狀態變更）以及 Slash Command 的互動介面。
3.  **Google Sheets API**: 作為資料庫使用，儲存監控到的數據與日誌。
4.  **.env File**: 儲存敏感設定，如 Discord Token 與 Google Credentials。