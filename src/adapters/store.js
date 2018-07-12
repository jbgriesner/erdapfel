import nconf from '@qwant/nconf-getter'
let moduleConfig = nconf.get().store

const AbStore = require(`../libs/${moduleConfig.name}`)
const abstractStore = new AbStore(moduleConfig.endpoint)

function Store() {
  this.onError = false
  listen('store_poi', (poi) => {
    this.add(poi)
  })
  listen('del_poi', (poi) => {
    this.del(poi)
  })
  listen('store_clear', () => {
    this.clear()
  })
}

/* global webpack singleton */
if(!window.__store) {
  window.__store = new Store()
}

Store.prototype.getAll = async function() {
  if(this.onError) {
    return
  }
  return new Promise((resolve, reject) => {
    abstractStore.getAll().then((masqData) => {
      resolve(masqData)
    }).catch(function (error) {
      Error.setStoreError(err)
      this.onError = true
      reject(error)
    })
  })
}

Store.prototype.isRegistered = async function () {
  return new Promise((resolve, reject) => {
    abstractStore.getAll()
      .then(() => resolve(true))
      .catch((e) => {
      if(e.message === 'UNREGISTERED') {
        resolve(false)
      } else {
        Error.setStoreError(err)
        this.onError = true
        reject(e)
      }
    })
  })
}

Store.prototype.onConnect = async function () {
  return abstractStore.onConnect()
}

Store.prototype.register = async function () {
  let regParams = {
    endpoint: moduleConfig.endpoint,
    url: window.location.origin + window.location.pathname,
    title: moduleConfig.masq.title,
    desc: moduleConfig.masq.desc,
    icon: moduleConfig.masq.icon
  }
  return abstractStore.registerApp(regParams)
}


Store.prototype.getPrefixes = async function (prefix) {
  if(this.onError) {
    return
  }
  return new Promise((resolve, reject) => {
    const prefixes = []
    abstractStore.getAll().then((items) => {
        Object.keys(items).forEach((itemKey) => {
          let item = items[itemKey]
          const rePrefix = new RegExp(`${prefix}`, 'i')
          if(rePrefix.exec(item.title))
          prefixes.push(item)
        })
        resolve(prefixes)
    }).catch((e) => {
      Error.setStoreError(err)
      this.onError = true
    })
  })
}

Store.prototype.has = async function(poi) {
  if(this.onError) {
    return
  }
  return new Promise((resolve) => {
    abstractStore.get(poi.getKey()).then((foundPoi) => {
      resolve(foundPoi)
    }).catch((err) => {
      Error.setStoreError(err)
      this.onError = true
      resolve()
    })
  })
}

Store.prototype.add = function(poi) {
  if(this.onError) {
    return
  }
  abstractStore.set(poi.getKey(), poi.store()).then(function () {
  }).catch(function (err) {
    Error.setStoreError(err)
    this.onError = true
  })
}

Store.prototype.del = function(poi) {
  if(this.onError) {
    return
  }
  abstractStore.del(poi.getKey()).catch((err) => {
    Error.setStoreError(err)
    this.onError = true
  })
}

Store.prototype.clear = function () {
  if(this.onError) {
    return
  }
  abstractStore.clear().catch((err) => {
    Error.setStoreError(err)
    this.onError = true
  })
}


export default window.__store
