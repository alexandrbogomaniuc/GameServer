package com.betsoft.casino.mp.web.socket;

import com.betsoft.casino.mp.web.GameSocketClient;
import com.betsoft.casino.mp.web.RequestStatistic;
import com.betsoft.casino.utils.ITransportObject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.FluxSink;

import java.util.Collection;

public class BotGameClient extends GameSocketClient {
    private static final Logger LOG = LogManager.getLogger(BotGameClient.class);
    private final BotGameWebSocketHandler handler;

    public BotGameClient(BotGameWebSocketHandler handler) {
        super(null, null, null, null, null, null, null);
        this.handler = handler;
    }

    // Removed ISender implementation and LocalRoomBot usage
    public void send(ITransportObject message) {
        LOG.warn("BotGameClient stubbed: send() called but ignored.");
    }

    @Override
    public WebSocketSession getSession() {
        return null;
    }

    @Override
    public void addRequestStatistic(Class requestClass, long lastRequestId, long lastServerInputDate,
            long lastClientSendDate) {

    }

    @Override
    public RequestStatistic getRequestStatistic(Class requestClass) {
        return null;
    }

    @Override
    public Collection<RequestStatistic> getRequestStatistics() {
        return null;
    }

    @Override
    public FluxSink<WebSocketMessage> sendMessage(ITransportObject message) {
        return null;
    }

    @Override
    public FluxSink<WebSocketMessage> sendMessage(WebSocketMessage message) {
        LOG.warn("Message ignored by bot stub: {}", message.getPayloadAsText());
        return null;
    }

    @Override
    public boolean isBot() {
        return true;
    }
}
