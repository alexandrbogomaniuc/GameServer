# CHANGELOG

## [2026-02-04] - WebSocket Error 1012 & Unified Routing Fixes

### Fixed

#### 1. WebSocket Error 1012: ROOM_NOT_OPEN (NullPointerException)
**Issue:** Multiplayer games failed to open with error code 1012 (`ROOM_NOT_OPEN`). Logs revealed a `NullPointerException` at `AbstractGameRoom.java:2210`.

**Root Cause:**
- `OpenRoomHandler` calls `client.setAccountId(accountId)` during the room opening process.
- `UnifiedSocketClient` (and its base `AbstractWebSocketClient`) had a NOP (No-Operation) implementation for `setAccountId` and `setBankId`.
- This caused `client.getAccountId()` to return `null`, which `ConcurrentHashMap.put` in `AbstractGameRoom` rejects with an NPE.

**Solution:**
- Modified `UnifiedSocketClient.java` to properly store and retrieve `accountId` and `bankId`.
- Updated getters to fall back to `playerInfo` if the direct fields are not set.

**Files Modified:**
- `web/src/main/java/com/betsoft/casino/mp/web/socket/UnifiedSocketClient.java`

**Result:**
- `OpenRoom` process now correctly identifies the player.
- Error 1012 is resolved for unified connections.

---

#### 2. WebSocket Error 1001: BAD_REQUEST (Game client is out of date)
**Issue:** Client actions (like switching weapons or shots) failed with error code 1001 (`BAD_REQUEST`).

**Root Cause:**
- `UnifiedWebSocketHandler` was missing registrations for numerous game and lobby handlers (e.g., `SwitchWeaponHandler`, `BuyInHandler`, `ShotHandler`, `QuestCollectHandler`).
- When these messages were sent via the unified connection, the handler rejected them as unhandled types.

**Solution:**
- Updated `UnifiedWebSocketHandler.java` to autowire and register all missing handlers.
- Explicitly registered `ShotHandler` and `SyncLobbyHandler`.

**Files Modified:**
- `web/src/main/java/com/betsoft/casino/mp/web/socket/UnifiedWebSocketHandler.java`

**Result:**
- Unified connection now supports the full range of game and lobby actions.

---

#### 3. Deployment Conflict Recovery
**Issue:** After the fix, the server returned `404` for `/websocket/mplobby` and `CONNECTION_REFUSED`.

**Root Cause:**
- A stale/incomplete `ROOT` directory in the container's volume prevented Tomcat from fully unpacking the new 86MB `ROOT.war`.
- Resulted in missing classes (Log4j), leading to `NoClassDefFoundError` and Spring context failure.

**Solution:**
- Clear stale `ROOT` directory.
- Manually unpacked `ROOT.war` on the host to ensure complete extraction.
- Restarted container and verified Spring initialization in `localhost.log`.

**Result:**
- Spring context correctly initialized ("Start MP Casino Engine").
- WebSocket endpoints are now correctly mapped and reachable.

---

#### 4. Improved WebSocket Routing Logic
**Issue:** Local development environments (specifically Docker) used hostnames like `mp-lobby` which weren't recognized by the routing logic, leading to incorrect URL construction.

**Root Cause:**
- Hardcoded list of local domains in `AbstractStartGameUrlHandler` was missing Docker-specific hostnames and network aliases.
- Incorrect port selection for single-node games.

**Solution:**
- Added `mplobby`, `mp-lobby`, and `mp-lobby.gsmp.lan` to the recognized local hostnames.
- Utilized `isSingleNodeRoomGame()` for more accurate routing to port 8080 (unified endpoint).

**Files Modified:**
- `web/src/main/java/com/betsoft/casino/mp/web/handlers/lobby/AbstractStartGameUrlHandler.java`

---

### Added

#### 1. WebSocket Manual Test Tools
**Action:** Added manual verification tools to the deployed `ROOT` directory for direct protocol testing.
- Created `web.xml` with metadata-complete=false to ensure correct servlet discovery.
- Created `websocket.html` test page to verify `/websocket/ping` and other endpoints directly from the browser.

**Files Added:**
- `deployments/mp-lobby/ROOT/WEB-INF/web.xml`
- `deployments/mp-lobby/ROOT/websocket.html`

---

### Deployment Actions
1. **Build:** `mvn clean package -DskipTests` (MP-Lobby)
2. **Deploy:** Replaced `ROOT.war` in `deployments/mp-lobby/` with the new build.
3. **Restart:** `docker restart gp3-mp-lobby-1`

---

## [2026-02-03] - Kafka Timeout & WebSocket Connection Fixes

### Fixed

#### 1. Kafka 15-Second Timeout in Player Info Requests
**Issue:** `SocketService.getDetailedPlayerInfo` was timing out after 15 seconds when requesting player information from the game server.

**Root Cause:** 
- Kafka topic configuration mismatch between `mp-lobby` and `gs` services
- MP-Lobby was sending messages to: `gs-receive-from-mp`
- GS Service was listening to default topic: `gs-receive-from-random-mp`

**Solution:**
- Updated `mq-gs-clean-version/deploy/docker/GP3/docker-compose.yml`
- Added Kafka topic environment variables to `gs` service
- Injected topic configurations as Java system properties (`-D` flags) in the startup command
- System properties override default values in `kafka.properties`

**Files Modified:**
- `deploy/docker/GP3/docker-compose.yml` (lines 16-27)

**Result:** 
- Kafka consumer group shows zero lag
- Response times dropped from 15+ seconds to sub-second
- Messages flow correctly between services

**Git Commit:** `63caa5f` - Fix: Align Kafka topics in docker-compose for GS

---

#### 2. WebSocket Origin Validation Error
**Issue:** Browser console showed error: `The value of the 'Origin' header is 'http://localhost', which is not equal to the supplied origin`

**Root Cause:**
- MP-Lobby's WebSocket handlers were rejecting connections from `localhost` and `127.0.0.1` origins
- Origin validation was too strict for local development

**Solution:**
- Modified `ServerConfigDto.java` to accept `localhost` and `127.0.0.1` as valid origins
- Updated `AbstractWebSocketHandler.java` to allow localhost connections
- Added origin validation logic for development environments

**Files Modified:**
- `core/src/main/java/com/betsoft/casino/mp/service/ServerConfigDto.java`
- `web/src/main/java/com/betsoft/casino/mp/web/socket/AbstractWebSocketHandler.java`

**Result:**
- Lobby WebSocket connections work from localhost
- No more origin validation errors in console

**Git Commit:** `2aab4957` - Fix: Finalize Kafka topic alignment and WebSocket origin support

---

#### 3. Game WebSocket Connection Refused (NS_ERROR_WEBSOCKET_CONNECTION_REFUSED)
**Issue:** After successfully entering the lobby, game failed to load with error:
```
NS_ERROR_WEBSOCKET_CONNECTION_REFUSED
ws://localhost:8081/websocket/mpgame
```

**Root Cause:**
- **URL Path Mismatch:**
  - MP-Lobby was constructing: `ws://localhost:8081/websocket/mpgame` (lowercase 's')
  - GS Server endpoint configured as: `/webSocket` (capital 'S') in `web.xml`
- Java servlet URL patterns are case-sensitive

**Solution:**
- Updated `AbstractStartGameUrlHandler.java` (line 299)
- Changed WebSocket URL construction from `/websocket/` to `/webSocket`
- Removed the `/mpgame` suffix appending logic (line 304) as it's not needed

**Code Change:**
```java
// Before:
roomWebSocketUrl = IMessageHandler.getWsProtocol(origin) + host + ":8081/websocket/";
roomWebSocketUrl += gameType.isCrashGame() ? "mpunified" : "mpgame";

// After:
roomWebSocketUrl = IMessageHandler.getWsProtocol(origin) + host + ":8081/webSocket";
```

**Files Modified:**
- `web/src/main/java/com/betsoft/casino/mp/web/handlers/lobby/AbstractStartGameUrlHandler.java`

**Deployment:**
1. Built MP-Lobby: `mvn clean package -DskipTests` (completed in 2m 4s)
2. Copied WAR to container: `docker cp web-mp-casino.war gp3-mp-lobby-1:/usr/local/tomcat/webapps/ROOT.war`
3. Restarted service: `docker restart gp3-mp-lobby-1`

**Result:**
- Game WebSocket connection successful
- No more connection refused errors
- Game loads properly after entering lobby

**Git Commit:** `a9bfea4a` - Fix: Update WebSocket URL to match GS endpoint (/webSocket)

---

### Testing
- ✅ Kafka consumer group verified (zero lag)
- ✅ Lobby WebSocket connection tested and working
- ✅ Game WebSocket connection tested and working
- ✅ End-to-end game launch verified successful

### Impact
- **Performance:** Player info requests now complete in sub-second time (was 15+ seconds)
- **Reliability:** WebSocket connections no longer fail due to origin or URL mismatches
- **User Experience:** Games now load successfully from the lobby without connection errors

### Repositories Updated
- `mq-gs-clean-version` (GS Service) - Pushed to `origin/master`
- `mq-mp-clean-version` (MP-Lobby Service) - Pushed to `origin/main`

### Notes
All fixes have been tested in local development environment with Docker containers:
- `gp3-gs-1` (Game Server on port 8081)
- `gp3-mp-lobby-1` (MP-Lobby on port 8080)
- `gp3-kafka-1` (Kafka on port 9092)
- `gp3-zookeeper-1` (Zookeeper on port 2181)
- `gp3-c1-1` (Cassandra on port 9142)
