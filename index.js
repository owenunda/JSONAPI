// creando una API con node

const path = require("path")
const http = require('http');
const fs = require('fs/promises');


const PORT = 8000;

const app = http.createServer( async(request, Response) =>{
  // dentro del objeto request podemos leer el metodo de la peticion
  // GET > POST > PUT > DELETE
  
  const requestMethod = request.method;
  const requesturl = request.url
  // leer la ruta y el metodo de la peticion
  // responder el data.json cuando se realize un GET al enpoint /api/v1/tasks
  console.log(requestMethod);
  if (requesturl === "/api/v1/tasks") {
    if(requestMethod=== "GET"){
      // respondo data.json
      // obtener la ruta del data.json
      const dataPath = path.resolve("./data.json")
      const jsonFile = await fs.readFile(dataPath, "utf-8") // cuando es promesa acepta dos parametros, que son la ruta y la codificacion
      Response.setHeader("content-type", "application/json")
      Response.writeHead("200")
      Response.write(jsonFile)
    }
    if (requestMethod === "POST") {
    request.on("data", async (data) =>{
      const parse = JSON.parse(data)
      parse.id = new Date()
      console.log(parse)
      const jsonPath = path.resolve("./data.json") // obtengo la direccion del data.json
      const jsonFile = await fs.readFile(jsonPath, "utf-8") // leo la info del data.json
      const jsonData = JSON.parse(jsonFile) // lo convertimos a un objeto
      jsonData.push(parse) // al objeto le hacemos un push para que se añada la nueva tarea
      const jsonFinaly = JSON.stringify(jsonData) // lo convertimos en cadena
    //console.log(jsonFinaly);
      fs.writeFile(jsonPath, jsonFinaly) // sobreescribimos el archivo con la nueva tarea ya añadida
    })
    
    }
    if (requestMethod === "PUT") {
      request.on("data", async (data) =>{
        const parse = JSON.parse(data)
        const jsonPath = path.resolve("data.json")
        const jsonfile = await fs.readFile(jsonPath, "utf-8")
        const jsonObject = JSON.parse(jsonfile)
        const jsonFilter = jsonObject.find( object => object.id === parse.id )
        jsonFilter.status = parse.status
        const jsonFinaly = JSON.stringify(jsonObject)
          fs.writeFile(jsonPath, jsonFinaly) 
      })
    }
    if (requestMethod === "DELETE") {
      request.on("data", async (data) =>{
        const parse = JSON.parse(data)
        const jsonPath = path.resolve("data.json")
        const jsonfile = await fs.readFile(jsonPath, "utf-8")
        const jsonObject = JSON.parse(jsonfile)
        const jsonFilter = jsonObject.filter( object => object.id !== parse.id )
        console.log(jsonFilter);
        const jsonFinaly = JSON.stringify(jsonFilter)
          fs.writeFile(jsonPath, jsonFinaly) 
      })
    }
  } else{
    Response.writeHead("503") // me va a dejar poner un estado de la respuesta
  }
  //console.log(requestMethod, requesturl);
  // ya que saben como leer la  ruta de la peticion, el metodo de la peticion, obtener la informacion que se envia por el body
  // 1. cuando se haga un post seria agregar el elemento al JSON Y responder un status 201 > created
  // 2. cuando se haga un PUT solamente se enviara por el body {STATUS: true} se envia el id y se envia la data
  // -------actualizar el elemneto y responder un status  > investigar con que estado se va a responder
  // 3 cuando se haga un delete  eliminar el elemento del json y responder  > investigar con que estado se va a responder
  Response.end()
});

app.listen(PORT);
console.log("servidor funcionando al 100%")
