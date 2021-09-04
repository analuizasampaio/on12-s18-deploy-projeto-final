const express = require("express")
const cors = require("cors")
const db = require("./data/dbConfig")

const index = require("./routes/index")
const filmes = require("./routes/movieRoutes")

db.connect()

const app = express()

app.use(cors())
app.use(express.json())


app.use("/", index)
app.use("/filmes", filmes)

module.exports = app