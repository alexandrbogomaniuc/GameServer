package com.dgphoenix.casino.actions.enter.game;

import com.dgphoenix.casino.common.cache.BankInfoCache;
import com.dgphoenix.casino.common.cache.BaseGameCache;
import com.dgphoenix.casino.common.cache.SubCasinoCache;
import com.dgphoenix.casino.common.cache.data.bank.BankInfo;
import com.dgphoenix.casino.common.cache.data.currency.Currency;
import com.dgphoenix.casino.common.cache.data.game.BaseGameConstants;
import com.dgphoenix.casino.common.cache.data.game.GameGroup;
import com.dgphoenix.casino.common.cache.data.game.IBaseGameInfo;
import com.dgphoenix.casino.common.configuration.messages.MessageManager;
import com.dgphoenix.casino.common.util.string.StringBuilderWriter;
import com.dgphoenix.casino.common.util.string.StringUtils;
import com.dgphoenix.casino.common.util.xml.xmlwriter.Attribute;
import com.dgphoenix.casino.common.util.xml.xmlwriter.XmlWriter;
import org.apache.log4j.Logger;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

public class GameListExtAction extends Action {

    public static final String TAG_GAMES_SUITES = "GamesSuites";
    public static final String TAG_SUITES = "Suites";
    public static final String TAG_SUITE = "Suite";
    public static final String TAG_GAMES = "Games";
    public static final String TAG_GAME = "Game";

    private Logger logger = Logger.getLogger(GameListExtAction.class);

    @Override
    public ActionForward execute(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        String extBankId = request.getParameter("bankId");
        String test = request.getParameter("test");
        String showTestingGame;
        if (StringUtils.isTrimmedEmpty(test)) {
            showTestingGame = "FALSE";
        } else {
            if (test.equals("1")) {
                showTestingGame = "TRUE";
            } else {
                showTestingGame = "FALSE";
            }
        }

        Set<Long> gamesByBank = new HashSet<>(256);
        BaseGameCache gameCache = BaseGameCache.getInstance();

        long domainSubcasidoId = SubCasinoCache.getInstance().getSubCasinoByDomainName(request.getServerName()).getId();

        BankInfo bankInfo = BankInfoCache.getInstance().getBank(extBankId, domainSubcasidoId);
        boolean needAddMasterBankGamesForDefaultCurrency = true;
        BankInfo masterBankInfo = null;
        for (Currency currency : bankInfo.getCurrencies()) {
            if (bankInfo.getMasterBankId() != null && bankInfo.getMasterBankId() > 0 &&
                    bankInfo.getMasterBankId() != bankInfo.getId()) {
                gamesByBank.addAll(gameCache.getAllGamesSet(bankInfo.getMasterBankId(), currency));
                if (masterBankInfo == null) {
                    masterBankInfo = BankInfoCache.getInstance().getBankInfo(bankInfo.getMasterBankId());
                }
                if (masterBankInfo.getDefaultCurrency().equals(currency)) {
                    needAddMasterBankGamesForDefaultCurrency = false;
                }

            }
            gamesByBank.addAll(gameCache.getAllGamesSet(bankInfo.getId(), currency));
        }
        if (masterBankInfo != null && needAddMasterBankGamesForDefaultCurrency) {
            gamesByBank.addAll(gameCache.getAllGamesSet(bankInfo.getMasterBankId(),
                    masterBankInfo.getDefaultCurrency()));
        }
        List<Long> mustRemoveGames = new ArrayList<>();
        for (Long gameId : gamesByBank) {
            for (Currency currency : bankInfo.getCurrencies()) {
                IBaseGameInfo gameInfo = gameCache.getGameInfoById(bankInfo.getId(), gameId, currency);
                if (gameInfo != null) {
                    String maintenanceMode = Boolean.toString(gameInfo.isMaintenanceMode());
                    if (!showTestingGame.equalsIgnoreCase(maintenanceMode)
                            || !Boolean.parseBoolean(gameInfo.getProperty(BaseGameConstants.KEY_ISENABLED))) {
                        mustRemoveGames.add(gameId);
                    }
                    break;
                }
            }
        }
        gamesByBank.removeAll(mustRemoveGames);

        Map<Long, String> imagesURL = new HashMap<>(gamesByBank.size());
        Map<Long, GameGroup> gameGroups = new HashMap<>(gamesByBank.size());

        for (Long gameId : gamesByBank) {
            for (Currency currency : bankInfo.getCurrencies()) {
                IBaseGameInfo gameInfo = gameCache.getGameInfoById(bankInfo.getId(), gameId, currency);

                if (gameInfo != null) {
                    imagesURL.put(gameInfo.getId(), gameInfo.getProperty(BaseGameConstants.KEY_GAME_IMAGE_URL));
                    gameGroups.put(gameInfo.getId(), gameInfo.getGroup());
                    break;
                }
            }
        }
        Map<String, List<Long>> groupedGames = new HashMap<>();
        for (Long gameId : gamesByBank) {
            String groupName = gameGroups.get(gameId).getGroupName();
            groupedGames.computeIfAbsent(groupName, k -> new ArrayList<>());
            groupedGames.get(groupName).add(gameId);
        }

        String userAgent = request.getHeader("User-Agent");
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("safari")) {
            if (!userAgent.contains("chrome")) {
                response.setContentType("text/plain");
            } else {
                response.setContentType("text/xml");
            }
        } else {
            response.setContentType("text/xml");
        }

        StringBuilderWriter stringWriter = new StringBuilderWriter();
        // generate XML response
        XmlWriter xmlWriter = new XmlWriter(stringWriter);
        xmlWriter.header();
        xmlWriter.startNode(TAG_GAMES_SUITES);
        xmlWriter.startNode(TAG_SUITES);
        for (Map.Entry<String, List<Long>> groupedGamesEntry : groupedGames.entrySet()) {
            String groupName = groupedGamesEntry.getKey();
            Attribute[] attributes = new Attribute[2];
            attributes[0] = new Attribute("ID", groupName);
            attributes[1] = new Attribute("Name", groupName);
            xmlWriter.startNode(TAG_SUITE, attributes);
            xmlWriter.startNode(TAG_GAMES);
            for (Long gameId : groupedGamesEntry.getValue()) {
                attributes = new Attribute[4];
                String applicationMessage = null;
                try {
                    applicationMessage = MessageManager.getInstance()
                            .getApplicationMessage("game.name." + gameCache.getGameNameById(bankInfo.getId(), gameId));
                } catch (Exception e) {
                    logger.error("applicationMessage can't be null common-gs");
                }
//                logger.info("applicationMessage process enter");
                IBaseGameInfo gameInfo = gameCache.getGameInfoById(bankInfo.getId(), gameId, bankInfo.getDefaultCurrency());
                if (applicationMessage == null) {
//                    logger.info("applicationMessage is null");
                    if (gameInfo == null) {
                        logger.info("gameInfoTmp is null");
                    }
                    applicationMessage = gameInfo == null ? "" : gameInfo.getName();
                    if (applicationMessage == null) {
                        logger.info("applicationMessage final null");
                    }
                }
                attributes[0] = new Attribute("Name", applicationMessage);
                String extId = gameInfo == null ? null : gameInfo.getExternalId();
                if (extId == null) {
                    extId = gameId.toString();
                }
                attributes[1] = new Attribute("ID", extId);
                attributes[2] = new Attribute("ImageUrl", imagesURL.get(gameId));

                StringBuilder languages = new StringBuilder();
                List<String> langs = gameInfo == null ? Collections.emptyList() : gameInfo.getLanguages();
                int i = 1;
                for (String lang : langs) {
                    languages.append(lang).append((i == langs.size()) ? "" : ",");
                    i++;
                }
                attributes[3] = new Attribute("Languages", languages.toString());
                xmlWriter.startNode(TAG_GAME, attributes);
                xmlWriter.endNode(TAG_GAME);
            }
            xmlWriter.endNode(TAG_GAMES);
            xmlWriter.endNode(TAG_SUITE);
        }
        xmlWriter.endNode(TAG_SUITES);
        xmlWriter.endNode(TAG_GAMES_SUITES);

        //logger.info("GameListAction::game list xml:" + result);
        response.getWriter().write(stringWriter.toString());
        response.getWriter().flush();
        return mapping.findForward("success");
    }


}
