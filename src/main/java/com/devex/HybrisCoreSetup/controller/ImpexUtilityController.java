package com.devex.HybrisCoreSetup.controller;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/impexutils")
public class ImpexUtilityController 
{
	Logger log = LoggerFactory.getLogger(ImpexUtilityController.class);
	
	@Value("${template.impex.directory.location}")
	String templateImpexLocation;
	
	@Value("classpath:impex-templates/*")
	private Resource[] resources;

	@GetMapping("/home")
	public String landingPage(Model model)
	{
		
		List<String> impexFiles = List.of(resources).stream()
				.map(r->r.getFilename())
				.collect(Collectors.toList());
		
		impexFiles.sort(Comparator.comparingInt(ImpexUtilityController::getFileNumber));
         
        model.addAttribute("impexFiles", impexFiles);
		
		return "landingPage";
	}
	
	
	 private static int getFileNumber(String f) 
	 {
		 return Integer.parseInt(f.split("-")[0]); 
	 }
	
	Function<String, Integer> getFileNumber = (f) -> Integer.parseInt(f.split("-")[0]); 
	
	@GetMapping("/content/{fileName}")
	@ResponseBody
	public List<String> fileContent(@PathVariable String fileName)
	{
		try 
		{
			Path filePath =  List.of(resources).stream()
					   .filter(f -> f.getFilename().equals(fileName))
					   .findAny().get()
					   .getFile().toPath();

			return Files.readAllLines(filePath, StandardCharsets.UTF_8);
		} 
		catch (Exception e) 
		{
			log.error("error while reading impex "+e);
		}
		return null;
	}	
}

