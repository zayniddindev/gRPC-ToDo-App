const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.ToDo.service,
    {
        "createToDo": createToDo,
        "readToDos": readToDos,
        "readToDosStream": readToDosStream
    });

server.start();

const todos = [];

function createToDo(call, callback) {
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem);
}

function readToDos(call, callback) { 
    callback(null, {"items": todos})
}

function readToDosStream(call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}