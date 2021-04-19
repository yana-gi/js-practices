#! /usr/bin/env node

class App {

  static run(option){
    this.option = option

  }

  static getInput(){
    const input = require('fs').readFileSync('/dev/stdin', 'utf8')
    console.log(input)
  }
}

const option = require('minimist')(process.argv.slice(2));
App.run(option)
