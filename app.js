import express from "express";
import {config} from 'dotenv'

config()

const app = express()

app.get('/', (req, res) => {
    res.send('Hi')
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`)
})