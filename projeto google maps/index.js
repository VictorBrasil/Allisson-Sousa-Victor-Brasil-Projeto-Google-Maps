const cors = require('cors')

const express = require('express')
const app = express();
const port = 3000;


app.use(express.json())

app.use(function(req, res, next){
    app.use(cors())
    res.header("Access-Control-Allow-Origin", "*");
    next()
});


app.listen(port,()=>{
    console.log(`Server listen on port ${port}`)
})

const db =  require('./database/database')

app.post('/pontos', db.addPonto)

app.get('/getPontos', db.getPontos)