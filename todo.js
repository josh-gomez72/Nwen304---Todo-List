$(document).ready(function(e) {
	var currentTask; //Used to store a task that we want to delete via the dialog box
	var ERROR_LOG = console.error.bind(console);
	
	$.ajax({
		method: 'GET',
		url: "http://localhost:8080/test_database"
	}).then(redraw,ERROR_LOG);	
	
	$('#add-todo').button({
		icons: { primary:  "ui-icon-circle-plus"}}).click(
		function(){
			$('#new-todo').dialog('open');
		});
		
	$('#new-todo').dialog({
		modal: true, autoOpen: false,
		buttons : {
			"Add task": function(){
				// A GET request. If successful, this passesdata to the ‘redraw()’ function
			  //alert("Something");
           
				var taskName = $('#task').val();
				if (taskName === ""){return false;}
				var taskHTML = '<li><span class="done">%</span>';
				taskHTML += '<span class="delete">x</span>';
				taskHTML += '<span class="task"></span></li>';
				var $newTask = $(taskHTML);
				$newTask.find('.task').text(taskName);
				
				addTask(taskName); //ajax call
				
				$newTask.hide();
				$('#todo-list').prepend($newTask);
				$newTask.show('clip',250).effect('highlight',1000);
				$(this).dialog('close');
				$('#task').val(''); //This bit clears the dialog box
				
				},
			"Cancel": function(){ $(this).dialog('close');}
			}
		});
		
	$('#todo-list').on('click', '.done', function () {
		var $taskItem = $(this).parent('li');
		$taskItem.slideUp(250, function () {
			var $this = $(this);
			$this.detach();		//List item is gone from the list but still exists in memory
			var taskName = $this.context.innerText.replace("%x", "");
			console.log(taskName);
			
			completeTask(taskName); //ajax call	
			
			$('#completed-list').prepend($this);
			$this.slideDown();	
			});		
		});
		
	$('.sortlist').sortable({
		connectWith: '.sortlist', //connect the two lists together since they have the same class
		cursor: 'pointer',
		placeholder: 'ui-state-highlight',
		cancel: '.delete,.done'
		});
		
	$('.sortlist').on('click','.delete', function(){
		currentTask = $(this);
		$('#confirm-delete').dialog('open');
	});
	
	$('#confirm-delete').dialog({
		modal: true, autoOpen: false,
		buttons : {
			"Yes": function () {
				var taskName = currentTask.parent('li').find('.task')[0].innerText;	
				
				deleteTask(taskName); //ajax call
           	
		   currentTask.parent('li').effect('puff', function() { currentTask.remove(); });
			$(this).dialog('close');
		},
			"No": function () { $(this).dialog('close');}	
		}
	});
	
	
	
//Ajax Methods

//Add an task
function addTask(taskName){
	$.ajax({
    method: 'PUT',
    url: "http://localhost:8080/task/create/",
    data: JSON.stringify({
		task: taskName
	 }),
	 contentType: "application/json",
	 dataType: "json"
 }).then(success_func, ERROR_LOG);
}

function completeTask(taskName){
		$.ajax({
        method: 'POST',
        url: "http://localhost:8080/task/update/",
        data: JSON.stringify({
				task: taskName
			}),
			contentType: "application/json",
			dataType: "json"
     }).then(updated_func, ERROR_LOG);
}

function deleteTask(taskName){
		$.ajax({
      	method: 'DELETE',
         url: "http://localhost:8080/task/delete/",
         data: JSON.stringify({
				task: taskName
			}),
			contentType: "application/json",
			dataType: "json"
     }).then(deleted_func, ERROR_LOG);
}


//For debugging
function success_func(data){
	//Function that handle success
	console.log('posted data.', data);
};

function updated_func(data){
	//Function that handle success
	console.log('updated data.', data);
};

function deleted_func(data){
	//Function that handle success
	console.log('deleted data.', data);
};
	
function redraw(data){
//alert(data);
//Prints them in order cool
for (var i = 0; i < data.length; i++){
		var taskName = data[i].item;
		var completed = data[i].completed;
		//console.log(taskName);
		//console.log(completed);
		displayTask(taskName, completed);
}
};

function displayTask(taskName, completed){
		var taskHTML = '<li><span class="done">%</span>';
		taskHTML += '<span class="delete">x</span>';
		taskHTML += '<span class="task"></span></li>';
		var $newTask = $(taskHTML);
		$newTask.find('.task').text(taskName);
			
				
		$newTask.hide();
		if (completed){
			$('#completed-list').prepend($newTask);
		}
		else{
			$('#todo-list').prepend($newTask);
		}
		$newTask.show('clip',250).effect('highlight',1000);
		$('#task').val(''); //This bit clears the dialog box

}
}); // end ready
