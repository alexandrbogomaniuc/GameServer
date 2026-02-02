<%@ page import="com.betsoft.casino.mp.config.WebSocketRouter" %>
    <%@ page import="com.betsoft.casino.mp.model.bots.BotConfigInfo" %>
        <%@ page import="java.util.*" %>
            <%@ page import="com.betsoft.casino.mp.model.bots.ActiveBot" %>
                <%@ page import="com.betsoft.casino.mp.model.IRoomPlayerInfo" %>
                    <%@ page import="com.betsoft.casino.mp.service.*" %>
                        <%@ page import="com.betsoft.casino.mp.model.room.IRoomInfo" %>
                            <%@ page import="com.betsoft.casino.mp.model.GameType" %>
                                <%@ page import="java.math.BigDecimal" %>

                                    <!DOCTYPE HTML>
                                    <html>

                                    <head>
                                        <meta charset="utf-8">
                                        <title>Ats Admin Panel</title>
                                        <style>
                                            body {
                                                margin: 0;
                                                background-color: #dcdcdc;
                                                font-size: 25px;
                                            }

                                            h1 {
                                                text-align: center;
                                                color: white;
                                                background-color: black;
                                                padding: 0;
                                                margin: 0;
                                            }

                                            table {
                                                text-align: center;
                                            }

                                            th {
                                                color: white;
                                                background-color: black;
                                            }

                                            .active {
                                                color: green;
                                                text-decoration: underline;
                                            }

                                            .inactive {
                                                color: red;
                                                text-decoration: underline;
                                            }
                                        </style>
                                    </head>

                                    <body>
                                        <% RoomPlayerInfoService
                                            roomPlayerInfoService=WebSocketRouter.getApplicationContext().getBean(RoomPlayerInfoService.class);
                                            AbstractRoomInfoService
                                            multiNodeRoomInfoService=WebSocketRouter.getApplicationContext().getBean(MultiNodeRoomInfoService.class);
                                            AbstractRoomInfoService
                                            singleNodeRoomInfoService=WebSocketRouter.getApplicationContext().getBean(SingleNodeRoomInfoService.class);
                                            AbstractRoomInfoService
                                            bgPrivateRoomInfoService=WebSocketRouter.getApplicationContext().getBean(BGPrivateRoomInfoService.class);
                                            BotConfigInfoService
                                            botConfigInfoService=WebSocketRouter.getApplicationContext().getBean(BotConfigInfoService.class);
                                            BotManagerService
                                            botManagerService=WebSocketRouter.getApplicationContext().getBean(BotManagerService.class);
                                            Collection<BotConfigInfo> allBotConfigs = botConfigInfoService.getAll();

                                            try {
                                            String sortBy = request.getParameter("sortBy") == null ? "" :
                                            request.getParameter("sortBy");
                                            if(sortBy != null && !sortBy.isEmpty()) {
                                            final String finalSortBy = sortBy.toLowerCase();
                                            List<BotConfigInfo> sortedList = new ArrayList<BotConfigInfo>
                                                    (allBotConfigs);
                                                    Collections.sort(sortedList, new Comparator<BotConfigInfo>() {
                                                        @Override
                                                        public int compare(BotConfigInfo o1, BotConfigInfo o2) {
                                                        if ("nickname".equals(finalSortBy)) {
                                                        return o1.getMqNickname().compareTo(o2.getMqNickname());
                                                        } else if ("mqc".equals(finalSortBy)) {
                                                        long b1 = o1.getMqcBalance();
                                                        long b2 = o2.getMqcBalance();
                                                        return b1 < b2 ? -1 : (b1==b2 ? 0 : 1); } else if
                                                            ("mmc".equals(finalSortBy)) { long b1=o1.getMmcBalance();
                                                            long b2=o2.getMmcBalance(); return b1 < b2 ? -1 : (b1==b2 ?
                                                            0 : 1); } else { long id1=o1.getId(); long id2=o2.getId();
                                                            return id1 < id2 ? -1 : (id1==id2 ? 0 : 1); } } });
                                                            allBotConfigs=sortedList; } } catch (Exception e) {} %>
                                                            <h1>Ats Monitor Panel</h1>
                                                            <h3>MQ Battlegrounds Ats Monitor</h3>
                                                            <hr>
                                                            <table>
                                                                <tr>
                                                                    <th><a href="monitor.jsp?sortBy=id">Id</a></th>
                                                                    <th><a href="monitor.jsp?sortBy=nickname">MQ
                                                                            Nickname</a></th>
                                                                    <th>Status</th>
                                                                    <th>In Game</th>
                                                                    <th><a href="monitor.jsp?sortBy=mqc">MQC</a></th>
                                                                    <th><a href="monitor.jsp?sortBy=mmc">MMC</a></th>
                                                                    <th>Stub/Fake ATS</th>
                                                                    <th>Details and pendings</th>
                                                                </tr>
                                                                <% for (BotConfigInfo bot : allBotConfigs) { ActiveBot
                                                                    activeBot=botManagerService.findActiveBotByBotId(bot.getId());
                                                                    IRoomPlayerInfo roomPlayer=null;
                                                                    Collection<IRoomPlayerInfo> roomPlayers =
                                                                    roomPlayerInfoService.getByNickname(bot.getMqNickname());
                                                                    if(roomPlayers != null && !roomPlayers.isEmpty()) {
                                                                    roomPlayer = roomPlayers.iterator().next(); }
                                                                    Long roomId = (roomPlayer != null) ?
                                                                    roomPlayer.getRoomId() : (activeBot != null ?
                                                                    activeBot.getRoomId() : null);
                                                                    GameType gameType = null;
                                                                    if(roomId != null) {
                                                                    IRoomInfo roomInfo = null;
                                                                    if (multiNodeRoomInfoService != null) roomInfo =
                                                                    multiNodeRoomInfoService.getRoom(roomId);
                                                                    if (roomInfo == null && singleNodeRoomInfoService !=
                                                                    null) roomInfo =
                                                                    singleNodeRoomInfoService.getRoom(roomId);
                                                                    if (roomInfo == null && bgPrivateRoomInfoService !=
                                                                    null) roomInfo =
                                                                    bgPrivateRoomInfoService.getRoom(roomId);
                                                                    if (roomInfo != null) gameType =
                                                                    roomInfo.getGameType();
                                                                    }
                                                                    %>
                                                                    <tr>
                                                                        <td>
                                                                            <%=bot.getId()%>
                                                                        </td>
                                                                        <td>
                                                                            <%=bot.getMqNickname()%>
                                                                        </td>
                                                                        <td <%=bot.isActive() ? "class=active"
                                                                            : "class=inactive" %>><%=bot.isActive()
                                                                                ? "ON" : "OFF" %>
                                                                        </td>
                                                                        <td>
                                                                            <%=roomId !=null ? "roomId: " + roomId : ""
                                                                                %>
                                                                                <%=gameType !=null ? "game: " +
                                                                                    gameType.getGameId() + ": " +
                                                                                    gameType.name() : "" %>
                                                                        </td>
                                                                        <td>
                                                                            <%=String.format("%,.2f",
                                                                                BigDecimal.valueOf(bot.getMqcBalance()).divide(BigDecimal.valueOf(100)))%>
                                                                        </td>
                                                                        <td>
                                                                            <%=String.format("%,.2f",
                                                                                BigDecimal.valueOf(bot.getMmcBalance()).divide(BigDecimal.valueOf(100)))%>
                                                                        </td>
                                                                        <td>
                                                                            <%=bot.isFake() ? "YES" : "" %>
                                                                        </td>
                                                                        <td>
                                                                            <%= roomPlayer !=null && activeBot==null
                                                                                ? "STUCK " :""%>
                                                                                <%= roomPlayer !=null ? "Account=" +
                                                                                    roomPlayer.getId() + ";" + "BankId="
                                                                                    + roomPlayer.getBankId() + ";"
                                                                                    + "BuyIn=" +
                                                                                    roomPlayer.getRoundBuyInAmount()
                                                                                    + ";" +
                                                                                    (roomPlayer.isPendingOperation() ?
                                                                                    roomPlayer.getLastOperationInfo()
                                                                                    : "NO" ) : "NULL: NO" %>
                                                                        </td>
                                                                    </tr>
                                                                    <% } %>
                                                            </table>
                                    </body>

                                    </html>