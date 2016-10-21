var express = require('express');
// Express no entiende por sí solo los datos que recibe de un formulario en una petición de tipo POST
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

var baseDeDatos = [
  'abraham',
  'diego',
  'gil'
];

// aquí estamos diciendo a Express que utilice el middleware de body-parser
// para recibir datos de formularios y datos en formato JSON
app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

// Express ejecuta los middleware de manera secuencial
// Un middleware no es más que una función que recibe tres parámetros
// los típicos request y response que usamos para cada ruta
// el tercero es next, una función que cuando se ejecuta, le indica a express que pase a ejecutar el siguiente middleware 
// si en nuestro middleware, no ejecutamos la función next, nuestro servidor de express se va a quedar estancado en el middleware
app.use(function (request, response, next) {
  console.log(request.url);
  next();
})

app.get('/', function (request, response) {
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

function middleware (req, res, next) {
  console.log(req.url);
  next();
}

app.get('/sintutor', middleware, function (request, response) {
  // var sinTutor = [
  //   'Gilberto Ayala',
  //   'Joshua Saucedo',
  //   'Jonathan Islas',
  //   'Fernando Valdez'
  // ];

  // en el objeto que vamos a mandar a renderizar con pug, podemos mandar todo tipo de datos
  // desde un simple string, a un arreglo de string o un arreglo de objetos

  var sinTutor = [
    { nombre: 'Gilberto Ayala', expediente: 214210143 },
    { nombre: 'Joshua Saucedo', expediente: 215205720 },
    { nombre: 'Jonathan Islas', expediente: 216216616 },
    { nombre: 'Fernando Valdez', expediente: 213215744 }
  ];

  // checar el archivo sintutor.pug para ver como se renderizó la variable anterior

  response.render('sintutor', {
    alumnos: sinTutor
  });
})

app.get('/usuarios', function (request, response) {
  response.json({
    usuarios: baseDeDatos
  });
});

app.get('/usuarios/:id', function (request, response){
  var id = request.params.id;
  var usuario = baseDeDatos[id];
  if (usuario) {
    response.status(200).json({
      usuario: baseDeDatos[id]
    });
  } else {
    response.redirect('/error');
  }
})

// ruta para renderizar un formulario de login
app.get('/login', function (request, response) {
  response.render('login');
});

// tenemos que definir una ruta de tipo POST para el login,
// esto es para que los datos se envíen con mayor seguridad
app.post('/login', function (request, response) {
  // para acceder a los datos enviados del formulario, accedemos a la propiedad body del objeto request
  console.log(request.body);
  // los datos del formulario van a estar disponibles dentro de la propiedad body del objeto request
  // de acuerdo al atributo name que les pusimos en su definición en HTML/pug [ver login.pug]
  var correo = 'abraham@csipro.xyz';
  var password = 'scrum';

  // una simple validación, si el correo y el password que recibimos desde el formulario
  // coinciden con los que tenemos en una base de datos, mandamos al usuario un estado de que el login fue exitoso
  // el ejemplo, aunque muy burdo, sólo es demostrativo
  if (request.body.correo === correo && request.body.password === password) {
    response.send('Estás autenticado')
  } else {
    response.send('Tus credenciales son incorrectas');
  }
})

app.listen(3000, function () {
  console.log('Estamos escuchando en el puerto 3000');
});