const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// Insert your customized Atlas string here:
const url = `mongodb+srv://akhilaanil0304_db_user:$Jesu3406@cluster0.yu4uhsy.mongodb.net/phonebookApp?retryWrites=true&w=majority`