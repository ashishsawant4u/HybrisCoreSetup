$( document ).ready(function() {
	bindEventHandlers();
});

function bindEventHandlers()
{
	$('#downloadImpexBtn').click(function (){
		preareImpexContent();
	});
	
	$('body').on('click', '.add-impex-value-row-link', function(){
		addNewImpexValueRow($(this));
	});
	
	$('.toggle-sidebar').on('click', function() {
        $('#sidebar').toggleClass('collapsed');
        $('#content').toggleClass('collapsed');
        
        $('#impex-list-sidebar').toggleClass('d-none');
    });
    
    $('.impex-file-button').on('click', function() {
		getFileContent($(this).attr('data-impex'));
    });
    
}



function addNewImpexValueRow(addRowLinkRef) 
{
	let $linkDiv = $(addRowLinkRef).parent();
	
	let totalAttr = $linkDiv.closest('tr').prev('tr').find('td').length;
	
	let valueRow = $('<tr>').addClass('table-light impex-value-row');
	
					for (let index = 0; index < totalAttr; index++) 
					{
						let textarea = $('<textarea>').addClass('w-100');
						if(index==0)
						{
							textarea.addClass('d-none');
						}
				        $('<td>').append(textarea).appendTo(valueRow);
					}
	
	$linkDiv.closest('tr').after(valueRow);
	
	 $('html, body').animate({
                scrollTop: $linkDiv.closest('tr').first().offset().top
            }, 1000); 
	
}

function preareImpexContent()
{
	 $('#impexFileContent').removeClass('d-none');
	 $('#impexFileContent').empty();
	 var impexContent=''; 
	 
	 $('#impex-editor table tr:not(.empty-row,.new-row-link-row)').each(function() {
			    var rowContent = '';
			    
			    var totalAttrs = $(this).find('td').length;
			    
			    if($(this).hasClass('impex-header-row'))
				{
					$(this).find('td').each(function(i) 
				    {
				      rowContent += $(this).text(); 
				      if(i < totalAttrs-1)
				      {
						rowContent += ';';  
					  }
				    });
				}
				else if($(this).hasClass('impex-value-row'))
				{
					$(this).find('td').each(function(i) 
				    {
				      rowContent += $(this).find('textarea').val(); 
				      if(i < totalAttrs-1)
				      {
						rowContent += ';';  
					  }
				    });
				}
				else
				{
					$(this).find('td').each(function() 
				    {
						rowContent += $(this).text();
				    });
				}
			    
			    impexContent += rowContent + '<br>'; 
			  });
			  
     $('#impexFileContent').html(impexContent);
}


function getFileContent(fileName)
{
	$("#impex-editor").empty();
	
	$.ajax({
	  type: "GET",
	  url: "/impexutils/content/"+fileName,
	  cache: false,
	  success: function(data){
		    console.log('done '+data.length);
		    $('#downloadImpexBtn').removeClass('d-none');
		    
		   
		    var table = $('<table>').addClass('table table-bordered');
		    var thead = $('<thead>').appendTo(table);
		    var tbody = $('<tbody>').appendTo(table);
			for (let i = 0; i < data.length; i++) 
			{
				
				
				let isHeader = data[i].toLowerCase().startsWith('insert_update') || data[i].toLowerCase().startsWith('update');
				let isMicro = data[i].startsWith('$');
				let isValueRow = data[i].startsWith(';');
				let isImpexComment = data[i].startsWith('#');
				var attributes = data[i].split(';');
				if(isHeader)
				{
					if(i!==0 && !data[i-1].startsWith('#'))
					{
						$('<tr>').addClass('empty-row').appendTo(tbody);
					}
					
					let row = $('<tr>').addClass('table-info mt-2 impex-header-row').appendTo(tbody);
					$.each(attributes, function(index, attr) {
						let $col = $('<td>');
						if(index==0)
						{
							//$col.addClass('text-break');
						}
				        $col.text(attr).appendTo(row);
				    });
				    
				    var newValueRowLink = $('<a>', {
					        text: 'Add Row',
					        class:'add-impex-value-row-link link-dark',
					        href:'#'
					      });
				    
				    let newEntryLinkRow = $('<tr>').addClass('new-row-link-row').appendTo(tbody);
					$('<td>').attr('colspan','4').append(newValueRowLink).appendTo(newEntryLinkRow);
				}
				else if(isMicro)
				{
						let row = $('<tr>').appendTo(tbody);
						$('<td>').attr('colspan','3').addClass('text-danger').text(data[i]).appendTo(row);
				}
				else if(isValueRow)
				{
					let row = $('<tr>').addClass('table-light impex-value-row').appendTo(tbody);
					$.each(attributes, function(index, attr) {
						let textarea = $('<textarea>').addClass('w-100').val(attr);
						if(index==0)
						{
							textarea.addClass('d-none');
						}
				        $('<td>').append(textarea).appendTo(row);
				    });
				}
				else if(isImpexComment)
				{
					$('<tr>').addClass('empty-row no-border-row').appendTo(tbody);
					let row = $('<tr>').addClass('no-border-row').appendTo(tbody);
					$('<td>').attr('colspan','4').addClass('text-muted').text(data[i]).appendTo(row);
				}
				else
				{
					
				}
				 
			}
			$("#impex-editor").append(table);	
			
		}	
	});
}