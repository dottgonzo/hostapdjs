
var assert = require('chai').assert;
var HAPD=require('../index');
var verb=require('verbo');


before('get status info',function() {
  return HAPD({path:'/tmp/hapd.conf',interface:'wlan0',test:true}).then(function(data){
verb(data,'info','Status Info')
json=data
  }).catch(function(err){
    console.log(err)
  })
});

describe('Status Object', function() {
  describe('check json', function () {

    it('validate ', function(){

        assert.isObject(json, 'Status is an object');


    })
    it('validate interface', function(){
        assert.isString(json.interface);
    })
    it('validate driver', function(){
      assert.isString(json.driver);
    })
  });
});
