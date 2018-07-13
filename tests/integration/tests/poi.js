const configBuilder = require('@qwant/nconf-builder')
const config = configBuilder.get()
const APP_URL = `http://localhost:${config.PORT}`
import {initBrowser, getText, wait} from '../tools'

let browser
let page

beforeAll(async () => {
  let browserPage = await initBrowser()
  page = browserPage.page
  browser = browserPage.browser
  await page.setRequestInterception(true)
  page.on('request', interceptedRequest => {
    if(interceptedRequest.url().match(/autocomplete/)) {
      interceptedRequest.headers['Access-Control-Allow-Origin'] = '*'
      const autocompleteMock = require('../../__data__/autocomplete')
      interceptedRequest.respond({body : JSON.stringify(autocompleteMock), headers  : interceptedRequest.headers})
    } else if(interceptedRequest.url().match(/poi/)) {
      interceptedRequest.headers['Access-Control-Allow-Origin'] = '*'
      const poiMock = require('../../__data__/poi')
      interceptedRequest.respond({body : JSON.stringify(poiMock), headers  : interceptedRequest.headers})
    } else {
      interceptedRequest.continue()
    }
  })
})

test('click on a poi', async () => {
  expect.assertions(2)
  await page.setRequestInterception(true)
  await page.goto(APP_URL)
  await page.evaluate(() => {
    window.MAP_MOCK.evented.prepare('click', 'poi-level-1',  {originalEvent : {clientX : 1000},features : [{properties :{global_id : 1}}]})
  })
  await page.click('#mock_poi')
  const poiPanel = await page.waitForSelector('.poi_panel__title ')
  expect(poiPanel).not.toBeFalsy()
  const translatedSubClass = await getText(page, '.poi_panel__description')
  expect(translatedSubClass).toEqual('musée')
})

test('load a poi from url', async () => {
  expect.assertions(1)
  await page.goto(`${APP_URL}/place/osm:node:2379542204@Musée_dOrsay#map=17.49/2.3261037/48.8605833`)
  const poiPanel = await page.waitForSelector('.poi_panel__title ')
  expect(poiPanel).not.toBeFalsy()
})

test('load a poi already in my favorite form url', async () => {
  expect.assertions(1)
  await page.goto(APP_URL)
  page.evaluate(() => {
    fire('store_poi', {name : 'Poi name', getKey : () => {return '48.859917803575875_2.3265827716099623'}, store: () => {return {id: 1}}}) /* minimal poi */
  })
  await page.goto(`${APP_URL}/place/osm:node:2379542204@Musée_dOrsay#map=17.49/2.3261037/48.8605833`)
  let plainStar = await page.waitForSelector('.poi_panel__store_status__toggle--stored')
  expect(plainStar).not.toBeFalsy()
})

test('update url after a poi click', async () => {
  expect.assertions(1)
  await page.goto(APP_URL)
  await page.evaluate(() => {
    window.MAP_MOCK.evented.prepare('click', 'poi-level-1',  {originalEvent : {clientX : 1000},features : [{properties :{global_id : 1}}]})
  })
  await page.click('#mock_poi')
  await wait(400)
  let location = await page.evaluate(() => {
    return document.location.href
  })
  expect(location).toMatch(/1@Mus%C3%A9e_dOrsay/)
})

test('update url after a favorite poi click', async () => {
  expect.assertions(1)
  await page.goto(APP_URL)
  page.evaluate(() => {
    fire('store_poi', {name : 'Poi name', getKey : () => {return 1}, store: () => {return {id: 1}}}) /* minimal poi */
  })
  await page.click('.side_bar__fav')
  await wait(300)
  await page.evaluate(() => { document.querySelector('.favorite_panel__item__actions').style.display = 'block' })
  await page.click('.favorite_panel__go')
  await wait(400)
  let location = await page.evaluate(() => {
    return document.location.href
  })
  expect(location).toMatch(/1@Mus%C3%A9e_dOrsay/)
})


test('update url with correct poi', async () => {
  expect.assertions(1)
  await page.goto(APP_URL)
  await page.keyboard.type('test')
  await page.waitForSelector('.autocomplete_suggestion')
  await page.click('.autocomplete_suggestion:nth-child(2)')
  await wait(300)
  let location = await page.evaluate(() => {
    return document.location
  })
  expect(location.href).toMatch(/osm:node:4872758213@Mus%C3%A9e_dOrsay/)
})

afterAll(() => {
 browser.close()
})
