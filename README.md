# hostapdjs

[![NPM Version][npm-image]][npm-url]

## Install

```bash
npm i hostapdjs
```

## Usage

```javascript
var hostapd = require('hostapdjs').default;

hostapd({
   interface: 'wlan0',
   ssid: 'MYNETWORK',
   wpa_passphrase: 'password' //Optional
});

```


