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
      const memoLines = this.createMemoTopLines()
      const { prompt } = require('enquirer')

      const question = {
        type: 'select',
        name: 'text',
        message: 'Choose a note you want to see:',
        choices: memoLines
      }
      prompt(question)
        .then(answer => {
          const selectedMemo = memoList.find(({ text }) => text.split('\n')[0] === answer.text)
          console.log(selectedMemo.text)
        })
        .catch(console.error)
    } else if (option.d) {
      console.log('削除')
    } else {
      const newId = memoList[memoList.length - 1].id + 1
      const inputText = require('fs').readFileSync('/dev/stdin', 'utf8')
      const newMemo = {
        id: newId,
        text: inputText
      }
      memoList.push(newMemo)
      // console.log(memoList)
    }
  }

  static createMemoTopLines () {
    const memoLines = memoList.map(function (memo) {
      return memo.text.split('\n')[0]
    })
    return memoLines
  }
}

const option = require('minimist')(process.argv.slice(2))
App.run(option)
