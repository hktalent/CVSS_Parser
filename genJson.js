var  curl = require("curl"),fs = require('fs'),szName = 'specification-document.html',
   jsdom = require("jsdom"),g_oRst = {};


function fnParseOne($,aT,items,i,n,aADes,szNm)
{
   var oT1 = g_oRst[aT[1]] = {"des":$(items[i + 1]).text().replace(/\n/gmi,' ')}, oT2 = $(items[i + n]).find("tbody tr");
   
   // console.log($(items[i + n]).text())

   for(var j = 0; j < oT2.length; j++)
   {
      var oTd1 = $(oT2[j]).find("td"),oR1 = /\(([A-Z]{1,3})\)/gm.exec($(oTd1[0]).text());
      // console.log(oR1)
      if(oR1)
      oT1[oR1[1]] = $(oTd1[1]).text();
   }
   if(aADes)
   for(var x = 0; x < aADes.length ;x++)
   {
      oT1.des += " " + $(items[i + aADes[x]]).text().replace(/\n/gmi,' ');
   }
   if(szNm)
   {
      oT1.name = szNm.split("(")[0].replace(/.*\.|\s*$/gmi,'');
   }
}


function parseData(html){
   const {JSDOM} = jsdom;
    const dom = new JSDOM(html);
    const $ = (require('jquery'))(dom.window);
    //let's start extracting the data
    var items = $("#c1").children();
    for(var i = 0; i < items.length; i++)
    {
      var n1 = $(items[i]),szText = n1.text(),aT = /\((([A-Z]{1,3})|(CR,\s*IR,\s*AR))\)/gm.exec(szText);
      // console.log(szText)
      
      if(aT && 0 < aT.length)
      {
         if('AV' == aT[1] && !g_oRst['AV'])
         {
            fnParseOne($,aT,items,i,3,0,szText)
         }
         else if('AC' == aT[1] && !g_oRst['AC'])
         {
            fnParseOne($,aT,items,i,3,0,szText)
         }
         else if('PR' == aT[1] && !g_oRst['PR'])
         {
            fnParseOne($,aT,items,i,3,0,szText)
         }
         else if('UI' == aT[1] && !g_oRst['UI'])
         {
            fnParseOne($,aT,items,i,3,0,szText)
         }
         else if('S' == aT[1] && !g_oRst['S'])
         {
            fnParseOne($,aT,items,i,6,[2,3,4],szText)
         }
         else if('C' == aT[1] && !g_oRst['C'])
         {
            fnParseOne($,aT,items,i,3,0,szText)
         }
         else if('I' == aT[1] && !g_oRst['I'])
         {
            fnParseOne($,aT,items,i,3,0,szText)
         }
         else if('A' == aT[1] && !g_oRst['A'])
         {
            fnParseOne($,aT,items,i,3,0,szText)
         }
         else if('E' == aT[1] && !g_oRst['E'])
         {
            fnParseOne($,aT,items,i,4,[2],szText)
         }
         else if('RL' == aT[1] && !g_oRst['RL'])
         {
            fnParseOne($,aT,items,i,3)
         }
         else if('RC' == aT[1] && !g_oRst['RC'])
         {
            fnParseOne($,aT,items,i,3)
         }
         else if((sx1 = 'CR, IR, AR') == aT[1] && !g_oRst['CR'])
         {
            fnParseOne($,aT,items,i,6,[2,3,4],szText)
            var o = g_oRst[sx1];
            delete g_oRst[sx1];
            g_oRst['CR'] = g_oRst['IR'] = g_oRst['AR'] = o;
         }
      }
         // console.log(i + " -> " + aT[1]);
    }
}

const url = "https://www.first.org/cvss/specification-document";
if(!fs.existsSync(szName))
   curl.get(url, null, (err,resp,body)=>{
   if(resp.statusCode == 200){
      fs.writeFileSync(szName,body);
      parseData(body);
   }
   else{
      
      console.log("error while fetching url");
   }
   });
else parseData(fs.readFileSync(szName));
setTimeout(function(){
   fs.writeFileSync("CVSS-Parse.json",s = JSON.stringify(g_oRst,null,2));
   console.log(s)
},3000);
