package com.dgphoenix.casino.gs;

import com.dgphoenix.casino.GeoIp;
import com.dgphoenix.casino.account.AccountManager;
import com.dgphoenix.casino.cassandra.CassandraPersistenceManager;
import com.dgphoenix.casino.cassandra.persist.CassandraServerInfoPersister;
import com.dgphoenix.casino.common.cache.LoadBalancerCache;
import com.dgphoenix.casino.common.cache.ServerConfigsCache;
import com.dgphoenix.casino.common.cache.data.server.ServerCoordinatorInfoProvider;
import com.dgphoenix.casino.common.cache.data.server.ServerInfo;
import com.dgphoenix.casino.common.config.HostConfiguration;
import com.dgphoenix.casino.common.config.UtilsApplicationContextHelper;
import com.dgphoenix.casino.common.util.ITimeProvider;
import com.dgphoenix.casino.common.util.NtpTimeProvider;
import com.dgphoenix.casino.common.util.system.SystemPropertyReader;
import com.dgphoenix.casino.common.web.SharedServletExecutorService;
import com.dgphoenix.casino.system.configuration.GameServerConfiguration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * Configuration for components which can be used outside the game server.
 */
@Configuration
@PropertySource(value = { "classpath:cluster.properties",
        "classpath:common.properties" }, ignoreResourceNotFound = true)
public class SharedGameServerComponentsConfiguration {
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean
    public ServerCoordinatorInfoProvider serverIdLockerService() {
        return new ServerCoordinatorInfoProvider() {
            @Override
            public Integer getServerId() {
                return 1;
            }

            @Override
            public boolean isMaster() {
                return true;
            }

            @Override
            public Integer getMasterServerId() {
                return 1;
            }

            @Override
            public java.util.Map<Integer, ServerInfo> getServerInfos() {
                java.util.Map<Integer, ServerInfo> map = new java.util.HashMap<>();
                ServerInfo info = new ServerInfo(1);
                info.setOnline(true);
                info.setThisServer(true);
                map.put(1, info);
                return map;
            }

            @Override
            public java.util.Map<Integer, ServerInfo> getOnlineServerStates() {
                return getServerInfos();
            }
        };
    }

    @Bean
    @DependsOn("serverIdLockerService")
    public ServerConfigsCache serverConfigsCache(CassandraPersistenceManager persistenceManager,
            ServerCoordinatorInfoProvider serverIdProvider) {
        CassandraServerInfoPersister serverInfoPersister = persistenceManager
                .getPersister(CassandraServerInfoPersister.class);
        return new ServerConfigsCache(serverInfoPersister, serverIdProvider.getServerId());
    }

    @Bean
    @DependsOn("serverConfigsCache")
    public GameServerConfiguration gameServerConfiguration(GeoIp geoIp, CassandraPersistenceManager persistenceManager,
            ServerCoordinatorInfoProvider serverIdProvider) {
        return new GameServerConfiguration(ServerConfigsCache.getInstance(), geoIp, persistenceManager,
                serverIdProvider);
    }

    @Bean
    @DependsOn("serverIdLockerService")
    public HostConfiguration hostConfiguration(@Value("${CLUSTER_TYPE}") String clusterType,
            ServerCoordinatorInfoProvider serverIdProvider) {
        return new HostConfiguration(clusterType, serverIdProvider.getServerId(), ServerConfigsCache.getInstance());
    }

    @Bean
    public UtilsApplicationContextHelper utilsApplicationContextHelper() {
        return new UtilsApplicationContextHelper();
    }

    @Bean
    public com.dgphoenix.casino.common.util.ApplicationContextHelper applicationContextHelper() {
        return new com.dgphoenix.casino.common.util.ApplicationContextHelper();
    }

    @Bean
    public GeoIp geoIp() {
        return new GeoIp();
    }

    @Bean
    @DependsOn("utilsApplicationContextHelper")
    public NtpTimeProvider timeProvider() {
        return new NtpTimeProvider();
    }

    @Bean
    @DependsOn("serverIdLockerService")
    public LoadBalancerCache loadBalancerCache(CassandraPersistenceManager persistenceManager,
            GameServerConfiguration gameServerConfiguration,
            ServerCoordinatorInfoProvider serverCoordinatorInfoProvider,
            ITimeProvider timeProvider) {
        CassandraServerInfoPersister serverInfoPersister = persistenceManager
                .getPersister(CassandraServerInfoPersister.class);
        ServerInfo thisServerInfo = gameServerConfiguration.composeServerInfo(timeProvider.getTime());
        return new LoadBalancerCache(serverInfoPersister, serverCoordinatorInfoProvider, thisServerInfo);
    }

    @Bean
    public SharedServletExecutorService sharedServletExecutorService() {
        return new SharedServletExecutorService();
    }

    @Bean
    public AccountManager accountManager(GameServerConfiguration gameConfig,
            CassandraPersistenceManager persistenceManager) {
        return new AccountManager(gameConfig.getCasinoSystemType(), persistenceManager);
    }

    @Bean
    public SystemPropertyReader systemPropertyReader() {
        return new SystemPropertyReader();
    }
}
