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
	
	let totalAttr = $linkDiv.nextAll('div.impex-value-row').first().find('div.impex-value-col').length;
	
	let valueRow = '<div class="row impex-row impex-value-row bg-light">';
					for (let a = 0; a < totalAttr; a++) 
					{
						 valueRow = valueRow + '<div class="col-lg border p-2 impex-value-col">';
						 let hideFirstCol = (a==0) ? 'd-none' : '';//first column
						 valueRow = valueRow + '<textarea class="form-control '+hideFirstCol+'  " rows="1"></textarea>'
						 valueRow = valueRow + "</div>";
					}
					valueRow = valueRow + "</div>";
	
	
	$linkDiv.nextAll('div.type-separator').first().before(valueRow);
	
	 $('html, body').animate({
                scrollTop:  $linkDiv.prevAll('div.type-separator').first().offset().top
            }, 1000); 
	
}

function preareImpexContent()
{
	 $('#impexFileContent').removeClass('d-none');
	 $('#impexFileContent').empty();
	 let impexContent; 
	 
	 $('.impex-row').each(function() {
            
            if( $(this).find('div.impex-header-col').length > 0 )
            {
				let totalHeaderCol = $(this).find('div.impex-header-col').length;
				 impexContent = impexContent + '</br>';
				 $(this).find('div.impex-header-col').each(function(i, attr) {
						impexContent = impexContent + $(attr).text();
						if(i < totalHeaderCol-1)
						{
							impexContent = impexContent + ';';
						}
				 });
			}
			else if($(this).find('div.impex-value-col').length > 0)
			{
				let totalValueCol = $(this).find('div.impex-value-col').length;
				impexContent = impexContent + '</br>';
				$(this).find('div.impex-value-col textarea').each(function(i, attr) {
						if(i > 0 && i < totalValueCol)
						{
							impexContent = impexContent + ';';
						}
						impexContent = impexContent+ $(attr).val();
				 });
			}
			else
			{
				impexContent = impexContent + '</br>' + $(this).text();
			}
     });
     $('#impexFileContent').append(impexContent);
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
		    
			for (let i = 0; i < data.length; i++) 
			{
				let isHeader = data[i].toLowerCase().startsWith('insert_update') || data[i].toLowerCase().startsWith('update');
				let isMicro = data[i].startsWith('$');
				let isValueRow = data[i].startsWith(';');
				if(isHeader)
				{
					let headerRow = '<div class="row impex-row impex-header-row mt-2 d-flex flex-nowrap">';
					
					var attributes = data[i].split(';');
					
					for (let a = 0; a < attributes.length; a++) 
					{
						 headerRow = headerRow + '<div class="col-lg border bg-info p-2 impex-header-col text-nowrap">';
						 headerRow = headerRow + attributes[a]
						 headerRow = headerRow + "</div>";
					}
					headerRow = headerRow + "</div>";
					$("#impex-editor").append(headerRow);
					
					$("#impex-editor").append('<div class="row w-100"><a href="#" class="text-primary add-impex-value-row-link">add row</a></div>');
					
					let valueRow = '<div class="row impex-row impex-value-row bg-light d-flex flex-nowrap">';
					for (let a = 0; a < attributes.length; a++) 
					{
						 valueRow = valueRow + '<div class="col-lg border p-2 impex-value-col">';
						 let hideFirstCol = (a==0) ? 'd-none' : '';//first column
						 valueRow = valueRow + '<textarea class="form-control '+hideFirstCol+'  " rows="1"></textarea>'
						 valueRow = valueRow + "</div>";
					}
					valueRow = valueRow + "</div>";
					$("#impex-editor").append(valueRow);
					
					$("#impex-editor").append('<div class="type-separator"></div>');
				}
				else if(isMicro)
				{
					$("#impex-editor").append('<p class="impex-row mt-2 mb-0 text-danger">'+data[i]+'</p>');
				}
				else if(isValueRow)
				{
					let valRowArr = data[i].split(";");
					
					let valueRow = '<div class="row impex-row impex-value-row bg-light d-flex flex-nowrap">';
					for (let a = 0; a < valRowArr.length; a++) 
					{
						 valueRow = valueRow + '<div class="col-lg border p-2 impex-value-col">';
						 let hideFirstCol = (a==0) ? 'd-none' : '';//first column
						 valueRow = valueRow + '<textarea class="form-control '+hideFirstCol+'  ">'+valRowArr[a]+'</textarea>'
						 valueRow = valueRow + "</div>";
					}
					valueRow = valueRow + "</div>";
					$("#impex-editor").append(valueRow);
				}
				else
				{
					$("#impex-editor").append('<p class="impex-row mt-2 mb-0 text-muted">'+data[i]+'</p>');
				}
				
			}	
		}	
	});
}