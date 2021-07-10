const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 3000
const restaurants = require('./restaurant.json')
const mongoose = require('mongoose')
const db = mongoose.connection
const Restaurant = require('./models/restaurant.js')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', () => {
  console.error('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//Read all
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

//Read detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const filteredrestaurants = restaurants.results.filter(restaurant =>
    restaurant.name.includes(keyword) || restaurant.category.includes(keyword)
  )

  res.render('index', { restaurants: filteredrestaurants, keyword: keyword })
})

app.listen(port, () => {
  console.log(`This is listening on http://localhost/${port}`)
})