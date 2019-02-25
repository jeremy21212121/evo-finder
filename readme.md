# Evo-finder

A re-implementation of evo.ca/find-a-car using mapbox. This implementation shows the 10 cars closest to your location (as the crow flies, compensating for the curvature of the earth).

This will be part of a planned "evo-sniper" service that will auto-book a car for you when one is dropped off nearby. This is a for-fun project, making something I would like to use.

## note

As currently configured, this requires the use of my [evo-api-wrapper](https://github.com/jeremy21212121/evo-api-wrapper) to proxy calls to the evo API. This is because the [evo api](https://evo.ca/api/Cars.aspx) response doesn't include a CORS header and, as such, cannot be used in a cross-domain manner.

If you want to try it without running the backend, check out the "demo" branch. It calls to the ```demo.json``` file instead of the real api.
