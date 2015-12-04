var pathExists=require('path-exists'),
fs = require('fs'),
merge=require('json-add'),
Promise=require('promise'),
exec=require('promised-exec'),
outputFileSync = require('output-file-sync');


module.exports=function(options,action){
  return new Promise(function(resolve,reject){

  if(!pathExists.sync('/etc/default/hostapd')){
    reject('no default conf file was founded for hostapd')
  }
  if(!options || typeof(options)!='object'){
    reject('Type Error, provide a valid json object')
  }
  if(!options.interface){
    reject('No configuration interface was provided')
  }

  function parsemasq(config){
    var write='';
    for(var c=0;c<Object.keys(config).length;c++){
      if(Object.keys(config)[c]!='path'){
        write=write+Object.keys(config)[c]+'='+config[Object.keys(config)[c]]+'\n';
      }
    }
    return write
  }

  var config={
    path:'/etc/hostapd/hostapd.conf',
    driver:'nl80211',
    hw_mode:'g',
    channel:2,
    macaddr_acl:0,
    auth_algs:1,
    ignore_broadcast_ssid:0
  }



  if(config.wpa_passphrase){
    var wpa_standard={
      wpa:2,
      wpa_key_mgmt:'WPA-PSK',
      wpa_pairwise:'TKIP',
      rsn_pairwise:'CCMP'
    }
    merge(config,wpa_standard)
  }

  merge(config,options)
  if (!config.test){
  // if(fs.readFileSync('/etc/default/hostapd')!='DAEMON_CONF="'+config.path+'"'){
  outputFileSync('/etc/default/hostapd', 'DAEMON_CONF="'+config.path+'"', 'utf-8');
  // }
  }

  // manca il controllo che evita di riscrivere se il file è già identico
  outputFileSync(config.path, parsemasq(config), 'utf-8');
  if (!config.test){

    exec('systemctl restart hostapd').then(function(){
      resolve(config)
    }).catch(function(err){
      console.log(err)
      reject(err)
    })
}else{
  exec('echo').then(function(){
    resolve(config)
  }).catch(function(err){
    console.log(err)
    reject(err)
  })
}
  })

};
