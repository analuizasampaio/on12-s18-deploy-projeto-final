const express = require("express")
const router = express.Router()

router.get("/", (request, response)=>{
    response.status(200).json({
        "titulo": "API de Filmes",
        "version": "1.0.0",
        "mensagem": "Criada com o proposito de ensinar deploy no Heroku com Node.js integração com Mongo db"
    })
})
module.exports = router