import puppeteer from 'puppeteer'
import {wait} from '../tools'
const configBuilder = require('@qwant/nconf-builder')
const config = configBuilder.get()
const APP_URL = `http://localhost:${config.PORT}`

let browser
let page

beforeAll(async () => {
  try {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    page.on('console', msg => {
      console.log(`> ${msg.text()}`)
    })
  } catch (error) {
    console.error(error)
  }
})

test('error message show up', async () => {
  expect.assertions(1)
  await page.goto(APP_URL)
  let errorMessage = 'error message'
  await page.evaluate((errorMessage) => {
    fire('error_h', errorMessage)
  }, errorMessage)
  await wait(100)
  let innerErrorMessage = await page.evaluate(() => {
    return document.querySelector('.error_panel').innerText
  })

  expect(innerErrorMessage.indexOf(errorMessage) !== -1).toBeTruthy()
})

test('close error message', async () => {
  expect.assertions(1)
  await page.goto(APP_URL)
  await page.evaluate(() => {
    fire('error_h', '')
  })
  await wait(300)
  page.click('.error_panel__close')
  await wait(300)
  let isHidden = page.evaluate(() => {
    return document.querySelector('.error_panel').style.top === '-100px'
  })
  expect(isHidden).toBeTruthy()
})

afterAll(() => {
  browser.close()
})
