$(document).ready(function(){


  
$('#searchMovie').on('submit', ()=>{

   var search = $('#searchMovie input').val()

   if(search.length != 0){

     $.ajax({
         method: 'GET',
         url: '/profile/movie/information',
         success: function(data){ 
           console.log('ok')
        }
     });
                     
   }else {
     alert('The search field must be filled in')
   }
});


                            
  
 
  
 






    $('#addMovie').on('submit', ()=>{
      var item = $('#addMovie input');
      var movie = {title: item.val()};
  
      $.ajax({
        method: 'POST',
        url: '/profile/movie',
        data: movie,
        success: function(data){ 
          location.reload();
        }
      }).fail((error)=> alert(error.responseText));

      return false;

  });

 
   var btn = $('button[type="delete"]');
   btn.on('click', function(e){
   var movie = $(e.target).parent().children('span').text();
 
   if (confirm('Do you really wanna delete' + ' ' + movie + ' ' + '?')){
     $.ajax({
       method: 'DELETE',
       url: '/profile/movie/:' + movie,
       success: function(data){
         console.log(data)
           location.reload();        
      }

    });  
   }
 
     });
     
 //another way
     /*
 
 optns = {
   method:'DELETE'
 }
 
 if (confirm('Do you really wanna delete' + ' ' + movie + ' ' + '?')){
   fetch(`/movie/:${movie}`, optns)
   .then((response) =>{
     if(response.ok) location.reload()
     else
     console.log(response.statusText)
   });
 }
 
 });
 
 */
 
 
 



});







  
  
  
