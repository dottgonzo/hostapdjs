var pathExists = require("path-exists");
var fs = require("fs");
var merge = require("json-add");
var Promise = require("bluebird");
var exec = require('promised-exec');
var outputFileSync = fs.writeFileSync;
module.exports = function (options) {
    return new Promise(function (resolve, reject) {
        if (!pathExists.sync('/etc/default/hostapd')) {
            reject('no default conf file was founded for hostapd');
        }
        if (!options || typeof (options) != 'object') {
            reject('Type Error, provide a valid json object');
        }
        if (!options.interface) {
            reject('No configuration interface was provided');
        }
        if (!options.ssid) {
            reject('No configuration interface was provided');
        }
        function parsemasq(config) {
            var write = '';
            for (var c = 0; c < Object.keys(config).length; c++) {
                if (Object.keys(config)[c] != 'path') {
                    write = write + Object.keys(config)[c] + '=' + config[Object.keys(config)[c]] + '\n';
                }
            }
            return write;
        }
        var config = {
            path: '/etc/hostapd/hostapd.conf',
            driver: 'nl80211',
            hw_mode: 'g',
            channel: 2,
            macaddr_acl: 0,
            auth_algs: 1,
            ignore_broadcast_ssid: 0,
            test: false
        };
        if (options.wpa_passphrase) {
            var wpa_standard = {
                wpa: 2,
                wpa_key_mgmt: 'WPA-PSK',
                wpa_pairwise: 'TKIP',
                rsn_pairwise: 'CCMP'
            };
            merge(config, wpa_standard);
        }
        merge(config, options);
        if (!config.test) {
            outputFileSync('/etc/default/hostapd', 'DAEMON_CONF="' + config.path + '"', 'utf-8');
        }
        outputFileSync(config.path, parsemasq(config), 'utf-8');
        if (!config.test) {
            exec('systemctl restart hostapd').then(function () {
                resolve(config);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        }
        else {
            exec('echo').then(function () {
                resolve(config);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        }
    });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9pbmRleC50cyJdLCJuYW1lcyI6WyJwYXJzZW1hc3EiXSwibWFwcGluZ3MiOiJBQUFBLElBQVksVUFBVSxXQUFNLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLElBQVksRUFBRSxXQUFNLElBQUksQ0FBQyxDQUFBO0FBQ3pCLElBQU8sS0FBSyxXQUFVLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLElBQVksT0FBTyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ3BDLElBQU8sSUFBSSxXQUFTLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7QUFHdEMsTUFBTSxDQUFDLE9BQU8sR0FBQyxVQUFTLE9BQTREO0lBQ2xGLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBQyxNQUFNO1FBRTFDLEVBQUUsQ0FBQSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUMzQyxNQUFNLENBQUMsOENBQThDLENBQUMsQ0FBQTtRQUN4RCxDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTSxDQUFDLE9BQU8sQ0FBQyxJQUFFLFFBQVEsQ0FBQyxDQUFBLENBQUM7WUFDeEMsTUFBTSxDQUFDLHlDQUF5QyxDQUFDLENBQUE7UUFDbkQsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUM7WUFDckIsTUFBTSxDQUFDLHlDQUF5QyxDQUFDLENBQUE7UUFDbkQsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUM7WUFDaEIsTUFBTSxDQUFDLHlDQUF5QyxDQUFDLENBQUE7UUFDbkQsQ0FBQztRQUVELG1CQUFtQixNQUFNO1lBQ3ZCQSxJQUFJQSxLQUFLQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUNiQSxHQUFHQSxDQUFBQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxFQUFDQSxDQUFDQSxHQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxNQUFNQSxFQUFDQSxDQUFDQSxFQUFFQSxFQUFDQSxDQUFDQTtnQkFDNUNBLEVBQUVBLENBQUFBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUVBLE1BQU1BLENBQUNBLENBQUFBLENBQUNBO29CQUNqQ0EsS0FBS0EsR0FBQ0EsS0FBS0EsR0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsR0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0E7Z0JBQzdFQSxDQUFDQTtZQUNIQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFBQTtRQUNkQSxDQUFDQTtRQUVELElBQUksTUFBTSxHQUFDO1lBQ1QsSUFBSSxFQUFDLDJCQUEyQjtZQUNoQyxNQUFNLEVBQUMsU0FBUztZQUNoQixPQUFPLEVBQUMsR0FBRztZQUNYLE9BQU8sRUFBQyxDQUFDO1lBQ1QsV0FBVyxFQUFDLENBQUM7WUFDYixTQUFTLEVBQUMsQ0FBQztZQUNYLHFCQUFxQixFQUFDLENBQUM7WUFDdkIsSUFBSSxFQUFDLEtBQUs7U0FDWCxDQUFBO1FBSUQsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBLENBQUM7WUFDekIsSUFBSSxZQUFZLEdBQUM7Z0JBQ2YsR0FBRyxFQUFDLENBQUM7Z0JBQ0wsWUFBWSxFQUFDLFNBQVM7Z0JBQ3RCLFlBQVksRUFBQyxNQUFNO2dCQUNuQixZQUFZLEVBQUMsTUFBTTthQUNwQixDQUFBO1lBQ0QsS0FBSyxDQUFDLE1BQU0sRUFBQyxZQUFZLENBQUMsQ0FBQTtRQUM1QixDQUFDO1FBRUQsS0FBSyxDQUFDLE1BQU0sRUFBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO1lBRWxCLGNBQWMsQ0FBQyxzQkFBc0IsRUFBRSxlQUFlLEdBQUMsTUFBTSxDQUFDLElBQUksR0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFakYsQ0FBQztRQUdELGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO1lBRWhCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDckMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLEdBQUc7Z0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNiLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUFBLElBQUksQ0FBQSxDQUFDO1lBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDaEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2pCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLEdBQUc7Z0JBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNiLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztJQUNDLENBQUMsQ0FBQyxDQUFBO0FBRUosQ0FBQyxDQUFDIiwiZmlsZSI6ImxpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGhFeGlzdHMgZnJvbSBcInBhdGgtZXhpc3RzXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBtZXJnZSA9cmVxdWlyZShcImpzb24tYWRkXCIpO1xuaW1wb3J0ICogYXMgUHJvbWlzZSBmcm9tIFwiYmx1ZWJpcmRcIjtcbmltcG9ydCBleGVjPXJlcXVpcmUoJ3Byb21pc2VkLWV4ZWMnKTtcbnZhciBvdXRwdXRGaWxlU3luYyA9IGZzLndyaXRlRmlsZVN5bmM7XG5cblxubW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24ob3B0aW9uczp7aW50ZXJmYWNlOnN0cmluZyxzc2lkOnN0cmluZyx3cGFfcGFzc3BocmFzZTpzdHJpbmd9KXtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcblxuICBpZighcGF0aEV4aXN0cy5zeW5jKCcvZXRjL2RlZmF1bHQvaG9zdGFwZCcpKXtcbiAgICByZWplY3QoJ25vIGRlZmF1bHQgY29uZiBmaWxlIHdhcyBmb3VuZGVkIGZvciBob3N0YXBkJylcbiAgfVxuICBpZighb3B0aW9ucyB8fCB0eXBlb2Yob3B0aW9ucykhPSdvYmplY3QnKXtcbiAgICByZWplY3QoJ1R5cGUgRXJyb3IsIHByb3ZpZGUgYSB2YWxpZCBqc29uIG9iamVjdCcpXG4gIH1cbiAgaWYoIW9wdGlvbnMuaW50ZXJmYWNlKXtcbiAgICByZWplY3QoJ05vIGNvbmZpZ3VyYXRpb24gaW50ZXJmYWNlIHdhcyBwcm92aWRlZCcpXG4gIH1cbiAgaWYoIW9wdGlvbnMuc3NpZCl7XG4gICAgcmVqZWN0KCdObyBjb25maWd1cmF0aW9uIGludGVyZmFjZSB3YXMgcHJvdmlkZWQnKVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VtYXNxKGNvbmZpZyl7XG4gICAgdmFyIHdyaXRlPScnO1xuICAgIGZvcih2YXIgYz0wO2M8T2JqZWN0LmtleXMoY29uZmlnKS5sZW5ndGg7YysrKXtcbiAgICAgIGlmKE9iamVjdC5rZXlzKGNvbmZpZylbY10hPSdwYXRoJyl7XG4gICAgICAgIHdyaXRlPXdyaXRlK09iamVjdC5rZXlzKGNvbmZpZylbY10rJz0nK2NvbmZpZ1tPYmplY3Qua2V5cyhjb25maWcpW2NdXSsnXFxuJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHdyaXRlXG4gIH1cblxuICB2YXIgY29uZmlnPXtcbiAgICBwYXRoOicvZXRjL2hvc3RhcGQvaG9zdGFwZC5jb25mJyxcbiAgICBkcml2ZXI6J25sODAyMTEnLFxuICAgIGh3X21vZGU6J2cnLFxuICAgIGNoYW5uZWw6MixcbiAgICBtYWNhZGRyX2FjbDowLFxuICAgIGF1dGhfYWxnczoxLFxuICAgIGlnbm9yZV9icm9hZGNhc3Rfc3NpZDowLFxuICAgIHRlc3Q6ZmFsc2VcbiAgfVxuXG5cblxuICBpZihvcHRpb25zLndwYV9wYXNzcGhyYXNlKXtcbiAgICB2YXIgd3BhX3N0YW5kYXJkPXtcbiAgICAgIHdwYToyLFxuICAgICAgd3BhX2tleV9tZ210OidXUEEtUFNLJyxcbiAgICAgIHdwYV9wYWlyd2lzZTonVEtJUCcsXG4gICAgICByc25fcGFpcndpc2U6J0NDTVAnXG4gICAgfVxuICAgIG1lcmdlKGNvbmZpZyx3cGFfc3RhbmRhcmQpXG4gIH1cblxuICBtZXJnZShjb25maWcsb3B0aW9ucylcbiAgaWYgKCFjb25maWcudGVzdCl7XG4gIC8vIGlmKGZzLnJlYWRGaWxlU3luYygnL2V0Yy9kZWZhdWx0L2hvc3RhcGQnKSE9J0RBRU1PTl9DT05GPVwiJytjb25maWcucGF0aCsnXCInKXtcbiAgb3V0cHV0RmlsZVN5bmMoJy9ldGMvZGVmYXVsdC9ob3N0YXBkJywgJ0RBRU1PTl9DT05GPVwiJytjb25maWcucGF0aCsnXCInLCAndXRmLTgnKTtcbiAgLy8gfVxuICB9XG5cbiAgLy8gbWFuY2EgaWwgY29udHJvbGxvIGNoZSBldml0YSBkaSByaXNjcml2ZXJlIGlsIGZpbGUgc2Ugw6ggaWRlbnRpY28gYSBxdWVsbG8gcHJlc2VudGVcbiAgb3V0cHV0RmlsZVN5bmMoY29uZmlnLnBhdGgsIHBhcnNlbWFzcShjb25maWcpLCAndXRmLTgnKTtcbiAgaWYgKCFjb25maWcudGVzdCl7XG5cbiAgICBleGVjKCdzeXN0ZW1jdGwgcmVzdGFydCBob3N0YXBkJykudGhlbihmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZShjb25maWcpXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgIHJlamVjdChlcnIpXG4gICAgfSlcbn1lbHNle1xuICBleGVjKCdlY2hvJykudGhlbihmdW5jdGlvbigpe1xuICAgIHJlc29sdmUoY29uZmlnKVxuICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgIGNvbnNvbGUubG9nKGVycilcbiAgICByZWplY3QoZXJyKVxuICB9KVxufVxuICB9KVxuXG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9