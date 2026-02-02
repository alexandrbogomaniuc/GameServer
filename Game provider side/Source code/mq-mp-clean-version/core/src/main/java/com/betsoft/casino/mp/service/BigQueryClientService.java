package com.betsoft.casino.mp.service;

import com.betsoft.casino.mp.model.*;
import com.betsoft.casino.mp.model.room.IRoom;
import com.dgphoenix.casino.common.util.Pair;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * No-Op stub for BigQueryClientService.
 * Replaces the original implementation that depended on google-cloud-bigquery.
 */
@Service
public class BigQueryClientService implements IAnalyticsDBClientService {
    private static final Logger LOG = LogManager.getLogger(BigQueryClientService.class);

    @PostConstruct
    public void init() {
        LOG.info("init: BigQuery stub initialized (BigQuery is DISABLED).");
    }

    @Override
    public List<Map<String, Object>> prepareRoomsPlayers(List<IRMSRoom> trmsRooms, int serverId) {
        return new ArrayList<>();
    }

    @Override
    public boolean saveRoomsPlayers(List<Map<String, Object>> roomsPlayersRows) {
        return true;
    }

    @Override
    public List<Map<String, Object>> prepareRoundResult(List<Pair<ISeat, IRoundResult>> seatsRoundResultsPairs,
            IRoom room) {
        return new ArrayList<>();
    }

    @Override
    public List<Map<String, Object>> prepareBattlegroundRoundResults(
            List<Pair<ISeat, IRoundResult>> seatsRoundResultsPairs, IRoom room) {
        return new ArrayList<>();
    }

    @Override
    public boolean saveRoundResults(List<Map<String, Object>> rows) {
        return true;
    }
}
