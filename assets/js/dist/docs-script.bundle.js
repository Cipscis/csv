(()=>{"use strict";function e(e,t){let n;return n=void 0===e?"":"string"!=typeof e?""+e:e,(t?.sanitise??!1)&&n.match(/^[=\-+@]/)&&(n="\t"+e),n.match(/,|"|\n/)&&(n=n.replace(/"/g,'""'),n='"'+n+'"'),n}function t(e,t){const n=function(e){const t=[];e=e.replace(/\r/g,"");let n=!1,s=!1,r=0,o=[];for(let i=0;i<e.length;i++){const u=e[i],l=","===u,c='"'===u,a="\n"===u,f=i===e.length-1;if(n)if(c){if('"'===e[i+1]){i++;continue}if(n=!1,s=!0,!f)continue}else if(f)throw new SyntaxError(`CSV parse: Reached end of file before ending quote. At index ${i}`);if(!n&&(l||a||f)){let n=e.substring(r,i+1);(l||a)&&(n=n.substring(0,n.length-1)),s&&(s=!1,n=n.substring(1,n.length-1),n=n.replace(/""/g,'"')),o.push(n),l&&f&&o.push(""),(a||f)&&(t.push(o),a&&(o=[])),r=i+1}else{if(s)throw new SyntaxError(`CSV parse: A value must be complete immediately after closing a quote. At index ${i}`);c&&(n=!0)}}return t}(e);return function(e){if(e&&e.length>1){let t=e[0].length;for(let n=1;n<e.length;n++)if(e[n].length!==t)throw new SyntaxError(`CSV parse: Row ${n} does not have the same length as the first row (${t})`)}}(n),void 0!==t?n.map((e=>e.map(t))):n}const n=[["Numbers",0,1,2,3],["Test values","test",{test:!0}],["Falsey values",!1,"",[],null],["Values to sanitise","=GET(malicious_code)","-FETCH(url)","+DO(nefarious_thing)","@POST(data)"]],s="Numbers,0,1,2,3\nTest values,test,{test: true},,\nFalsey values,false,'',[],null\nValues to sanitise,=GET(malicious_code),-FETCH(url),+DO(nefarious_thing),@POST(data)";document.querySelectorAll(".js-stringify__button").forEach((t=>t.addEventListener("click",(()=>{const t=document.querySelector(".js-stringify__input"),s=document.querySelector(".js-stringify__output"),r=document.querySelector(".js-stringify__transpose"),o=document.querySelector(".js-stringify__sanitise"),i=r instanceof HTMLInputElement&&r.checked,u=o instanceof HTMLInputElement&&o.checked,l=(c=n,(a=(a={transpose:i,sanitise:u})||{}).transpose=a.transpose||!1,a.sanitise=a.sanitise||!1,function(e){const t=[];for(let n=0;n<e.length;n++)t.push(e[n].join(","));return t.join("\n")}(function(t,n){for(const s of t)for(let t=0;t<s.length;t++)s[t]=e(s[t],n);return t}(function(e,t){const n=t?.transpose??!1,s=e.reduce(((e,t)=>Math.max(e,t.length)),0),r=n?s:e.length,o=n?e.length:s,i=[];for(let t=0;t<r;t++){const s=[];for(let r=0;r<o;r++){const o=n?r:t,i=n?t:r;let u=e[o][i];i>=e[o].length&&(u=""),s.push(u)}i.push(s)}return i}(c,a),a)));var c,a;t&&(t.innerHTML=JSON.stringify(n,null,"\t")),s&&(s.innerHTML=l)})))),document.querySelectorAll(".js-parse__button").forEach((e=>e.addEventListener("click",(()=>{const e=document.querySelector(".js-parse__input"),n=document.querySelector(".js-parse__output"),r=document.querySelector(".js-parse__map-integers"),o=r instanceof HTMLInputElement&&r.checked,i=(()=>{let e;return e=o?t(s,(e=>+e===parseInt(e,10)?+e:e)):t(s),e})();e&&(e.innerHTML=s),n&&(n.innerHTML=JSON.stringify(i,null,"\t"))}))))})();
//# sourceMappingURL=docs-script.bundle.js.map