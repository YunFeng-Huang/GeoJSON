
var layer = new Loca.HeatmapLayer({
    map: map,
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
    console.log(geoJSON,'geoJSON');
    let all = geoJSON.features.filter((v,i) => {
        v.height = 0;
        if (v.geometry.coordinates && !Array.isArray(v.geometry.coordinates[0])) {
            v.height = v.geometry.coordinates[2] || 0;
        }
        return v.geometry.type == 'Point' && i%100==0;
    }).map(v=>{
        const coordinates = v.geometry.coordinates;
        const name = v.properties.name;
        return _marker(`${v.height}`, coordinates,
            defaultIcon0, {
            'id': coordinates,
            'type': 0 // 0 默认值 1 起点 2 终点
        });
    })
    console.log(all,'all');
    // layer.setData(filter_features, {
    //     lnglat: (data) => {
    //         const coordinates = data.value.geometry.coordinates;
    //         return [coordinates[0], coordinates[1]];
    //     },
    //     value: "height",
    // }).render();

  
   
    // markerList = [startMarker, ...markerList, endMarker]
    map.add(all);
}