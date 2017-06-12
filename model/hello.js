function hello(data) {
    console.log(data.a * data.b);
    return data;
}
exports.hello = hello;

function world(data) {
    console.log(data.a * data.b);
    return data;
}
exports.world = world;