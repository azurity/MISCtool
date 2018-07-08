function brainFuck(code, input){
    var brainFuck = new fuckObj(), result='', inputArr = input.split('');
    eval(code.split('').map(function(e){
      switch(e){
        case ',':
          return 'brainFuck.input(inputArr.shift());';
          break;
        case '.':
          return 'result+=brainFuck.output();';
          break;
        case '>':
          return 'brainFuck.moveright();';
          break;
        case '<':
          return 'brainFuck.moveleft();';
          break;
        case '+':
          return 'brainFuck.add();';
          break;
        case '-':
          return 'brainFuck.minus();';
          break;
        case '[':
          return 'while(brainFuck.current()!=0){';
          break;
        case ']':
          return '}';
          break;
        default:
          break;
      }
    }).join(''));
    return result;
  }
  
  function fuckObj(){
    this.data = [0];
    this.i=0;
    
    this.moveright = function(){ // >
      this.i++;
      if(this.data[this.i]==undefined) this.data[this.i]=0;
    }
    
    this.moveleft = function(){ // <
      this.i--;
    }
    
    this.add = function(){ // +
      this.data[this.i] = this.data[this.i]==255 ? 0 : this.data[this.i]+1;
    }
    
    this.minus = function(){ // -
      this.data[this.i] = this.data[this.i]==0 ? 255 : this.data[this.i]-1;
    }
    
    this.input = function(data){ // ,
      this.data[this.i] = data.charCodeAt(0);
    }
    
    this.output = function(){ // .
      return String.fromCharCode(this.data[this.i]);
    }
    
    this.current = function(){
      return this.data[this.i];
    }
  
  }
  
  module.exports=brainFuck;