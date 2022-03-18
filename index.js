/* EXPRESS */
const cors = require('cors')
const express = require('express')
const app = express();
const session = require('express-session')
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cors())

/* CONEXION CON DB */
const connection = require('./database/db')

/* ROUTES */
// import router from "../routes/index.js";

/* Encript */
const bcrypt = require('bcryptjs')

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    res.send("Hola")
})

app.get('/login', (req, res) => {
    res.send("login")
})

app.post('/register', async (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const ocupacion = req.body.ocupacion;
    const correo = req.body.correo;
    const pass = req.body.password;
    let passwordHash = await bcrypt.hash(pass, 8)

    if(nombre.length === 0 || edad.length === 0 || ocupacion.length === 0 || correo.length === 0 || pass.length === 0){
        res.send("Error, llene todos los campos")
    }else{
        connection.query("INSERT INTO socio SET ?", {
            nombre: nombre, 
            correo: correo, 
            edad: edad,
            ocupacion: ocupacion, 
            contraseña: passwordHash
        }, async (err, resul) => {
            if(err){console.log(err)}
            else{
                console.log("todo bien")
                res.send('registro CORRECT')
            }
            
        })
    }
})

app.post('/login', async (req, res) => {
    const user = req.body.correo;
    const pass = req.body.password;

    if(user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async(error, results)=>{
            if(results.length == 0 || !(await bcrypt.compare(pass, results[0].pass))){
                res.send('USUARIOS O PASSWORD INCORRECT', error)
            }else{
                req.session.loggedin = true;
                res.send('LOGIN CORRECT')
            }
        })
    }
})

// app.get('/', (req, res) => {
//     if(req.session.loggedin){
//         res.render('index', {
//             login: true
//         })
//     }else{
//         res.render('index', {
//             login: false
//         })
//     }
// })

app.get('/logout', (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

app.listen(3002, (req, res) => {
    console.log("listening on http://localhost:3002")
}) 