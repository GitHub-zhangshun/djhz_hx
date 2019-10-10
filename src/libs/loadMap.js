export function MP() {
    return new Promise(function (resolve, reject) {
      window.init = function () {
        resolve(AMap)
      };
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src="https://webapi.amap.com/maps?v=1.4.14&key=84882a631b01fcbc4a1435b6e484ade2&plugin=AMap.CitySearch&callback=init";
      script.onerror = reject;
      document.head.appendChild(script);
    })
  }