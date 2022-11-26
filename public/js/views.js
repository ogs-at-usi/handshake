//EJS Compiled Views - This file was automatically generated on Sat Nov 26 2022 17:17:39 GMT+0100 (Central European Standard Time)
 ejs.views_include = function(locals) {
     
     return function(path, d) {
         console.log("ejs.views_include",path,d);
         return ejs["views_"+path.replace(/\//g,"_").replace(/-/g,"_")]({...d,...locals}, null, ejs.views_include(locals));
     }
 };
 