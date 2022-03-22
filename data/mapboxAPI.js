export const mapboxToken = "pk.eyJ1IjoibGZyb21lbnQiLCJhIjoiY2t4eG45YTVyMzFhcDJub2UwbDIxNWw2YSJ9.9P_j_Rw4GFlZW6V8Px7WUw";

export const getIsochrone = async (profile, center, minutes) => {
    if (!center) {
        return JSON.parse('{"features":[{"properties":{"fill":"#bf4040","fillOpacity":0.33,"fill-opacity":0.33,"fillColor":"#bf4040","color":"#bf4040","contour":3,"opacity":0.33,"metric":"time"},"geometry":{"coordinates":[[52.489958,13.362759],[52.489207,13.362009],[52.489958,13.361259],[52.490708,13.362009],[52.489958,13.362759]],"type":"Polygon"},"type":"Feature"}],"type":"FeatureCollection"}')
    }
    const baseUrl = 'https://api.mapbox.com/isochrone/v1/mapbox/';
    const url = baseUrl + `${profile}/${center.lon}%2C${center.lat}?contours_minutes=${minutes}&access_token=${mapboxToken}&polygons=true&denoise=1&generalize=20`;

    return fetch(url).then(d => d.json());
}
