
$(document).on('input', '.pollOption', function() {
	if ($('.pollOption:last').val()) {
		var $newOption = $('.pollOption:last').clone(true);
		$newOption.val(null);
		$("#pollOptions").append($newOption);
	}
});