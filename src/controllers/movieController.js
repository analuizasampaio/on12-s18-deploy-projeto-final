const mongoose = require('mongoose')
const movieSchema = require('../models/movieSchema')

const getAll = async (req, res) => {
    const filmes = await movieSchema.find().populate('movie') //eager loading
    res.json(filmes)
}

const create =  async (req,res) => {
    const filme = new movieSchema({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        genero: req.body.genero,
        descricao: req.body.descricao,
        criadoEm: req.body.criadoEm
    })
    try { 
        const novoFilme = await filme.save()
        res.status(201).json(novoFilme)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getById = async (req, res) => {
    try {
        const filme = await movieSchema.findById(req.params.id)
        if(filme == null) {
            return res.status(404).json({message: 'filme nao encontrado'})
        }
        res.json(filme)
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

const updateMovie = async (req, res) => {
    try {
        const filme = await movieSchema.findById(req.params.id)
        if(filme == null) {
            return res.status(404).json({message: 'filme nao encontrado'})
        }
        
        if (req.body.nome != null) {
            filme.nome = req.body.nome
        }
        if (req.body.genero != null) {
            filme.genero = req.body.genero
        }
        if (req.body.descricao != null) {
            filme.descricao = req.body.descricao
        }
        if (req.body.criadoEm != null) {
            filme.criadoEm = req.body.criadoEm
        }
        
        const filmeAtualizado = await filme.save()
        res.json(filmeAtualizado)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteMovie = async (req, res) => {
    try{    
        const filme = await movieSchema.findById(req.params.id)
        if(filme == null) {
            return res.status(404).json({message: 'filme nao encontrado'})
        }

        await filme.remove()
        res.json({ message: 'filme deletado com sucesso!'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getAll,
    create,
    getById,
    updateMovie,
    deleteMovie,
    
}