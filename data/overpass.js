 function buildQuery(areaName, sport) {
    return `[out:json][timeout:150];(area[name="${areaName}"];node(area)["sport"= "${sport}"];);out;`;
}

async function executeOverpassQuery(areaName, sport) {
    const overpassUrl = 'http://overpass-api.de/api/interpreter';
    const query =  buildQuery(areaName, sport);
    return fetch(overpassUrl + `?data=${query}`).then(data => data.json());
}

export default executeOverpassQuery;