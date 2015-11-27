var Promise=require('promise'),
exec=require('promised-exec'),
pathExists=require('path-exists'),
verb=require('verbo');

function Hpd(options,path){

  if(!path){
    path='/etc/hostapd/hostapd.conf'
  }

  this.path=path;

  for(var i=0;i<Object.keys(options).length; i++){
    this[Object.keys(options)[i]]=options[Object.keys(options)[i]]
  }

  new Promise(function(resolve,reject){

  exec('which hostapd').then(function(){

    var errors=[];

    if (!pathExists.sync(path)){
      errors.push('wrong hostapd configuration file path')
    }
     if(!options.device){
      errors.push('you must specify a device')
    }
     if(!options.driver){
       errors.push('you must specify the device driver')
    }


    if(errors.length>0){
      verb(errors,'error','hostapdjs');
      reject(errors)
    } else{


  // write hostapd conf




    }


  }).catch(function(){
    verb('hostapd is not installed','error','hostapdjs')
    reject('hostapd is not installed')
  })

    })


}

Hpd.prototype.start=function(){
    new Promise(function(resolve,reject){

  exec('systemctl start hostapd').then(function(){
    exec('systemctl start dnsmasq').then(function(){

          resolve('activated')

        }).catch(function(){
              reject('hostapd start error')

  })
}).catch(function(){
  reject('dnsmasq start error')
})

})
}

module.exports=Hpd
