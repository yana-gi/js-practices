#! /usr/bin/env node
const memoList = [
  {
    id: 1,
    text: 'テキスト1\n改行'
  },
  {
    id: 2,
    text: 'テキスト2 \n改行\n改行'
  }
]
class App {
  static run (option) {
    if (option.l) {
      console.log('一覧')
      const memoLines = this.createMemoTopLines()
      memoLines.forEach((line) => {
        console.log(line)
      })
    } else if (option.r) {
      console.log('参照')
    } else if (option.d) {
      console.log('削除')
    } else {
      const input = require('fs').readFileSync('/dev/stdin', 'utf8')
    }
  }

  static createMemoTopLines () {
    const memoLines = memoList.map(function (memo) {
      const inputString = memo.text
      const firstRowEndPos = inputString.indexOf('\n', 0)
      const outputString = inputString.substr(0, firstRowEndPos)
      return outputString
    })
    return memoLines
  }
}

const option = require('minimist')(process.argv.slice(2))
App.run(option)
