const subClasses = {
  station : () => _('station'),
  bank : () => _('bank'),
  restaurant : () => _('restaurant'),
  supermarket : () => _('supermarket'),
  hotel : () => _('hotel'),
  community_centre : () => _('community centre'),
  place_of_worship : () => _('place of worship'),
  embassy : () => _('embassy'),
  fire_station : () => _('fire station'),
  bakery : () => _('bakery'),
  mobile_phone : () => _('mobile phone'),
  cafe : () => _('cafe'),
  hairdresser : () => _('hairdresser'),
  cosmetics : () => _('cosmetics'),
  pharmacy : () => _('pharmacy'),
  convenience : () => _('convenience'),
  greengrocer : () => _('greengrocer'),
  clothes : () => _('clothes'),
  shoes : () => _('shoes'),
  fast_food : () => _('fast food'),
  dry_cleaning : () => _('dry cleaning'),
  video_games : () => _('video games'),
  bus_stop : () => _('bus stop'),
  subway : () => _('subway'),
  park : () => _('park'),
  school : () => _('school'),
  cemetery : () => _('cemetery'),
  hospital : () => _('hospital'),
  kindergarten : () => _('kindergarten'),
  museum : () => _('museum'),
  post_office : () => _('post office'),
  public_building : () => _('public building'),
  attraction : () => _('attraction'),
  marina : () => _('marina'),
  college : () => _('college'),
  books : () => _('books'),
  university : () => _('university'),
  beauty : () => _('beauty'),
  townhall : () => _('townhall'),
  doityourself : () => _('doityourself')
}

module.exports = function (subClass) {
  if(subClasses[subClass]) {
    return subClasses[subClass]()
  } else {
    return ''
  }
}
