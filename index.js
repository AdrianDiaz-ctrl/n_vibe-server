/* EXPRESS */
const express = require('express')
const app = express();
const session = require('express-session')
app.use(express.urlencoded({extended:false}))
app.use(express.json());

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

// app.get('/', (req, res) => {
//     res.send("Hola")
// })

app.get('/login', (req, res) => {
    res.send("login")
})

app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let password = await bcrypt.hash(pass, 8)
    connection.query("INSERT INTO socio SET ?", {
        user: user, 
        name: name, 
        rol: rol, 
        pass: pass
    }, async (err, res) => {
        if(err) throw err
        console.log("exitosa")
    })
})

app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    let passwordHash = await bcrypt.hash(pass, 8)

    if(user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async(error, results)=>{
            if(results.length == 0 || !(await bcrypt.compare(pass, results[0].pass))){
                res.send('USUARIOS O PASSWORD INCORRECT')
            }else{
                req.session.loggedin = true;
                res.send('LOGIN CORRECT')
            }
        })
    }
})

app.get('/', (req, res) => {
    if(req.session.loggedin){
        res.render('index', {
            login: true
        })
    }else{
        res.render('index', {
            login: false
        })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

app.listen(3002, (req, res) => {
    console.log("listening on http://localhost:3002")
}) 