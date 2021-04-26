#! /usr/bin/env node

const minimist = require('minimist')
const fs = require('fs').promises
const { prompt } = require('enquirer')

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
      fs.readFile('/dev/stdin', 'utf8', (err, inputText) => {
        if (err) throw err
        storage.create(inputText)
      })
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
  }

  async create (inputText) {
    try {
      const data = await fs.readFile(this.FILE_PATH, 'utf8')
      const memoList = JSON.parse(data).Memo

      const newMemoList = memoList
      const newId = memoList[memoList.length - 1].id + 1

      const newMemo = {
        id: newId,
        text: inputText
      }
      newMemoList.push(newMemo)

      const newData = JSON.stringify({ Memo: newMemoList }, null, 1)
      await fs.writeFile(this.FILE_PATH, newData)
    } catch (err) {
      console.log(err.toString())
    }
  }

  async show () {
    try {
      const data = await fs.readFile(this.FILE_PATH, 'utf8')
      const memoList = JSON.parse(data).Memo
      const memoLines = this.createMemoTopLines(memoList)

      const { prompt } = require('enquirer')
      const question = {
        type: 'select',
        name: 'text',
        message: 'Choose a note you want to see:',
        choices: memoLines
      }
      const answer = await prompt(question)
      const selectedMemo = memoList.find(({ text }) => text.split('\n')[0] === answer.text)
      console.log(selectedMemo.text)
    } catch (err) {
      console.log(err.toString())
    }
  }

  async index () {
    try {
      const data = await fs.readFile(this.FILE_PATH, 'utf8')
      const memoList = JSON.parse(data).Memo
      const memoLines = this.createMemoTopLines(memoList)

      memoLines.forEach((line) => {
        console.log(line)
      })
    } catch (err) {
      console.log(err.toString())
    }
  }

  async destroy () {
    try {
      const data = await fs.readFile(this.FILE_PATH, 'utf8')
      const memoList = JSON.parse(data).Memo
      const newMemoList = memoList
      const memoLines = this.createMemoTopLines(memoList)

      const question = {
        type: 'select',
        name: 'text',
        message: 'Choose a note you want to delete:',
        choices: memoLines
      }
      const answer = await prompt(question)

      const selectedMemo = memoList.find(({ text }) => text.split('\n')[0] === answer.text)
      memoList.forEach(function (memo, i) {
        if (memo.id === selectedMemo.id) newMemoList.splice(i, 1)
      })

      const newData = JSON.stringify({ Memo: newMemoList }, null, 1)
      await fs.writeFile(this.FILE_PATH, newData)
    } catch (err) {
      console.log(err.toString())
    }
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
