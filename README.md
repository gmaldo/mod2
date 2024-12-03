# mod2
Implementacion de endpoints para un store en node utilizando express y persistencia en mongo.
# Librerias usadas
- dotenv
- express
- express-handlebars
- mongoose
- mongoose-paginate-v2
- passport
- passport-github2
- passport-jwt
- passport-local
- bcrypt
- jsonwebtoken

# Uso
Para instalar las librerias ```npm install```.

Para levantar el servidor correr el comando ```node src/app.js```
# Datos
Se provee un ```products.json``` con productos de muestra, se puede cargar en mongo atlas copiando y pegando.


# ENV File
Ejemplo
```
PERSISTENCE = MONGO
MONGO_URL = mongodb+srv://usuer:password@cluster0.flm1f.mongodb.net/entrega1?retryWrites=true&w=majority&appName=Cluster0
GUIHUB_CLIENTID = xxxxxxxxxxxx
GITHUB_CLIENTSECRET = xxxxxxxxxxx
```
donde MONGOURL es el string de conexion a mongo sacado de Mongo Atlas
donde GUIHUB_CLIENTID y GITHUB_CLIENTSECRET son provistos como app de github para autenticacion.
# Mongo Atlas config
Al conectarse a mongo atlas desde una IP nueva, debe autorizarce dicha IP. Si no esta autorizada en Mongo Atlas tirara un error:
```
Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted. Make sure your current IP address is on your Atlas cluster's IP whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/
```
Si se desea probar recomiendo crear una db propia en tu propia cuenta de mongo atlas y cargar los datos utilizando lo mencionado en la seccion DATOS.

# Vistas
Vistas implementadas con handlebars
### Login
Pantalla de login se puede entrar con github o con usuario y contraseña. Ruta http://localhost:8080/api/sessions/login

![Pantalla de login](https://i.ibb.co/XVCzqLX/Captura-de-pantalla-2024-12-03-a-la-s-12-27-52-p-m.png
)
### Estrategia current
Pantalla de "Perfil de usuario". Ruta http://localhost:8080/api/sessions/current
![Current](https://i.ibb.co/ZBDY0pp/Captura-de-pantalla-2024-12-03-a-la-s-12-30-20-p-m.png)
### Registro
Pantalla de registro para nuevo usuario. Ruta: http://localhost:8080/api/sessions/signup
![Pantalla de Registro](https://i.ibb.co/YfBNhPs/Captura-de-pantalla-2024-12-03-a-la-s-12-35-52-p-m.png
)

### Lista de Productos
Muestra los productos paginados de a 5. Ruta: localhost:8080/products
![Lista de Productos](https://i.ibb.co/n7xLQPL/Captura-de-pantalla-2024-12-03-a-la-s-12-27-26-p-m.png
)
### Detalle de producto
Detalle de producto, muestra el detalle del producto mas un boton agregar al carro. Utiliza uno de los endpoints para agregar producto al carrito Ruta: http://localhost:8080/products/:id. Requiere estar logeado
![Detalle de producto](https://i.ibb.co/yRz4XfB/Captura-de-pantalla-2024-12-03-a-la-s-12-29-43-p-m.png
)

### Cart
Detalle de carrito, requiere login (no me pidan css). Ruta: http://localhost:8080/cart
![Cart](https://i.ibb.co/YTzStyz/Captura-de-pantalla-2024-12-03-a-la-s-12-29-56-p-m.png)
### Crear Producto
Pantalla para crear producto, requiere ADMIN (Solo se puede hacer admin editando un usuario creado en mongo). Ruta http://localhost:8080/create
![Crear producto](https://i.ibb.co/7vzLrFJ/Captura-de-pantalla-2024-12-03-a-la-s-12-30-27-p-m.png)

# Autenticacion
La autenticacion esta hecha con passport utilizando JWT via cookie (la cookie se llama "jwt") con distintas estrategias.

# Endpoint

## POSTMAN

Setear la cookie en postman para poder hacer los request que piden autenticacion
![POSTMAN](https://i.ibb.co/P1Xf1fj/Captura-de-pantalla-2024-12-03-a-la-s-1-40-16-p-m.png)

## Products
Internamente los productos estan guardados en un esquema utilizando mongoose con los campos mencionados mas abajo.
### GET /api/products
 Devuelve la lista de productos paginados.
```
{
	status:success/error
    payload: Resultado de los productos solicitados
    totalPages: Total de páginas
    prevPage: Página anterior
    nextPage: Página siguiente
    page: Página actual
    hasPrevPage: Indicador para saber si la página previa existe
    hasNextPage: Indicador para saber si la página siguiente existe.
    prevLink: Link directo a la página previa (null si hasPrevPage=false)
    nextLink: Link directo a la página siguiente (null si hasNextPage=false)
}
```
 Parametros
 - ```limit``` (opcional) que limita la cantidad de productos devueltos por defecto 10. 
 - ```page``` (opcional) la pagina a obtener por defecto 1
 - ```sort``` asc o desc (opcional) ordena por precio
 - ```query``` en body recibe un json que es el filtro puede ser por ejemplo:
``` {"category": "Electronics"}``` o ```{"status": true}```

ejemplo:
```localhost:8080/api/products?limit=2&page=2&sort=desc```

### GET /api/products/:id
Devuelve un producto correspondiente al ID
### POST /api/products
Crea un producto nuevo con el json recibido en body. Requiere admin, para hacerlo en POSTMAN hay que setear la cookie. Los campos son
```
- title: String,
- description: String
- code: String
- price: Number
- status: Boolean
- stock: Number
- category: String
- thumbnails: Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
```
Status es true por defecto.
Todos los campos son obligatorios, a excepción de thumbnails

Ejemplo: 
```
{
    "title": "Ultra HD Projector",
    "description": "A high-resolution projector with 4K support for home theaters.",
    "code": "PJ11001",
    "price": 899.99,
    "stock": 30,
    "category": "Electronics",
    "thumbnails": ["projector_front.jpg", "projector_side.jpg"]
}
```
### PUT /api/products
toma un producto y actualiza los campos enviados desde body. 
Por ejemplo:
PUT localhost:8080/api/products/66f032049df529df4cbb5b27
```
{
    "description" : "Nueva description",
    "price" : 3
}
```
### DELETE /api/products/:id
Elimina el producto con el id. Ejemplo:
DELETE localhost:8080/api/products/66f032049df529df4cbb5b27

## Carts 

### POST /api/carts
Crea un carrito vacio devuelve:
```
{
    "_id": "66fbe41ebe6ed113b2bcfb69",
    "products": [],
    "__v": 0
}
```
### GET /api/carts/:cid
Devuelve el arreglo de productos con todos los productos completos mediante un populate.
Ejemplo 
```GET localhost:8080/api/carts/66f03fed59dce198c833259b
```

### POST /api/carts/:cid/product/:pid
Agrega una unidad del un producto en el carro. Ejemplo:  ```POST localhost:8080/api/carts/66f03fed59dce198c833259b/product/66f02daf959b04b589c344e6```

### POST /:cid/purchase
Procode a la "Compra del carrito" devuelve un Ticket, si no hay stock del producto lo deja en el carrito (compra el resto).

## Tickets

### GET /api/tickets
Obtiene todos los tickets, requiere admin

### GET /api/tickets/:id
Obtiene un ticket en particular

## User

### GET /api/users/
obtiene todos los usuarios, requiere admin.
### DELETE /api/users/:uid
Borra un usuario, requiere admin.
### PUT /api/users/:uid
Hace admin a un usuario (para entrar al create y hacer cosas de admin), solo deberia hacerlo el admin pero a fines de muestra puede hacerlo un user (para poder registrarse y hacer luego modificar a admin ya que al registrarse solo se crea "user")

## Session

### POST /api/sessions/login
Authentica con passport con estrategia login, setea la cookie el JWT

```
{
    "email": "admin@email.com",
    "password" : "123"
}
```

### POST /api/sessions/signup
Utiliza la estrategia signup, internamente crea un usuario.
```
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "johndoe@example.com",
  "age": 25,
  "password": "securePassword123"
}
```

### GET /api/sessions/current
Obtiene un DTO de un usuario (que no contiene indormacion sensible) y muestra un perfil, requiere estar logeado

