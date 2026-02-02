# Max Quest Game Client Architecture Documentation
**Location**: `mq-client-clean-version/`

## 📋 Overview

This is the HTML5 game client codebase for the Max Quest gaming platform. It contains multiple shooter games built with **PIXI.js** (WebGL rendering engine), **Vue.js** (UI framework), and **Webpack** (build tooling).

---

## 🗂️ Project Structure

```
mq-client-clean-version/
├── common/                    # Shared resources across all games
│   ├── PIXI/                  # PIXI.js graphics engine (shared dependency)
│   ├── assets/                # Common game assets
│   └── deploy_common.sh       # Deploy script for common resources
│
├── dragonstone/               # Game: Dragonstone
│   ├── lobby/                 # Lobby (game selection/setup interface)
│   ├── game/                  # Main game logic and graphics
│   ├── shared/                # Code shared between lobby & game
│   ├── validator/             # Platform validation logic
│   └── _sources/              # Source assets (images, sprites, etc.)
│
├── missionamazon/             # Game: Mission Amazon
├── revengeofra/               # Game: Revenge of Ra
├── sectorx/                   # Game: Sector X
├── sectorx_btg/               # Game: Sector X (Battleground variant)
├── cashorcrash/               # Game: Cash or Crash (lobby-only)
│
├── project_build.sh           # Build automation script
├── deploy_game.sh             # Deployment script
└── bitbucket-pipelines.yml    # CI/CD pipeline configuration
```

---

## 🎮 Game Structure

Each game (except `cashorcrash`) follows this pattern:

```
<game-name>/
├── lobby/                     # Pre-game interface
│   ├── src/                   # Source code
│   │   ├── index.js          # Entry point
│   │   ├── main.js           # Initialization logic
│   │   ├── external/         # External API integrations
│   │   └── ...               # Game-specific code
│   ├── assets/               # Lobby-specific assets
│   ├── dist/build/           # Build output (created by webpack)
│   ├── package.json          # NPM dependencies
│   ├── webpack.config.js     # Dev webpack config
│   ├── webpack.config.build.js # Production webpack config
│   ├── validator.js          # Browser compatibility checker
│   ├── version.json          # Version metadata
│   └── index.html            # HTML template
│
├── game/                      # Main game runtime
│   ├── src/                  # Source code
│   ├── assets/               # Game-specific assets
│   ├── dist/build/           # Build output
│   ├── package.json
│   ├── webpack.config.build.js
│   └── index.html
│
├── shared/                    # Code shared between lobby & game
│   ├── src/                  # Shared utilities, models, etc.
│   └── package.json          # Shared dependencies
│
├── validator/                 # Platform validation (WebGL, browser features)
└── _sources/                  # Raw source assets (PSD, AI files, etc.)
```

---

## 🔧 Technology Stack

### Core Dependencies

| Library | Purpose | Location |
|---------|---------|----------|
| **PIXI.js Legacy** | 2D WebGL rendering engine | `common/PIXI/node_modules/pixi.js-legacy` |
| **Vue.js 2.6** | UI framework for lobby screens | Each game's `package.json` |
| **Webpack 4** | Module bundler and build tool | DevDependency in each module |
| **Babel** | ES6+ to ES5 transpilation | Configured in webpack |
| **Mustache** | HTML templating | Dependency |

### Build Tools

- **webpack-obfuscator**: Code obfuscation for production
- **babel-polyfill**: ES6+ feature polyfills
- **copy-webpack-plugin**: Copy static assets to build
- **html-webpack-plugin**: Generate HTML with injected bundles

---

## 🛠️ Build System

### Webpack Build Pipeline

**Entry Point**:
```javascript
// lobby/src/index.js
import init from './main.js';
import {default as ExternalAPI} from './external/GameExternalAPI';

function environmentReady() {
    init(ExternalAPI, {});
}
```

**Build Configuration** (`webpack.config.build.js`):

1. **Source Paths**:
   - `PROJECT_SRC`: Current game's `src/` directory
   - `PIXI_SRC`: Shared PIXI library at `../../common/PIXI`
   - `SHARED_SRC`: Game's shared code at `../shared/src`

2. **Output**:
   - Path: `dist/build/`
   - Files: `game.js` (bundled JavaScript)

3. **Loaders**:
   - **babel-loader**: Transpile ES6+ → ES5 (includes PIXI, project, shared sources)
   - **vue-loader**: Compile `.vue` single-file components
   - **css-loader**: Process CSS imports

4. **Webpack Plugins**:
   - `HtmlWebpackPlugin`: Generate `index.html`
   - `CopyWebpackPlugin`: Copy `validator.js`, `version.json`, `assets/`, `common_ue.js`
   - `WebpackObfuscator`: Obfuscate code for production
   - `VueLoaderPlugin`: Enable Vue.js support
   - `webpack.ProvidePlugin`: Inject PIXI globally

5. **Aliases**:
   - `P2M` → `common/PIXI` (import PIXI modules as `P2M/...`)
   - `vue$` → `vue/dist/vue.esm.js` (use ES module build)

---

## 📦 Build Automation Script

**File**: `project_build.sh`

### Available Commands

```bash
# Install dependencies for a specific game
./project_build.sh install dragonstone

# Build a specific game
./project_build.sh build dragonstone

# Compress build output
./project_build.sh compress dragonstone

# Process all games
./project_build.sh build all
./project_build.sh install all

# List available modules
./project_build.sh list_modules
```

### Build Process for Each Game

1. **Install Phase**:
   - Installs `common/PIXI` dependencies
   - Installs `<game>/game` dependencies
   - Installs `<game>/lobby` dependencies
   - Installs `<game>/shared` dependencies

2. **Build Phase**:
   - Builds `<game>/game` → `game/dist/build/`
   - Builds `<game>/lobby` → `lobby/dist/build/`

3. **Compress Phase**:
   - Creates `<game>.tar.gz` containing `game/dist/build/` and `lobby/dist/build/`

4. **Version Update**:
   - Updates all `version.json` files with current Git commit hash

---

## 🎯 How to Create a New Game

### Step 1: Copy an Existing Game Structure

```bash
cd mq-client-clean-version
cp -r dragonstone mynewgame
cd mynew game
```

### Step 2: Update Package Names

Edit `package.json` files:

**lobby/package.json**:
```json
{
  "name": "mynewgame_lobby",
  "version": "1.0.0",
  "description": "My New Game Lobby"
}
```

**game/package.json**:
```json
{
  "name": "mynewgame_game",
  "version": "1.0.0",
  "description": "My New Game"
}
```

### Step 3: Update Build Script

Edit `project_build.sh`, add your game to the module list:

```bash
module_list=(
    "common"
    "cashorcrash"
    "dragonstone"
    "missionamazon"
    "sectorx"
    "sectorx_btg"
    "revengeofra"
    "mynewgame"  # Add this
)
```

### Step 4: Install Dependencies

```bash
./project_build.sh install mynewgame
```

This will install:
- `common/PIXI/node_modules/`
- `mynewgame/game/node_modules/`
- `mynewgame/lobby/node_modules/`
- `mynewgame/shared/node_modules/`

### Step 5: Develop Your Game

**Lobby Development** (`lobby/src/`):
- Modify `main.js` for lobby logic
- Add Vue components in `src/components/`
- Update assets in `lobby/assets/`

**Game Development** (`game/src/`):
- Implement game logic using PIXI.js
- Create game scenes, sprites, animations
- Update assets in `game/assets/`

**Shared Code** (`shared/src/`):
- Common utilities, models, constants
- Shared between lobby and game

### Step 6: Build the Game

```bash
# Development build (includes source maps)
cd mynewgame/lobby
npm run start  # Starts dev server at localhost:8080

cd ../game
npm run start

# Production build (obfuscated)
cd ../../  # Back to mq-client-clean-version
./project_build.sh build mynewgame
```

### Step 7: Deploy to Game Server

After building, copy to webapp:

```bash
# Copy lobby build
cp -r mynewgame/lobby/dist/build/* \
  ../../game-server/web-gs/src/main/webapp/html5pc/actiongames/mynewgame/lobby/

# Copy game build
cp -r mynewgame/game/dist/build/* \
  ../../game-server/web-gs/src/main/webapp/html5pc/actiongames/mynewgame/game/

# Rebuild WAR
cd ../../game-server/web-gs
mvn clean package -DskipTests

# Deploy
docker cp target/ROOT.war gp3-gs-1:/var/lib/jetty/webapps/ROOT.war
docker restart gp3-gs-1
```

---

## 🔗 Dependencies Between Modules

```
┌─────────────┐
│   COMMON    │  (PIXI.js engine, shared assets)
└──────┬──────┘
       │
   ┌───┴───────────────────┬──────────┬──────────┐
   │                       │          │          │
┌──▼───┐   ┌───▼────┐   ┌─▼──┐   ┌──▼──┐   ┌──▼──┐
│DRAGON│   │MISSION │   │SECT│   │REVEN│   │CASH │
│STONE │   │AMAZON  │   │OR X│   │GE RA│   │CRASH│
└──┬───┘   └───┬────┘   └─┬──┘   └──┬──┘   └─────┘
   │           │          │         │
   └───────┬───┴──────────┴─────────┘
           │
    ┌──────▼──────┐
    │   SHARED    │  (per-game shared code)
    └─────────────┘
```

---

## 📝 Key Files Explained

| File | Purpose |
|------|---------|
| `index.js` | Entry point, waits for `gameEnvReady` then calls `init()` |
| `main.js` | Initialization logic, creates game instance |
| `external/GameExternalAPI.js` | Integration with game server (getParams, openCashier, etc.) |
| `validator.js` | Checks browser compatibility (WebGL, screen size, etc.) |
| `version.json` | `{"version": "1.1.126", "commitHash": "abc123"}` |
| `common_ue.js` | Common User Experience utilities (551 KB pre-built) |
| `webpack.config.js` | Dev build (source maps, dev server) |
| `webpack.config.build.js` | Production build (minified, obfuscated) |

---

## 🚀 Integration with Game Server

The game server's `template.jsp` loads the game:

```javascript
// template.jsp line 248-260
var templateJsPath = 'http://localhost:8081/html5pc/actiongames/dragonstone/lobby';

// Load version.json
l_xhr.open('GET', templateJsPath + '/version.json?t=' + Date.now());
l_xhr.onload = function() {
    var version = JSON.parse(l_xhr.response).version;
    loadScript(templateJsPath + '/validator.js', version, function() {
        if (window.getPlatformInfo().supported) {
            loadScript(templateJsPath + '/game.js', version);
        }
    });
};
```

**Required files in deployment**:
1. `version.json` - Version metadata
2. `validator.js` - Browser compatibility checker
3. `game.js` - Bundled game code
4. `assets/` - Game assets (images, sounds, etc.)

---

## ⚡ Quick Reference

```bash
# Install all dependencies
./project_build.sh install all

# Build all games
./project_build.sh build all

# Build single game
./project_build.sh build dragonstone

# Dev server (with hot reload)
cd dragonstone/lobby
npm run start
# Access at http://localhost:8080

# Production build
npm run build
# Output: dist/build/game.js
```

---

## 📊 Game Module Status

| Game | Lobby | Game | Shared | Status |
|------|-------|------|--------|--------|
| dragonstone | ✅ | ✅ | ✅ | Source only (needs build) |
| missionamazon | ✅ | ✅ | ✅ | Source only (needs build) |
| sectorx | ✅ | ✅ | ✅ | Source only (needs build) |
| sectorx_btg | ✅ | ✅ | ✅ | Source only (needs build) |
| revengeofra | ✅ | ✅ | ✅ | Source only (needs build) |
| cashorcrash | ❌ | ✅ | ❌ | Lobby-less (game only) |

---

## 🔍 Troubleshooting

### Build fails with "Cannot find module 'PIXI'"
- **Solution**: Install PIXI first: `cd common/PIXI && npm install`

### 404 error for `game.js`
- **Cause**: Game not built yet
- **Solution**: Run `./project_build.sh build <game-name>`

### Webpack babel-loader errors
- **Cause**: Node.js version incompatibility
- **Solution**: Use Node.js 14.x or 16.x (webpack 4 compatibility)

### Assets not loading
- **Cause**: Assets not copied to `dist/build/`
- **Check**: `webpack.config.build.js` → `CopyWebpackPlugin` configuration

---

## 🎓 Next Steps for Creating Games

1. **Study existing games**: Start with `dragonstone` as reference
2. **Understand PIXI.js**: Learn sprite manipulation, animations, containers
3. **Master Vue.js**: For building lobby UI components
4. **Review GameExternalAPI**: Understand server integration (balance, bets, etc.)
5. **Test workflow**: Build → Deploy → Test in browser
6. **Iterate**: Use dev server (`npm run start`) for rapid development

---

## 📚 Additional Resources

- **PIXI.js Docs**: https://pixijs.io/guides/
- **Vue.js 2 Docs**: https://v2.vuejs.org/
- **Webpack 4 Docs**: https://v4.webpack.js.org/
- **Build Script**: `project_build.sh` (study this for automation)
