package com.betsoft.casino.mp.web.service;

import com.betsoft.casino.mp.data.service.ServerConfigService;
import com.betsoft.casino.mp.service.SingleNodeRoomInfoService;
import com.betsoft.casino.mp.web.IMessageSerializer;
import com.betsoft.casino.mp.web.socket.BotGameWebSocketHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

public class BotService {
    private static final Logger LOG = LogManager.getLogger(BotService.class);

    private final SingleNodeRoomInfoService singleNodeRoomInfoService;
    private final ServerConfigService serverConfigService;
    private final IMessageSerializer serializer;
    private final BotGameWebSocketHandler handler;

    public BotService(SingleNodeRoomInfoService singleNodeRoomInfoService, ServerConfigService serverConfigService,
            IMessageSerializer serializer, BotGameWebSocketHandler handler) {
        this.singleNodeRoomInfoService = singleNodeRoomInfoService;
        this.serverConfigService = serverConfigService;
        this.serializer = serializer;
        this.handler = handler;
    }

    private Map<String, Object> bots = new HashMap<>();

    @PostConstruct
    private void init() {
        LOG.info("BotService stubbed and disabled.");
    }

}
