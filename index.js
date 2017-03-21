//include express
const express = require('express');
const serveStatic = require('serve-static')
//create an express application
const app = express();
const low = require('lowdb');
const db = low('./db.json');
const bodyParser = require('body-parser');



db.defaults({ todos: [] })
  .write()


app.use(bodyParser.json())

//define a route on `/hello/world`
app.get('/api/todos',(request, response) => {
    response.header('Content-Type', 'application/json');
    response.send(db.get('todos').value());
});


// POST method route
app.post('/api/todos', function (req, res) {
  db.get('todos').push({
    id: Date.now(),
    data: req.body,
  }).write();

  res.header('Content-Type', 'application/json');
  res.send(db.get('todos').value());
})

app.put('/api/todo/:id', (request, response)=>{
const id = parseInt(request.params.id, 10);
  db.get('todos')
    .find({id})
    .set('data.isDone', request.body.isDone)
    // .assign({ isDone: dataPayload.isDone })
    .write()

  response.header('Content-Type', 'application/json');
  response.send(db.get('todos').value());
})

app.delete('/api/todo/:id', (request, response)=>{
  const id = parseInt(request.params.id, 10);
  db.get('todos')
    .remove({id})
    .write()


  response.header('Content-Type', 'application/json');
  response.send(db.get('todos').value());
})

app.use('/', serveStatic('public', {'index': ['index.html']}));
//have the application listen on a specific port
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});