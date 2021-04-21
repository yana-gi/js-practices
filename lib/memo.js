#! /usr/bin/env node

const minimist = require('minimist')
const fs = require('fs')

class App {
  static run (option) {
    const storage = new StorageFile()
    if (option.l) {
      storage.index()
    } else if (option.r) {
      storage.show()
    } else if (option.d) {
      storage.destroy()
    } else {
      const inputText = require('fs').readFileSync('/dev/stdin', 'utf8')
      storage.create(inputText)
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

    this.FILE_PATH = './storage/memo.json'
    this.memoList = JSON.parse(fs.readFileSync(this.FILE_PATH, 'utf8')).Memo
  }

  create (inputText) {
    const newMemoList = this.memoList
    const newId = this.memoList[this.memoList.length - 1].id + 1
    const newMemo = {
      id: newId,
      text: inputText
    }
    newMemoList.push(newMemo)
    fs.writeFileSync(this.FILE_PATH, JSON.stringify({ Memo: newMemoList }, null, 1))
  }

  show () {
    const memoLines = this.createMemoTopLines(this.memoList)
    const { prompt } = require('enquirer')

    const question = {
      type: 'select',
      name: 'text',
      message: 'Choose a note you want to see:',
      choices: memoLines
    }
    prompt(question)
      .then(answer => {
        const selectedMemo = this.memoList.find(({ text }) => text.split('\n')[0] === answer.text)
        console.log(selectedMemo.text)
      })
      .catch(console.error)
  }

  index () {
    const memoLines = this.createMemoTopLines(this.memoList)
    memoLines.forEach((line) => {
      console.log(line)
    })
  }

  destroy () {
    const newMemoList = this.memoList
    const memoLines = this.createMemoTopLines(this.memoList)
    const { prompt } = require('enquirer')

    const question = {
      type: 'select',
      name: 'text',
      message: 'Choose a note you want to delete:',
      choices: memoLines
    }
    prompt(question)
      .then(answer => {
        const selectedMemo = this.memoList.find(({ text }) => text.split('\n')[0] === answer.text)
        this.memoList.forEach(function (memo, i) {
          if (memo.id === selectedMemo.id) newMemoList.splice(i, 1)
        })
        fs.writeFileSync(this.FILE_PATH, JSON.stringify({ Memo: newMemoList }, null, 1))
      })
      .catch(console.error)
  }

  createMemoTopLines (memoList) {
    const memoLines = memoList.map(function (memo) {
      return memo.text.split('\n')[0]
    })
    return memoLines
  }
}

const option = minimist(process.argv.slice(2))
App.run(option)
