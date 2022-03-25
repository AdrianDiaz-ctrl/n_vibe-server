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

    if(correo === connection.query(`SELECT correo FROM usuarios WHERE correo = ${correo}`) ){
        console.log("error, duplicado")
    }else{
        connection.query("INSERT INTO usuarios SET ?", {
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

app.post('/login', (req, res) => {
    const user = req.body.correo;
    const pass = req.body.password;

    if(user && pass) {
        connection.query('SELECT * FROM usuarios WHERE correo = ?', [user], async(error, results)=>{

            let compare = await bcrypt.compare(pass, results[0].contraseña)

            if(results.length == 0 || !compare){                
                console.log("USUARIOS O PASSWORD INCORRECT")
                return res.json({redirect: '/register'})
            }else{
                req.session.loggedin = true;
                console.log("Login correcto")
                return res.json({redirect: '/home'})
                // return res.json({redirect: "/home"})
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

app.get('/data', (req, res) => {
    const consulta = connection.query("SELECT * FROM usuarios")
    console.log(consulta)
})

app.get('/logout', (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

app.listen(3002, (req, res) => {
    console.log("listening on http://localhost:3002")
}) 