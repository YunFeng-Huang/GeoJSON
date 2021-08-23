
var layer = new Loca.HeatmapLayer({
    map: map,
    visible:false
}).setOptions({
    style: {
        radius: 8,
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
    let arr =[]
    geoJSON.features.map(v=>{
        let coordinates = v.geometry.coordinates
        arr = [...arr, ...coordinates]
    })
    layer.setData(arr, {
        lnglat: (data) => {
            return data.value;
        },
        value:(v)=>{
            return v[2];
        },
    }).render();
}