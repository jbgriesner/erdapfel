import WikiPanelView from 'dot-loader!../views/wiki_panel.dot'
import Panel from "../libs/panel"
import Ajax from "../libs/ajax"
import ExtendedString from "../libs/string"

const services = require('../../config/services.yml')
/**
 *
 * @param name
 * @param time
 * @param timeMessages [time : xx, message : 'opening soon' .. // -1 for open message
 * @constructor
 */
function WikiPanel() {

  this.STATE = {
    LOADING : 0,
    LOADED : 1
  }

  this.descriptionLength = 100

  this.panel = new Panel(this, WikiPanelView)
  this.ExtendedString = ExtendedString
  this.data = null
  this.state = this.STATE.LOADING
  this.collapsed = true
}

WikiPanel.prototype.getData = async function(tag) {
  if(tag.value !== this.tag) {
    this.collapsed = true
    this.tag = tag.value
    this.state = this.STATE.LOADING
    await this.panel.update()
    try {
      this.data = await Ajax.queryLang(services.wiki.url, {id : tag.value})
    } catch(e) {
      this.data = {}
    }
    this.state = this.STATE.LOADED
    this.tag = tag.value
    this.panel.update()
  }
}

WikiPanel.prototype.toggle = function() {
  this.panel.toggleClassName(.3, '.poi_panel__info__wiki', 'poi_panel__info__wiki--open')
}

WikiPanel.prototype.toggleEllipsis = function() {
  if(this.collapsed) {
    this.collapsed = false
  } else {
    this.collapsed = true
  }
  this.panel.update()
}


export default WikiPanel
