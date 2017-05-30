$(document).on('click', '#submitPoll', function() {
	var $numSelected = 0;
	var $answers = $('.pollAnswer');

	$('.pollAnswer').each(function(i, ans) {
		if (ans.checked){
			$numSelected++;
		}
	});


	if ($numSelected == 0){
		alert('Select at least 1 option');
		event.preventDefault();
	}
});