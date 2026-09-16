(function(){
  var KEY = 'ma-theme';
  var buttons = document.querySelectorAll('.theme-toggle button');
 
  function apply(choice){
    if(choice === 'auto'){
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', choice);
    }
    buttons.forEach(function(b){
      b.setAttribute('aria-pressed', String(b.dataset.themeChoice === choice));
    });
  }
 
  function stored(){
    try{ return localStorage.getItem(KEY); }
    catch(e){ return null; }
  }
 
  function save(choice){
    try{ localStorage.setItem(KEY, choice); }
    catch(e){ /* storage unavailable, still apply for this session */ }
  }
 
  buttons.forEach(function(b){
    b.addEventListener('click', function(){
      var choice = b.dataset.themeChoice;
      save(choice);
      apply(choice);
    });
  });
 
  apply(stored() || 'auto');
})();