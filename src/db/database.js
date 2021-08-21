const mysql =require('mysql2');

const connection = mysql.createPool({
    uri: 'mysql://u3nhojkyfzisauwr:nhtMziGpaFlvqnK9yV7s@b2dql3cn1qsogappkey0-mysql.services.clever-cloud.com:3306/b2dql3cn1qsogappkey0'
});

connection.query('SELECT 1 + 1 AS solution',(err, rows) => {
    if(err) throw err;
    console.log('The solution is:', rows[0].solution)
})

module.exports = connection