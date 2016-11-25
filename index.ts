import * as pathExists from "path-exists";
import * as fs from "fs";
import merge from "json-add";
import * as Promise from "bluebird";
const exec=require("promised-exec");


interface Iconfig {
        path:string;
    driver:string;
    hw_mode:string;
    channel:number;
    macaddr_acl:number;
    auth_algs:number;
    ignore_broadcast_ssid:number;
    test:boolean;
}


function Hostapdjs(options:{interface:string,ssid:string,wpa_passphrase:string}){
        const outputFileSync = fs.writeFileSync;
  return new Promise<Iconfig>(function(resolve,reject){

  if(!pathExists.sync('/etc/default/hostapd')){
    reject('no default conf file was founded for hostapd')
  }
  if(!options || typeof(options)!=='object'){
    reject('Type Error, provide a valid json object')
  }
  if(!options.interface){
    reject('No configuration interface was provided')
  }
  if(!options.ssid){
    reject('No configuration interface was provided')
  }

  function parsemasq(config){
    var write='';
    for(var c=0;c<Object.keys(config).length;c++){
      if(Object.keys(config)[c]!=='path'&&Object.keys(config)[c]!=='test'){
        write=write+Object.keys(config)[c]+'='+config[Object.keys(config)[c]]+'\n';
      }
    }
    return write
  }



  const config=<Iconfig>{
    path:'/etc/hostapd/hostapd.conf',
    driver:'nl80211',
    hw_mode:'g',
    channel:2,
    macaddr_acl:0,
    auth_algs:1,
    ignore_broadcast_ssid:0,
    test:false
  }



  if(options.wpa_passphrase){
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
  // if(fs.readFileSync('/etc/default/hostapd')!=='DAEMON_CONF="'+config.path+'"'){
  outputFileSync('/etc/default/hostapd', 'DAEMON_CONF="'+config.path+'"', 'utf-8');
  // }
  }

  // manca il controllo che evita di riscrivere il file se è identico a quello presente
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
export=Hostapdjs;