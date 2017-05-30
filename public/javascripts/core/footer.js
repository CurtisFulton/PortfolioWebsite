 function autoHeight() {
   $('main').css('min-height', 0);
   $('main').css('min-height', (
     $(document).height() 
     - $('header').height() 
     - $('footer').height()
   ));
 }

 // onDocumentReady function bind
 $(document).ready(function() {
   autoHeight();
 });

 // onResize bind of the function
 $(window).resize(function() {
   autoHeight();
 });