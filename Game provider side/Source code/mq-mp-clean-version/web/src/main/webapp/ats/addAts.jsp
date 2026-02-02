<%@ page import="com.dgphoenix.casino.common.util.string.StringUtils" %>
    <%@ page import="com.betsoft.casino.mp.config.WebSocketRouter" %>
        <%@ page import="com.betsoft.casino.mp.model.*" %>
            <%@ page import="com.betsoft.casino.mp.service.BotConfigInfoService" %>
                <%@ page import="com.betsoft.casino.mp.model.bots.BotConfigInfo" %>
                    <%@ page import="java.util.*" %>
                        <%@ page import="com.betsoft.casino.mp.model.bots.TimeFrame" %>
                            <%@ page import="java.time.LocalTime" %>
                                <%@ page import="java.time.DayOfWeek" %>

                                    <!DOCTYPE HTML>
                                    <html>

                                    <head>
                                        <meta charset="utf-8">
                                        <title>ATS Admin Panel</title>
                                        <style>
                                            body {
                                                margin: 0;
                                                background-color: #dcdcdc;
                                            }

                                            div {
                                                font-size: 20px;
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
                                        <h1>ATS Admin Panel</h1>
                                        <h2>Add new/Edit Ats</h2>
                                        <hr>
                                        <form action="listAts.jsp">
                                            <input type="submit" value="Back">
                                        </form>
                                        <hr>
                                        <form>
                                            <% BotConfigInfoService
                                                botConfigInfoService=WebSocketRouter.getApplicationContext().getBean(BotConfigInfoService.class);
                                                String action=request.getParameter("action"); boolean createAction="add"
                                                .equals(action); String idParam=request.getParameter("id");
                                                BotConfigInfo botInfo=new BotConfigInfo(0, 0, new HashSet<GameType>(),
                                                false, "", "", "", null, null, null, null, null, null);

                                                if (!StringUtils.isTrimmedEmpty(idParam)) {
                                                botInfo = botConfigInfoService.get(Long.parseLong(idParam));
                                                }
                                                if (botInfo == null) {
                                                throw new IllegalArgumentException("Bot with id=" + idParam + " not
                                                found");
                                                }

                                                TimeFrame timeFrame = null;
                                                if(botInfo.getTimeFrames() != null &&
                                                !botInfo.getTimeFrames().isEmpty()) {
                                                timeFrame = botInfo.getTimeFrames().iterator().next();
                                                }

                                                String startTime="";
                                                String endTime="";
                                                if(timeFrame != null) {
                                                LocalTime sTime = timeFrame.getStartTime();
                                                if(sTime == null) sTime = LocalTime.of(0, 0, 0, 0);
                                                startTime = sTime.toString();
                                                LocalTime eTime = timeFrame.getEndTime();
                                                if(eTime == null) eTime = LocalTime.of(23, 59, 59, 999);
                                                endTime = eTime.toString();
                                                }

                                                double dsShootingRate = 1;
                                                double maShootingRate = 1;
                                                double sxShootingRate = 0;
                                                if(botInfo.getShootsRates() != null ) {
                                                Double val =
                                                botInfo.getShootsRates().get(GameType.BG_DRAGONSTONE.getGameId());
                                                if(val != null) dsShootingRate = val;
                                                val =
                                                botInfo.getShootsRates().get(GameType.BG_MISSION_AMAZON.getGameId());
                                                if(val != null) maShootingRate = val;
                                                val = botInfo.getShootsRates().get(GameType.BG_SECTOR_X.getGameId());
                                                if(val != null) sxShootingRate = val;
                                                }

                                                double dsBulletRate = 1;
                                                double maBulletRate = 1;
                                                double sxBulletRate = 0.9;
                                                if(botInfo.getBulletsRates() != null ) {
                                                Double val =
                                                botInfo.getBulletsRates().get(GameType.BG_DRAGONSTONE.getGameId());
                                                if(val != null) dsBulletRate = val;
                                                val =
                                                botInfo.getBulletsRates().get(GameType.BG_MISSION_AMAZON.getGameId());
                                                if(val != null) maBulletRate = val;
                                                val = botInfo.getBulletsRates().get(GameType.BG_SECTOR_X.getGameId());
                                                if(val != null) sxBulletRate = val;
                                                }
                                                %>
                                                <div>ATS type:
                                                    <select id="bankId" name="bankId" <%=createAction ? "" : "disabled"
                                                        %>>
                                                        <option value="6274">MQB ATS(6274 and 6275 bank)</option>
                                                        <option value="271" <%=botInfo.isFake() ? "selected" : "" %>
                                                            >STUB ATS(271 bank only)</option>
                                                    </select>
                                                </div>
                                                <br>
                                                <div>Username <input id="username" type="text" name="username"
                                                        value="<%=botInfo.getUsername()%>" <%=createAction ? ""
                                                        : "disabled" %>></div>
                                                <br>
                                                <div>Password <input id="password" type="text" name="password"
                                                        value="<%=botInfo.getPassword()%>"></div>
                                                <br>
                                                <div>MQ Nickname <input id="mqNickName" type="text" name="mqNickname"
                                                        value="<%=botInfo.getMqNickname()%>"></div>
                                                <br>
                                                <div>MQC<input id="mqMqc" type="text" name="mqMqc"
                                                        value="<%=botInfo.getMqcBalance()%>" disabled></div>
                                                <br>
                                                <div>MMC<input id="mqMmc" type="text" name="mqMmc"
                                                        value="<%=botInfo.getMmcBalance()%>" disabled></div>
                                                <br>
                                                <div>Active <input id="active" type="checkbox" name="active"
                                                        <%=botInfo.isActive() ? "checked" : "" %>></div>
                                                <br>
                                                <div>Start Time <input id="startTime" type="text" name="startTime"
                                                        value="<%=startTime%>"> From: 00:00, Till: 23:59:59.999</div>
                                                <br>
                                                <div>End Time <input id="endTime" type="text" name="endTime"
                                                        value="<%=endTime%>"> From: 00:00, Till: 23:59:59.999</div>
                                                <br>
                                                <fieldset>
                                                    <div>
                                                        <input id="<%=DayOfWeek.MONDAY%>" type="checkbox"
                                                            name="<%=DayOfWeek.MONDAY%>" <%=timeFrame==null ||
                                                            timeFrame.daysOfWeekContains(DayOfWeek.MONDAY) ? "checked"
                                                            : "" %>>
                                                        <%=DayOfWeek.MONDAY%>
                                                    </div>
                                                    <div>
                                                        <input id="<%=DayOfWeek.TUESDAY%>" type="checkbox"
                                                            name="<%=DayOfWeek.TUESDAY%>" <%=timeFrame==null ||
                                                            timeFrame.daysOfWeekContains(DayOfWeek.TUESDAY) ? "checked"
                                                            : "" %>>
                                                        <%=DayOfWeek.TUESDAY%>
                                                    </div>
                                                    <div>
                                                        <input id="<%=DayOfWeek.WEDNESDAY%>" type="checkbox"
                                                            name="<%=DayOfWeek.WEDNESDAY%>" <%=timeFrame==null ||
                                                            timeFrame.daysOfWeekContains(DayOfWeek.WEDNESDAY)
                                                            ? "checked" : "" %>>
                                                        <%=DayOfWeek.WEDNESDAY%>
                                                    </div>
                                                    <div>
                                                        <input id="<%=DayOfWeek.THURSDAY%>" type="checkbox"
                                                            name="<%=DayOfWeek.THURSDAY%>" <%=timeFrame==null ||
                                                            timeFrame.daysOfWeekContains(DayOfWeek.THURSDAY) ? "checked"
                                                            : "" %>>
                                                        <%=DayOfWeek.THURSDAY%>
                                                    </div>
                                                    <div>
                                                        <input id="<%=DayOfWeek.FRIDAY%>" type="checkbox"
                                                            name="<%=DayOfWeek.FRIDAY%>" <%=timeFrame==null ||
                                                            timeFrame.daysOfWeekContains(DayOfWeek.FRIDAY) ? "checked"
                                                            : "" %>>
                                                        <%=DayOfWeek.FRIDAY%>
                                                    </div>
                                                    <div>
                                                        <input id="<%=DayOfWeek.SATURDAY%>" type="checkbox"
                                                            name="<%=DayOfWeek.SATURDAY%>" <%=timeFrame==null ||
                                                            timeFrame.daysOfWeekContains(DayOfWeek.SATURDAY) ? "checked"
                                                            : "" %>>
                                                        <%=DayOfWeek.SATURDAY%>
                                                    </div>
                                                    <div>
                                                        <input id="<%=DayOfWeek.SUNDAY%>" type="checkbox"
                                                            name="<%=DayOfWeek.SUNDAY%>" <%=timeFrame==null ||
                                                            timeFrame.daysOfWeekContains(DayOfWeek.SUNDAY) ? "checked"
                                                            : "" %>>
                                                        <%=DayOfWeek.SUNDAY%>
                                                    </div>
                                                </fieldset>
                                                <br>
                                                <fieldset>
                                                    <legend>MQ BTG WORLD</legend>
                                                    <div>
                                                        <input type="checkbox" id="BG_DRAGONSTONE" name="dragonstone"
                                                            <%=botInfo.getAllowedGames().contains(GameType.BG_DRAGONSTONE)
                                                            ? "checked" : "" %>>
                                                        <label for="BG_DRAGONSTONE">Dragonstone</label>
                                                    </div>
                                                    <div>
                                                        <input type="checkbox" id="BG_MISSION_AMAZON" name="amazon"
                                                            <%=botInfo.getAllowedGames().contains(GameType.BG_MISSION_AMAZON)
                                                            ? "checked" : "" %>>
                                                        <label for="BG_MISSION_AMAZON">Mission Amazon</label>
                                                    </div>
                                                    <div>
                                                        <input type="checkbox" id="BG_SECTOR_X" name="maxcrash"
                                                            <%=botInfo.getAllowedGames().contains(GameType.BG_SECTOR_X)
                                                            ? "checked" : "" %>>
                                                        <label for="BG_SECTOR_X">Sector X</label>
                                                    </div>
                                                    <div>
                                                        <input type="checkbox" id="BG_MAXCRASHGAME" name="maxcrash"
                                                            <%=botInfo.getAllowedGames().contains(GameType.BG_MAXCRASHGAME)
                                                            ? "checked" : "" %>>
                                                        <label for="BG_MAXCRASHGAME">Maxcrash</label>
                                                    </div>
                                                </fieldset>
                                                <br>
                                                <fieldset>
                                                    <legend>Allowed Banks</legend>
                                                    <div>
                                                        <input type="checkbox" id="MMC_6274" name="MMC_6274"
                                                            <%=botInfo.getAllowedBankIds().contains(BotConfigInfo.MMC_BankId)
                                                            ? "checked" : "" %>>
                                                        <label for="MMC_6274">MMC(6274)</label>
                                                        <div><input id="MMC_6274_AVAILABLE_VALUES" type="text"
                                                                name="MMC_6274_AVAILABLE_VALUES"
                                                                value="<%=botInfo.getAllowedRoomValuesSet(BotConfigInfo.MMC_BankId)%>">
                                                            Example: [100, 200]</div>
                                                    </div>
                                                    <div>
                                                        <input type="checkbox" id="MQC_6275" name="MQC_6275"
                                                            <%=botInfo.getAllowedBankIds().contains(BotConfigInfo.MQC_BankId)
                                                            ? "checked" : "" %>>
                                                        <label for="MQC_6275">MQC(6275)</label>
                                                        <div><input id="MQC_6275_AVAILABLE_VALUES" type="text"
                                                                name="MQC_6275_AVAILABLE_VALUES"
                                                                value="<%=botInfo.getAllowedRoomValuesSet(BotConfigInfo.MQC_BankId)%>">
                                                            Example: [100, 200]</div>
                                                    </div>
                                                </fieldset>
                                                <fieldset>
                                                    <legend>Bullet Rates</legend>
                                                    <div>Dragonstone<input id="BG_DRAGONSTONE_BULLET_RATE" type="text"
                                                            name="BG_DRAGONSTONE_BULLET_RATE" value="<%=dsBulletRate%>">
                                                        From: 0, Till: 1</div>
                                                    <br>
                                                    <div>Mission Amazon<input id="BG_MISSION_AMAZON_BULLET_RATE"
                                                            type="text" name="BG_MISSION_AMAZON_BULLET_RATE"
                                                            value="<%=maBulletRate%>"> From: 0, Till: 1</div>
                                                    <br>
                                                    <div>Sector X<input id="BG_SECTOR_X_BULLET_RATE" type="text"
                                                            name="BG_SECTOR_X_BULLET_RATE" value="<%=sxBulletRate%>">
                                                        From: 0, Till: 1</div>
                                                    <br>
                                                </fieldset>
                                                <fieldset>
                                                    <legend>Shoot Rates</legend>
                                                    <div>Dragonstone<input id="BG_DRAGONSTONE_SHOOTING_RATE" type="text"
                                                            name="BG_DRAGONSTONE_SHOOTING_RATE"
                                                            value="<%=dsShootingRate%>"> From: 0, Till: 1</div>
                                                    <br>
                                                    <div>Mission Amazon<input id="BG_MISSION_AMAZON_SHOOTING_RATE"
                                                            type="text" name="BG_MISSION_AMAZON_SHOOTING_RATE"
                                                            value="<%=maShootingRate%>"> From: 0, Till: 1</div>
                                                    <br>
                                                    <div>Sector X<input id="BG_SECTOR_X_SHOOTING_RATE" type="text"
                                                            name="BG_SECTOR_X_SHOOTING_RATE"
                                                            value="<%=sxShootingRate%>"> From: 0, Till: 1</div>
                                                    <br>
                                                </fieldset>
                                                <hr>
                                                <input type="button" value="<%=createAction ? " Create" : "Update" %>"
                                                onclick="doAction()">
                                        </form>
                                        <script>
                                            function doAction() {
                                                const bankId = document.getElementById("bankId").value;
                                                const username = document.getElementById("username").value;
                                                const password = document.getElementById("password").value;
                                                const mqNickName = document.getElementById("mqNickName").value;
                                                const active = document.getElementById("active").checked;
                                                const startTime = document.getElementById("startTime").value;
                                                const endTime = document.getElementById("endTime").value;
                                                const days = [];
                                                if (document.getElementById("<%=DayOfWeek.MONDAY%>").checked) days.push('1');
                                                if (document.getElementById("<%=DayOfWeek.TUESDAY%>").checked) days.push('2');
                                                if (document.getElementById("<%=DayOfWeek.WEDNESDAY%>").checked) days.push('3');
                                                if (document.getElementById("<%=DayOfWeek.THURSDAY%>").checked) days.push('4');
                                                if (document.getElementById("<%=DayOfWeek.FRIDAY%>").checked) days.push('5');
                                                if (document.getElementById("<%=DayOfWeek.SATURDAY%>").checked) days.push('6');
                                                if (document.getElementById("<%=DayOfWeek.SUNDAY%>").checked) days.push('7');
                                                const games = [];
                                                if (document.getElementById("BG_DRAGONSTONE").checked) games.push('<%=GameType.BG_DRAGONSTONE.getGameId()%>');
                                                if (document.getElementById("BG_MISSION_AMAZON").checked) games.push('<%=GameType.BG_MISSION_AMAZON.getGameId()%>');
                                                if (document.getElementById("BG_SECTOR_X").checked) games.push('<%=GameType.BG_SECTOR_X.getGameId()%>');
                                                if (document.getElementById("BG_MAXCRASHGAME").checked) games.push('<%=GameType.BG_MAXCRASHGAME.getGameId()%>');
                                                const bankIds = [];
                                                if (document.getElementById("MMC_6274").checked) bankIds.push('6274');
                                                if (document.getElementById("MQC_6275").checked) bankIds.push('6275');
                                                const v6274 = document.getElementById("MMC_6274_AVAILABLE_VALUES").value;
                                                const v6275 = document.getElementById("MQC_6275_AVAILABLE_VALUES").value;
                                                const dsBR = document.getElementById("BG_DRAGONSTONE_BULLET_RATE").value;
                                                const maBR = document.getElementById("BG_MISSION_AMAZON_BULLET_RATE").value;
                                                const sxBR = document.getElementById("BG_SECTOR_X_BULLET_RATE").value;
                                                const dsSR = document.getElementById("BG_DRAGONSTONE_SHOOTING_RATE").value;
                                                const maSR = document.getElementById("BG_MISSION_AMAZON_SHOOTING_RATE").value;
                                                const sxSR = document.getElementById("BG_SECTOR_X_SHOOTING_RATE").value;
                                                const link = 'add.jsp?bankId=' + encodeURIComponent(bankId) + '&username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) + '&mqNickName=' + encodeURIComponent(mqNickName) + '&active=' + encodeURIComponent(active) + '&startTime=' + encodeURIComponent(startTime) + '&endTime=' + encodeURIComponent(endTime) + '&days=' + days + '&games=' + games + '&bankIds=' + bankIds + '&values6274=' + encodeURIComponent(v6274) + '&values6275=' + encodeURIComponent(v6275) + '&dsBR=' + encodeURIComponent(dsBR) + '&maBR=' + encodeURIComponent(maBR) + '&sxBR=' + encodeURIComponent(sxBR) + '&dsSR=' + encodeURIComponent(dsSR) + '&maSR=' + encodeURIComponent(maSR) + '&sxSR=' + encodeURIComponent(sxSR) + '&botId=' + <%=botInfo.getId() %>;
                                                const xhr = new XMLHttpRequest();
                                                xhr.open('POST', link);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.onload = function () {
                                                    if (xhr.status === 200) { alert(xhr.response); window.location.reload(); }
                                                    else { alert('Error: ' + xhr.response); }
                                                };
                                                xhr.send();
                                            }
                                        </script>
                                    </body>

                                    </html>