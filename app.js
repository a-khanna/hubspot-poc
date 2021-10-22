const express = require('express');
const hubspot = require('@hubspot/api-client');

const app = express();
const port = 3000;
const hubspotClient = new hubspot.Client({ "apiKey": "" }); // add hubspot api key here

async function getInactiveData(clientMethod, lastModifiedPropertyName, inactiveSince, additionalFilters = []) {
    let sinceDate = new Date(isNaN(inactiveSince) ? inactiveSince : parseInt(inactiveSince));
    let sinceTime = sinceDate.getTime();
    if (isNaN(sinceTime))
        throw new Error("inactiveSince date is incorrect");

    let result = [];
    let dealsResponse;
    let after = undefined;
    const publicObjectSearchRequest = {
        filterGroups: [{
            filters: [
                {
                    propertyName: lastModifiedPropertyName,
                    operator: "LTE",
                    value: sinceTime
                },
                ...additionalFilters
            ]
        }], 
        limit: 50,
        after: after
    };
    do {
        try {
            dealsResponse = await clientMethod(publicObjectSearchRequest);
            result.push(...dealsResponse.body.results);
            after = dealsResponse.body.paging?.next?.after;
        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e);
            throw e;
        }
    }
    while (dealsResponse.body.paging?.next?.after);
    return result;
}

app.get('/inactiveContacts', async (req, res) => {
    let result;
    try {
        result = await getInactiveData(hubspotClient.crm.contacts.searchApi.doSearch, "lastmodifieddate", req.query.inactiveSince);
    } catch (e) {
        res.status(400).send(e.message);
    }
    res.send(result);
});

app.get('/inactiveDeals', async (req, res) => {
    let result;
    const additionalFilters = [
        {
            propertyName: "dealstage",
            operator: "NEQ",
            value: "closedwon"  
        },
        {
            propertyName: "dealstage",
            operator: "NEQ",
            value: "closedlost"  
        }
    ];
    try {
        result = await getInactiveData(hubspotClient.crm.deals.searchApi.doSearch, "hs_lastmodifieddate", req.query.inactiveSince, additionalFilters);
    } catch (e) {
        res.status(400).send(e.message);
    }
    res.send(result);
});

app.listen(port, () => {
    console.log(`hubspot-poc listening at http://localhost:${port}`);
});