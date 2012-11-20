# Speedtest-js

A rudimentary website that measures available network bandwidth between a
server and client, currently just in the one direction (server->client).
Client-side javascript times how long it takes for the client to download a
sufficiently large image and reports the result.  Small measures have been
taken to avoid browser and proxy caching.

Uses/depends on Node.js, Express, Jade, jQuery and Twitter Bootstrap.

## Notes/Comments

Additional code cleanup is needed as well as a better way to async loop
functions from a closure.  I currently modify JS's global namespace to make it
happen  :(

The interesting bits are mostly found in static/js/speedtest.js

