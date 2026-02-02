<%@ page import="com.dgphoenix.casino.common.web.BaseAction" %>
    <%@ page import="java.net.URLEncoder" %>
        <%@ page import="com.dgphoenix.casino.common.util.logkit.ThreadLog" %>
            <%@ page import="com.dgphoenix.casino.common.cache.BankInfoCache" %>
                <%@ page import="com.dgphoenix.casino.common.cache.data.bank.BankInfo" %>
                    <%@ page import="com.dgphoenix.casino.common.util.string.StringUtils" %>
                        <%@ page import="java.util.TimeZone" %>
                            <%@ page import="java.util.SimpleTimeZone" %>
                                <%@ page import="com.dgphoenix.casino.system.configuration.GameServerConfiguration" %>
                                    <%@ page import="com.dgphoenix.casino.common.cache.BaseGameInfoTemplateCache" %>
                                        <%@ page
                                            import="com.dgphoenix.casino.common.cache.data.game.BaseGameInfoTemplate" %>
                                            <%@ page import="com.dgphoenix.casino.actions.game.pov.StartPovGameParams"
                                                %>
                                                <%@ page import="com.google.gson.Gson" %>
                                                    <%@ page
                                                        import="static org.apache.http.entity.ContentType.APPLICATION_JSON"
                                                        %>
                                                        <%@ page
                                                            import="com.dgphoenix.casino.common.config.HostConfiguration"
                                                            %>
                                                            <%@ page
                                                                import="com.dgphoenix.casino.common.util.ApplicationContextHelper"
                                                                %>

                                                                <% String
                                                                    cdnUrl=request.getParameter(BaseAction.KEY_CDN);
                                                                    HostConfiguration
                                                                    hostConfig=ApplicationContextHelper.getBean(HostConfiguration.class);
                                                                    String scheme=request.getScheme(); String
                                                                    fwdScheme=request.getHeader("X-Forwarded-Proto"); if
                                                                    (fwdScheme !=null) { scheme=fwdScheme; } else if
                                                                    (hostConfig !=null &&
                                                                    hostConfig.isProductionCluster()) { scheme="https" ;
                                                                    } if (StringUtils.isTrimmedEmpty(cdnUrl)) {
                                                                    cdnUrl="localhost" ; } String lobbyUrl=scheme
                                                                    + "://" + cdnUrl; String serverUrl=scheme + "://" +
                                                                    request.getServerName(); String
                                                                    sessionErrorURL=serverUrl
                                                                    + "/error_pages/sessionerror.jsp" ; String
                                                                    bankId=request.getParameter(BaseAction.BANK_ID_ATTRIBUTE);
                                                                    if (bankId==null) {
                                                                    bankId=request.getParameter("bankId"); } if
                                                                    (StringUtils.isTrimmedEmpty(bankId)) {
                                                                    ThreadLog.error("MQ TMPL: bankId missing");
                                                                    response.sendRedirect(sessionErrorURL); return; }
                                                                    long lbankId=Long.parseLong(bankId); BankInfo
                                                                    bankInfo=BankInfoCache.getInstance().getBankInfo(lbankId);
                                                                    String
                                                                    homeURL=request.getParameter(BaseAction.PARAM_HOME_URL);
                                                                    if (StringUtils.isTrimmedEmpty(homeURL)) {
                                                                    homeURL=StringUtils.isTrimmedEmpty(bankInfo.getHomeURL())
                                                                    ? "" : bankInfo.getHomeURL(); } String
                                                                    sessionId=request.getParameter(BaseAction.SESSION_ID_ATTRIBUTE);
                                                                    if (StringUtils.isTrimmedEmpty(sessionId)) {
                                                                    ThreadLog.error("MQ TMPL: No SID");
                                                                    response.sendRedirect(sessionErrorURL); return; }
                                                                    String
                                                                    gameId=request.getParameter(BaseAction.GAME_ID_ATTRIBUTE);
                                                                    if (StringUtils.isTrimmedEmpty(gameId)) {
                                                                    ThreadLog.error("MQ TMPL: No GID");
                                                                    response.sendRedirect(sessionErrorURL); return; }
                                                                    String
                                                                    webSocketUrl=request.getParameter(BaseAction.WEB_SOCKET_URL);
                                                                    if (webSocketUrl==null ||
                                                                    webSocketUrl.trim().isEmpty()) { String
                                                                    wsScheme="https" .equals(scheme) ? "wss" : "ws" ;
                                                                    String serverName=request.getServerName(); int
                                                                    serverPort=request.getServerPort(); String
                                                                    contextPath=request.getContextPath();
                                                                    webSocketUrl=wsScheme + "://" + serverName + ":" +
                                                                    serverPort + contextPath + "/webSocket" ; } String
                                                                    timeZoneName=bankInfo.getTimeZone(); Integer
                                                                    offset=null; if (timeZoneName !=null) { TimeZone
                                                                    timeZone=SimpleTimeZone.getTimeZone(timeZoneName);
                                                                    if (timeZone !=null) {
                                                                    offset=timeZone.getOffset(System.currentTimeMillis())
                                                                    / 60000; } } BaseGameInfoTemplate
                                                                    bgInfo=BaseGameInfoTemplateCache.getInstance().getBaseGameInfoTemplateById(Long.parseLong(gameId));
                                                                    if (bgInfo.isBattleGroundsMultiplayerGame()) {
                                                                    ThreadLog.error("MQ TMPL: BTG Mode Error");
                                                                    response.sendRedirect(sessionErrorURL); return; }
                                                                    boolean tripleMaxBlast=bgInfo.getGameId()==875;
                                                                    String swfLocation=bgInfo.getSwfLocation(); String
                                                                    gamePath=StringUtils.isTrimmedEmpty(swfLocation)
                                                                    ? "/html5pc/shooter/" : swfLocation; String
                                                                    gameFolder=bgInfo.getMultiplayerGameFolderName();
                                                                    String templateJsPath=lobbyUrl + gamePath +
                                                                    (StringUtils.isTrimmedEmpty(gameFolder) ? "lobby" :
                                                                    gameFolder); String cdnUrls=bankInfo.getCdnUrls();
                                                                    if (bgInfo.isPovMultiplayerGame()) {
                                                                    StartPovGameParams params=new StartPovGameParams(
                                                                    bankId, sessionId, gameId,
                                                                    request.getParameter(BaseAction.LANG_ID_ATTRIBUTE),
                                                                    request.getParameter(BaseAction.GAMEMODE_ATTRIBUTE),
                                                                    webSocketUrl,
                                                                    request.getParameter(BaseAction.GAMESERVERID_ATTRIBUTE),
                                                                    request.getParameter("noFRB"), "" , homeURL,
                                                                    lobbyUrl + "/flash/shell/global_shell/rules/aams/" ,
                                                                    offset,
                                                                    GameServerConfiguration.getInstance().isTestSystem(),
                                                                    bankInfo.getCustomerSettingsUrl(), "" ,
                                                                    bankInfo.getMaxQuestWeaponMode().name(),
                                                                    bankInfo.isRoundWinsWithoutBetsAllowed(), null,
                                                                    null, false );
                                                                    response.setContentType(APPLICATION_JSON.toString());
                                                                    response.getWriter().write(new
                                                                    Gson().toJson(params)); return; } String
                                                                    lang=request.getParameter(BaseAction.LANG_ID_ATTRIBUTE);
                                                                    if (lang==null) { lang="" ; } String
                                                                    mode=request.getParameter(BaseAction.GAMEMODE_ATTRIBUTE);
                                                                    if (mode==null) { mode="" ; } String
                                                                    serverId=request.getParameter(BaseAction.GAMESERVERID_ATTRIBUTE);
                                                                    if (serverId==null) { serverId="" ; } String
                                                                    wsUrl=webSocketUrl; if (wsUrl==null) { wsUrl="" ; }
                                                                    String gameQuery="bankId=" +
                                                                    URLEncoder.encode(bankId, "UTF-8" ) + "&gameId=" +
                                                                    URLEncoder.encode(gameId, "UTF-8" ) + "&sessionId="
                                                                    + URLEncoder.encode(sessionId, "UTF-8" ) + "&lang="
                                                                    + URLEncoder.encode(lang, "UTF-8" ) + "&mode=" +
                                                                    URLEncoder.encode(mode, "UTF-8" ) + "&serverId=" +
                                                                    URLEncoder.encode(serverId, "UTF-8" )
                                                                    + "&websocket=" + URLEncoder.encode(wsUrl, "UTF-8"
                                                                    ); %>
                                                                    <!DOCTYPE html>
                                                                    <html>

                                                                    <head>
                                                                        <title>
                                                                            <%=bgInfo.getTitle()%>
                                                                        </title>
                                                                        <meta http-equiv="Content-Type"
                                                                            content="text/html, charset=utf-8" />
                                                                        <meta name="mobile-web-app-capable"
                                                                            content="yes">
                                                                        <meta name="apple-mobile-web-app-capable"
                                                                            content="yes" />
                                                                        <meta name="apple-touch-fullscreen"
                                                                            content="yes" />
                                                                        <meta
                                                                            name="apple-mobile-web-app-status-bar-style"
                                                                            content="black-translucent" />
                                                                        <meta name="msapplication-tap-highlight"
                                                                            content="no" />
                                                                        <meta name="MobileOptimized" content="960" />
                                                                        <meta name="viewport"
                                                                            content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0, user-scalable=no, minimal-ui" />
                                                                        <meta charset="utf-8" />
                                                                        <style>
                                                                            html,
                                                                            body {
                                                                                padding: 0;
                                                                                margin: 0;
                                                                                background-color: black
                                                                            }
                                                                        </style>
                                                                    </head>

                                                                    <body>
                                                                        <% if (!StringUtils.isTrimmedEmpty(cdnUrls) &&
                                                                            cdnUrls.contains("MCDN")) { %>
                                                                            <script async data-id="pulse"
                                                                                data-trackid="m9nkg2ac"
                                                                                src="https://beacon.idcservices.net/pulse.js?trackid=m9nkg2ac"></script>
                                                                            <% } %>
                                                                                <!-- Load PIXI synchronously BEFORE any other scripts -->
                                                                                <script
                                                                                    src="<%=templateJsPath%>/pixi.min.js"></script>
                                                                                <script>
                                                                                    // Force PIXI exposure to window - pixi.min.js should have created global PIXI
                                                                                    console.log('[PIXI-CHECK] window.PIXI exists?', typeof window.PIXI !== 'undefined');
                                                                                    console.log('[PIXI-CHECK] PIXI version:', window.PIXI ? window.PIXI.VERSION : 'NOT FOUND');
                                                                                </script>
                                                                                <script>
                                                                                    // Expose config as window.gameConfig for cross-origin access (GLOBAL SCOPE)
                                                                                    window.gameConfig = {
                                                                                        'bankId': '<%=bankId%>',
                                                                                        'sessionId': '<%=sessionId%>',
                                                                                        'gameId': '<%=gameId%>',
                                                                                        'lang': '<%=request.getParameter(BaseAction.LANG_ID_ATTRIBUTE)%>',
                                                                                        'mode': '<%=request.getParameter(BaseAction.GAMEMODE_ATTRIBUTE)%>',
                                                                                        'websocket': '<%=webSocketUrl%>',
                                                                                        'serverId': '<%=request.getParameter(BaseAction.GAMESERVERID_ATTRIBUTE)%>',
                                                                                        'getGamePath': '<%=lobbyUrl%><%=gamePath%>game/?bankId=<%=bankId%>&gameId=<%=gameId%>&mode=<%=request.getParameter(BaseAction.GAMEMODE_ATTRIBUTE)%>&lang=<%=request.getParameter(BaseAction.LANG_ID_ATTRIBUTE)%>&sessionId=<%=sessionId%>&serverId=<%=request.getParameter(BaseAction.GAMESERVERID_ATTRIBUTE)%>',
                                                                                        'getLobbyPath': '<%=lobbyUrl%><%=gamePath%>lobby/'
                                                                                    };
                                                                                </script>
                                                                                <script>
                                                                                    (function () {
                                                                                        window.gameEnvReady = false;
                                                                                        function onGameEnvReady() {
                                                                                            window.removeEventListener('load', onGameEnvReady);
                                                                                            window.gameEnvReady = true;
                                                                                        }
                                                                                        if (!!window.addEventListener) {
                                                                                            window.addEventListener("load", onGameEnvReady);
                                                                                        }

                                                                                        var l_xhr = new XMLHttpRequest();
                                                                                        l_xhr.open('GET', '<%=templateJsPath%>/version.json?t=' + (new Date().getTime()), true);
                                                                                        l_xhr.onload = function () {
                                                                                            var lVersion_str = JSON.parse(l_xhr.response).version;
                                                                                            loadScript('<%=templateJsPath%>/validator.js', lVersion_str, loadLobby.bind(this, lVersion_str));
                                                                                        };
                                                                                        l_xhr.send();

                                                                                        function loadLobby(version) {
                                                                                            var lPlatformInfo_obj = window.getPlatformInfo ? window.getPlatformInfo() : {};
                                                                                            if (lPlatformInfo_obj.supported) {
                                                                                                loadScript('<%=templateJsPath%>/game.js', version);
                                                                                            }
                                                                                        }

                                                                                        function loadScript(src, version, onLoadHandler) {
                                                                                            var lScript_e = document.createElement('script');
                                                                                            lScript_e.type = 'text/javascript';
                                                                                            lScript_e.src = src + (version ? '?version=' + version : '');
                                                                                            lScript_e.async = false;
                                                                                            if (onLoadHandler) {
                                                                                                lScript_e.onload = onLoadHandler;
                                                                                            }
                                                                                            document.head.appendChild(lScript_e);
                                                                                        }
                                                                                    })();

                                                                                    function getParams() {
                                                                                        return {
                                                                                            'bankId': '<%=bankId%>',
                                                                                            'sessionId': '<%=sessionId%>',
                                                                                            'gameId': '<%=gameId%>',
                                                                                            'lang': '<%=request.getParameter(BaseAction.LANG_ID_ATTRIBUTE)%>',
                                                                                            'mode': '<%=request.getParameter(BaseAction.GAMEMODE_ATTRIBUTE)%>',
                                                                                            'websocket': '<%=webSocketUrl%>',
                                                                                            'serverId': '<%=request.getParameter(BaseAction.GAMESERVERID_ATTRIBUTE)%>',
                <% if (tripleMaxBlast) { %> 'isTripleMaxBlast': 'true', <% } %>
                <% if (!StringUtils.isTrimmedEmpty(homeURL)) { %> 'JS_HOME': 'openHome', <% } %>
                                                                                            'CUSTOMER_SETTINGS_URL': '<%=lobbyUrl%><%=bankInfo.getCustomerSettingsUrl()%>',
                                                                                                'MQ_HELP_PATH': '<%=lobbyUrl%>/flash/shell/global_shell/rules/aams/',
                <% if (offset != null) { %> 'MQ_TIMER_OFFSET': '<%=offset%>', <% } %>
                                                                                            'MQ_TIMER_FREQ': '15',
                <% if (GameServerConfiguration.getInstance().isTestSystem()) { %> 'TEST_SYSTEM': true, <% } %>
                                                                                            'MQ_WEAPONS_MODE': '<%=bankInfo.getMaxQuestWeaponMode().name()%>',
                                                                                                'MQ_WEAPONS_SAVING_ALLOWED': '<%=bankInfo.isRoundWinsWithoutBetsAllowed()%>',
                                                                                                    'MQ_CLIENT_ERROR_HANDLING': <%=GameServerConfiguration.getInstance().isTestSystem() %>,
                                                                                                        'DISABLE_MQ_BACKGROUND_LOADING': '<%=bankInfo.isMQBackgroundLoadingDisabled()%>',
                                                                                                            'DISABLE_MQ_AUTOFIRING': '<%=false%>',
                                                                                                                'CW_SEND_REAL_BET_WIN': '<%=bankInfo.isCWSendRealBetWin()%>',
                                                                                                                    'commonPathForActionGames': '<%=lobbyUrl%>/html5pc/actiongames/common/',
                                                                                                                        'ROOMS_SORT_ORDER': '<%=bankInfo.getMQRoomsSortOrder()%>',
                                                                                                                            'CLIENT_LOG_LEVEL': '<%=bankInfo.getMQClientLogLevel().name()%>'
                                                                                    };
        }

                                                                                    function openHome() {
                                                                                        if (window.parent != null) {
                                                                                            window.parent.location = "<%=homeURL%>";
                                                                                        } else {
                                                                                            window.location = "<%=homeURL%>";
                                                                                        }
                                                                                    }

                                                                                    function getLobbyPath() {
                                                                                        return '<%=lobbyUrl%><%=gamePath%>lobby/';
                                                                                    }

                                                                                    function getGamePath() {
                                                                                        return '<%=lobbyUrl%><%=gamePath%>game/?<%=gameQuery%>';
                                                                                    }

                                                                                    function getCustomerspecDescriptorStoragePathURL() {
                                                                                        return "<%=lobbyUrl%><%=bankInfo.getCustomerSettingsHtml5Pc()%>";
                                                                                    }
                                                                                </script>
                                                                    </body>

                                                                    </html>