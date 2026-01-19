#!/bin/bash

echo "Checking if Cassandra is up and running ..."
# Try to connect on Cassandra CQLSH port 9042 using bash native TCP connection
timeout 1 bash -c 'cat < /dev/null > /dev/tcp/c1/9042'
cassandra_status=$?

retries=1
while (( cassandra_status != 0 )); do
  echo "Cassandra doesn't reply to requests on port 9042. Sleeping for a while and trying again... retry ${retries}"

  # Sleep for a while
  sleep 2s

  # Try again to connect to Cassandra
  echo "Checking if Cassandra is up and running ..."
  timeout 1 bash -c 'cat < /dev/null > /dev/tcp/c1/9042'
  cassandra_status=$?

  let "retries++"
done

echo "Cassandra startup completed successfully --- OK"