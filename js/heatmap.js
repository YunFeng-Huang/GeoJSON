
var layer = new Loca.HeatmapLayer({
    map: map,
    visible:false
}).setOptions({
    style: {
        radius: 16,
        color: {
            0.5: "blue",
            0.65: "rgb(117,211,248)",
            0.7: "rgb(0, 255, 0)",
            0.9: "#ffea00",
            1.0: "red",
        },
    },
});
function _setlayer(geoJSON){
    let filter_features = geoJSON.features.filter(v => {
        v.height = 0;
        if (v.geometry.coordinates && !Array.isArray(v.geometry.coordinates[0])) {
            v.height = v.geometry.coordinates[2] || 0;
        }
        return v.geometry.type == 'Point';
    })

    layer.setData(filter_features, {
        lnglat: (data) => {
            const coordinates = data.value.geometry.coordinates;
            return [coordinates[0], coordinates[1]];
        },
        value: "height",
    }).render();
}