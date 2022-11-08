const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.ToDo("localhost:5000", grpc.credentials.createInsecure());

const text = process.argv[2];

// client.createToDo({
//     "id": 1,
//     "text": text
// }, (err, res) => {
//     if (err) throw err
//     console.log(JSON.stringify(res));
// })

// client.readToDos({}, (err, res) => {
//     if(err) throw err;
//     console.log(JSON.stringify(res));
// })

const call = client.readToDosStream()
call.on("data", item => {
    console.log("Data recieved: " + JSON.stringify(item));
})
call.on("end", e => console.log("Server end"));