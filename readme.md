## Endpoints
- **`/inactiveContacts`**<br>
Returns inactive contacts.<br>
Filtering can be applied using `inactiveSince` query param which accepts date time in string or unix time.<br>
Example: `/inactiveDeals?inactiveSince=2021-10-22T17:07:50.106Z` or `/inactiveDeals?inactiveSince=1634922470106`

- **`/inactiveDeals`**<br>
Returns inactive deals.<br>
The results exclude deals with stages `closedwon` or `closedlost`.<br>
Filtering can be applied using `inactiveSince` query param which accepts date time in string or unix time.<br>
Example: `/inactiveDeals?inactiveSince=2021-10-22T17:07:50.106Z` or `/inactiveDeals?inactiveSince=1634922470106`

## Steps to run
- Provide your hubspot API key in `app.js`
- cmd `npm install`
- cmd `node app.js`<br>
App will start at `localhost:3000`