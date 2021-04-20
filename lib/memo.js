#! /usr/bin/env node

class App {
  static run (option) {
    const storage = new StorageFile()
    if (option.l) {
      storage.index()
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
          memoList.forEach(function (memo, i) {
            if (memo.id === selectedMemo.id) memoList.splice(i, 1)
          })
          console.log(memoList)
        })
        .catch(console.error)
    } else {
      const newId = memoList[memoList.length - 1].id + 1
      const inputText = require('fs').readFileSync('/dev/stdin', 'utf8')
      const newMemo = {
        id: newId,
        text: inputText
      }
      memoList.push(newMemo)
    }
  }
}

class Storage {
  create () {}
  show () {}
  index () {}
  destroy () {}
}

class StorageFile extends Storage {
  constructor () {
    super()
    const fs = require('fs')

    const jsonObject = JSON.parse(fs.readFileSync('./storage/output.json', 'utf8'))
    this.memoList = jsonObject.Memo
  }

  index () {
    const memoLines = this.createMemoTopLines(this.memoList)
    memoLines.forEach((line) => {
      console.log(line)
    })
  }

  createMemoTopLines (memoList) {
    const memoLines = memoList.map(function (memo) {
      return memo.text.split('\n')[0]
    })
    return memoLines
  }
}

const option = require('minimist')(process.argv.slice(2))
App.run(option)
