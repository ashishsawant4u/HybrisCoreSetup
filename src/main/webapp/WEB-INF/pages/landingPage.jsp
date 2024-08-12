<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
   
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>      
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="tags" tagdir="/WEB-INF/tags" %>        
    
        
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<tags:scripts/>
<title>Impex Utility</title>
</head>
<body>
<div class="container-fluid code-content">
	
	<div class="sidebar" id="sidebar">
	    
	    <a href="#" class="toggle-sidebar">
	    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="" class="bi bi-square-half" viewBox="0 0 16 16">
		  <path d="M8 15V1h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1zm6 1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
		</svg>
		</a>
		<div id="impex-list-sidebar" class="mt-2">
			<c:forEach var="impex" items="${impexFiles}">
					<button type="button" class="btn btn-outline-dark w-100 text-start m-2 impex-file-button text-wrap text-break" data-impex="${impex}">
					${impex} 
					</button>
					</br>
			</c:forEach>
		</div>
	</div>
	<div class="content container-fluid" id="content">
	
	<form class="row row-cols-lg-auto g-3 align-items-center my-2 d-none sticky" id="downloadImpexSection">
  		<div class="col-6">
			<div class="input-group">
		      <span class=" fw-bold input-group-text" id="fileNameSpan"></span>
		      <button type="button" class="btn btn-dark form-control" id="downloadImpexBtn">Download Impex</button>
		  </div>
		</div>
		<div class="col-6">
			<button type="button" class="btn btn-outline-danger form-control" id="addMacroBtn">Add Macro</button>
		</div>
	</form>	
	
		
		
		
		
		<div id="impex-editor" class="">
			<table id="impex-editor-table" class="table"></table>
		</div>
		
		<div id="impexFileContent" class="text-white bg-dark p-2 m-2 d-none">
		</div>
	</div>

	
</div>
</body>
</html>



