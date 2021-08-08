$.ajaxSetup({
    headers: {
        // 'token': getQueryString('token')
    },
    success(res){
        console.log(res)
    },
    fail(err){
        console.log(err)
    }
});
let urlHost = 'https://47.99.183.98:8090/'

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}


function fetch(url, data, type = 'POST') {
    return new Promise((resolve, enject) => {
        $.ajax({
            type: type,
            url:  url,
            async: true,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            success: resolve,
            fail: enject
        });
    })
}
