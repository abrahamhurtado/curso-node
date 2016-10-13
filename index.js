// require es una función para importar un módulo de node.js
// a esta función se le pasa el nombre del módulo a importar
// y este se busca como nombre en un package.json dentro de node_modules
var express = require('express');

// instancia de express
var app = express();

// cada instancia de express tiene unos settings que podemos modificar
// con el método set. Aquí estamos indicándole que pug es nuestro lenguaje de vistas
// y que las vistas están en la carpeta /views
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

var baseDeDatos = [
  'abraham',
  'diego',
  'gil'
];

// __dirname es una variable global en node
// su valor es la dirección de la carpeta donde se ejecuta el script
console.log(__dirname);

// cuando usamos el método use, es porque le estamos pasando un middlware
// un middleware es una función que intercepta las peticiones y realiza operaciones
// sobre ellas. Aquí estamos usando un middleware para servir archivos estáticos
// los archivos que tenemos en la carpeta /public.
app.use('/static', express.static(__dirname + '/public'));

// definimos una ruta en express con el método get
// el primer parámetro es la ruta que queremos que el servidor escuche y responda a eventos
// el segundo parámetro es una función que recibe como argumentos dos objetos
// 1. request -> trae toda la información de la petición al servidor (parámetros, datos de formulario, cookies, etc)
// 2. response -> con este objeto podemos responder a las peticiones de los usuarios de múltiples maneras
app.get('/', function (request, response) {
  // Un método de respuesta es .send, podemos pasarle cualquier valor para que lo envíe como respuesta
  // response.send('Hola mundo');
  // Otro método de respuesta es .sendFile, que recibe la ubicación absoluta del archivo que queremos enviar como respuesta
  // response.sendFile(__dirname + '/index.html');
  // El método de respuesta .render, sólo me sirve cuando estoy usando un lenguaje de template, como pug.
  // A la función .render le indico primero el nombre de la vista que quiero renderizar para que la busque en mi carpeta de vistas
  // y luego le puedo pasar un objeto con datos para utilizarlos en el renderizado de la vista
  response.render('index', {
    nombre: 'Joshua'
  });
});

app.get('/admin', function (request, response) {
  response.render('admin');
});

app.get('/error', function (request, response) {
  response.render('error');
})

app.get('/usuarios', function (request, response) {
  response.json({
    usuarios: baseDeDatos
  });
});

// podemos definir parámetros para nuestras rutas con la notación `:id`,
app.get('/usuarios/:id', function (request, response){
  // podemos acceder a los parámetros de la petición con la siguiente línea de código
  // request.params[nombreDelParámetro]
  var id = request.params.id;
  var usuario = baseDeDatos[id];
  if (usuario) {
    // en las respuestas, yo puedo enviar códigos de estado de HTTP para indicar si las respuestas que envío al cliente
    // son correctas o incorrectas (hubo un error)
    // el método .json de la respuesta, recibe un argumento, que puede ser cualquier clase de dato y lo transforma a JSON para enviarlo como respuesta al cliente
    // es como si usáramos el método JSON.stringify de los navegadores (pruébenlo en chrome o así)
    response.status(200).json({
      usuario: baseDeDatos[id]
    });
  } else {
    // Manejo de errores
    // por ejemplo, si en la petición hubo una respuesta inválida, esta se indica con el código de estado HTTP. 
    // Este método hay que usarlo cuando estemos desarrollando REST APIs.
    // response.status(404).json({
    //   error: 'No existe el usuario con el id especificado'
    // });
    // puedo renderizar un error, sin embargo, eso no cambia la url a la que quise acceder. Así que no es tan recomendado.
    // response.render('error');
    // lo que si puede hacerse, es redireccionar al usuario a la ruta de /error. Podemos aplicar esta cuando se intente acceder a una ruta a la que el usuario no tiene permiso de acceder (rutas de administrador, por ejemplo).
    response.redirect('/error');
  }
})

// Tenemos que indicarle a express un puerto de la computadora a la cual pueda atar la instancia y podamos acceder a nuestro server
app.listen(3000, function () {
  console.log('Estamos escuchando en el puerto 3000');
});