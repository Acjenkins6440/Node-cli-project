#!/usr/bin/env node
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

let store = {}
const transactions = []
const getWorkingStore = () => transactions.length > 0 ? transactions.slice(-1)[0] : store

const validArgs = (args, length) => args && args.length === length;

const set = (args) => {
  if(validArgs(args, 2)){
    const key = args[0]
    const value = args[1]
    const workingStore = getWorkingStore();
    workingStore[key] = value
    console.log(`${key} => ${value}`)
  }
  else { console.log(getError('setArgs')) }
}

const get = (args) => {
  if(validArgs(args, 1)){
    const key = args[0]
    const workingStore = getWorkingStore();
    const value = workingStore[key]
    console.log(value ? `=> ${value}` : getError('noValueExists'))
  }
  else { console.log(getError('getArgs')) }
}

const remove = (args) => {
  if(validArgs(args, 1)){
    const key = args[0]
    const workingStore = getWorkingStore();
    delete workingStore[key]
    console.log(`${key} removed`)
  }
  else { console.log(getError('deleteArgs')) }
}

const count = (args) => {
  if(validArgs(args, 1)){
    const valueToCount = args[0]
    const workingStore = getWorkingStore();
    const allValues = Object.values(workingStore)
    const count = allValues.reduce((acc, val) => (val === valueToCount ? acc + 1 : acc), 0)
    console.log(`=> ${count}`)
  }
}

const begin = () => {
  const workingStore = getWorkingStore()
  transactions.push(Object.assign({}, workingStore))
}

const rollback = () => {
  if(transactions.length > 0){
    transactions.pop()
  }
  else { console.log(getError('noTransactions')) }
}

const commit = () => {
  if(transactions.length > 0){
    store = transactions.pop()
    transactions.length = 0
    console.log('Changes commited to store, transactions cleared.')
  }
  else { console.log(getError('noTransactions')) }
}

const getError = (error) => {
  let message = ''
  switch (error) {
    case 'setArgs':
      message = 'SET requires two arguments: <key>, <value>'
      break;
    case 'getArgs':
      message = 'GET requires one argument: <key>'
      break;
    case 'noValueExists':
      message = 'No value exists for that key.'
      break;
    case 'deleteArgs':
      message = 'DELETE requires one argument: <key>'
      break;
    case 'countArgs':
      message = 'COUNT requires one argument: <value>'
      break;
    case 'noTransactions':
      message = 'There are no incomplete transactions.'
      break;
    case 'invalidCommand':
      message = 'Invalid command.Valid commands are SET, GET, DELETE, COUNT, BEGIN, COMMIT, and ROLLBACK.';
      break;
    default:
      message = 'Unknown error occured, try another command.'
      break;
  }
  return message
}

const questionFunc = (input) => {
  if (input && input.length > 0) {
    const splitInput = input.split(" ")
    const command = splitInput[0]
    switch (command) {
      case 'SET':
        set(splitInput.slice(1))
        break;
      case 'GET':
        get(splitInput.slice(1))
        break;
      case 'DELETE':
        remove(splitInput.slice(1))
        break;
      case 'COUNT':
        count(splitInput.slice(1))
        break;
      case 'BEGIN':
        begin()
        break;
      case 'COMMIT':
        commit()
        break;
      case 'ROLLBACK':
        rollback()
        break;
      default:
        console.log(getError('invalidCommand'))
        break;
    }
  }
  else {
    console.log(getError('invalidCommand'))
  }
  rl.question('', questionFunc)
}

console.log("Transactional Key Value Store initialized")
rl.question(`waiting for command... \n`, questionFunc)


