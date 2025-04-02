require('dotenv').config();
const Client = require('pg').Client
const cliente = new Client({
    user:process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT
})

cliente.connect().then(()=> console.log('cliente conectado')).catch((erro)=>{console.log(erro.stack)})

async function addPonto(req, res){
    const {nomeLocal,desc, lat, lng} = req.body;
    const query = `insert into ponto (nome, localizacao, descricao) values('${nomeLocal}', ST_GeomFromText('POINT(${lat} ${lng})'), '${desc}')`;

        cliente.query(query, (error, results)=>{
            if(error){
                res.status(400).send(error)
                console.log(error)
                return
            }

            res.status(200).send('inserido')
        })
    
}

async function getPontos(req, res){
    const query = 'select nome, st_X(localizacao) as lat, st_Y(localizacao) as lng, descricao from ponto'
    const resultado = await cliente.query(query)
        res.status(200).send(resultado.rows)
}


module.exports = {
    addPonto,
    getPontos
};