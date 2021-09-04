const express = require("express")
const router = express.Router()
const controller = require("../controllers/movieController")



router.get("/", controller.getAll )
router.get("/:id", controller.getById )

router.post("/cadastrar", controller.create)

router.patch("/atualizar/:id", controller.updateMovie)

router.delete("/deletar/:id", controller.deleteMovie)

module.exports = router