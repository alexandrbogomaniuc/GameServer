FROM cassandra:2.1.20

# Create JMX configuration files to allow remote access without authentication
RUN echo "monitorRole  QED" > /etc/cassandra/jmxremote.password && \
    echo "controlRole  R&D" >> /etc/cassandra/jmxremote.password && \
    chmod 400 /etc/cassandra/jmxremote.password && \
    chown cassandra:cassandra /etc/cassandra/jmxremote.password

# Create access file
RUN echo "monitorRole   readonly" > /etc/cassandra/jmxremote.access && \
    echo "controlRole   readwrite" >> /etc/cassandra/jmxremote.access && \
    chmod 400 /etc/cassandra/jmxremote.access && \
    chown cassandra:cassandra /etc/cassandra/jmxremote.access

# Override cassandra-env.sh to use our JMX configuration
COPY cassandra-env-override.sh /cassandra-env-override.sh
RUN chmod +x /cassandra-env-override.sh && \
    cat /cassandra-env-override.sh >> /etc/cassandra/cassandra-env.sh
