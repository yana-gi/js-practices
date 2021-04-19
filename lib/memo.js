#! /usr/bin/env node

class App {
  static run(option){
    if (option.l) {
      console.log('一覧')
    } else if(option.r) {
      console.log('参照')
    } else if(option.d) {
      console.log('削除')
    } else {
      const input = require('fs').readFileSync('/dev/stdin', 'utf8')
    }
  }
}

const option = require('minimist')(process.argv.slice(2));
App.run(option)
