# Evo-finder

A re-implementation of evo.ca/find-a-car using mapbox. This implementation shows the X number of cars closest to your location (as the crow flies, compensating for the curvature of the earth). 

This will be part of a planned "evo-sniper" service that will auto-book a car for you when one is dropped off nearby. This is a for-fun project, making something I would like to use.

## note

As currently configured, it uses a static ```demo.json``` file to populate the cars. This is because the [evo api](https://evo.ca/api/Cars.aspx) response doesn't include a CORS header and, as such, cannot be used in a cross-domain manner.

Please see my "evo-api-wrapper" repo for a node backend that adds the CORS header to the response.
