var layer = new Loca.HeatmapLayer({
    map: map,
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
    }).setOptions({
        style: {
            radius: 16,
            color: {
                0.5: '#2c7bb6',
                0.65: '#abd9e9',
                0.7: '#ffffbf',
                0.9: '#fde468',
                1.0: '#d7191c'
            }
        }
    }).render();
}