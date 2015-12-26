
var expect = require('chai').expect;
var HAPD=require('../lib/index');
var verb=require('verbo');
var json;



describe('Status Object', function() {
  this.timeout(50000);

  before('get status info',function() {
    return HAPD({
      path:'/tmp/hapd.conf',
      interface:'wlan0',
      ssid:'testssid',
      test:true
    }).then(function(data){
      json=data
    }).catch(function(err){
      console.log(err)
    })
  });

  describe('check json', function () {

    it('exist', function(){
      expect(json).to.be.ok;
    })

    it('is an object ', function(){
      expect(json).is.an('object');
    })
    it('have an interface', function(){
      expect(json).to.have.property('interface').that.is.a('string');
    })
    it('have a driver', function(){
      expect(json).to.have.property('driver').that.is.a('string');
    })
  });
});
