import nconf from '@qwant/nconf-getter'
import Ajax from '../libs/ajax'

let systemConfig = nconf.get().system
let servicesConfig = nconf.get().services

function Error() {
  this.networkAvailable = true
  this.storeAvailable = true
}

if(!window.__error) {
  window.__error = new Error()
}

Error.prototype.setNetworkError = function(status) {
  fire('error_h', message)
  this.log(message)
}

Error.prototype.setStoreError = function (status) {
  
}

Error.prototype.setNetworkError = function(message) {
  fire('error_h', message)
  this.log(message)
}

Error.prototype.log = function(message) {
  if(false && systemConfig.showError) {
    console.log(message)
  } else {
    Ajax.query(servicesConfig.elk.url, {message})
  }
}

export default window.__error
