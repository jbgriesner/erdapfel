import {initBrowser, wait} from '../tools'
const configBuilder = require('@qwant/nconf-builder')
const config = configBuilder.get()
const APP_URL = `http://localhost:${config.PORT}`

let browser
let page

beforeAll(async () => {
  let browserPage = await initBrowser()
  page = browserPage.page
  await page.setRequestInterception(true)
  page.on('request', interceptedRequest => {
    if(interceptedRequest.url().match(/autocomplete/)) {
      interceptedRequest.headers['Access-Control-Allow-Origin'] = '*'
      const mockAutocomplete = require('../../__data__/autocomplete')
      interceptedRequest.respond({body : JSON.stringify(mockAutocomplete), headers  : interceptedRequest.headers})
    } else {
      interceptedRequest.continue()
    }
  })
  browser = browserPage.browser
})

test('key press',async () => {
  expect.assertions(2)
  await page.goto(APP_URL)
  await page.keyboard.type('Hello')
  let cleanHandle = await page.waitForSelector('#clear_button')
  expect(cleanHandle).not.toBeNull()
  /* check input content */
  let searchValueHandle = await page.evaluateHandle(() => { return document.querySelector('#search').value === 'Hello' })
  expect(searchValueHandle._remoteObject.value).toBeTruthy()
})

test('simple_word', async () => {
  expect.assertions(1)
  await page.goto(APP_URL)
  await page.keyboard.type('test')
  await wait(100)
  const autocompleteItems = await page.waitForSelector('.autocomplete_suggestion')
  expect(autocompleteItems).not.toBeNull()
})

afterAll(() => {
  browser.close()
})

