function ook(code) {
    code = code.replace(/Ook/g, "");
    code = code.replace(/\s/g, "");
    var retstr="";
    for(var i=0;i<code.length;i+=2){
        var lstr=code[i]+code[i+1];
        retstr+=change(lstr);
    }
    return retstr;
}

function change(str){
    switch(str){
        case ".?":
        return ">";
        case "?.":
        return "<";
        case "..":
        return "+";
        case "!!":
        return "-";
        case ".!":
        return ",";
        case "!.":
        return ".";
        case "!?":
        return "[";
        case "?!":
        return "]";
    }
}

module.exports=ook;