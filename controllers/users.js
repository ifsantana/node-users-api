var express = require('express');
var router = express.Router();

var users = [
    { id: 1, name: 'John', email: 'test@gmail.com', age: 35 },
    { id: 2, name: 'Jane', email: 'test2@gmail.com', age: 28 },
]

router.get('/', (req, res) => {
    return res.status(200).json(users);
});

router.post('/', (req, res) => {
    let { name, email, age } = req.body;
    let newId = users.length + 1;
    users.push({ id: newId, name, email, age });
    console.log(users);
    return res.status(201).json(users.at(users.length - 1));
});

router.delete('/:id', (req, res) => {
    let { id } = req.params;
    let indexToRemove = users.findIndex(user => user.id.toString() === id);
    users.splice(indexToRemove, 1);
    return res.status(200).json(users);
})

module.exports = router;
