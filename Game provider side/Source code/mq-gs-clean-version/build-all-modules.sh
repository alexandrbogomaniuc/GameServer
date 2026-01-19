./install-gsn-casino-project.sh
cd ./rng
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ./annotations/
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ./kryo-validator/
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ./sb-utils/
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ./utils/
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ./common-promo/
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ./common
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ./cassandra-cache/cache/
mvn install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
cd ..
cd ..