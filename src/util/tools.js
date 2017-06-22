const data = require('../../server/conf/relations.json');
function reObject(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object' && !obj[key].id) {
            reObject(obj[key]);
        }
        if(typeof obj[key] === 'object' && obj[key].id) {
            console.log(path);
        }
    }
}
reObject(data.app);
