package com.devex.HybrisCoreSetup.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class HeaderExtracter 
{
	Logger log = LoggerFactory.getLogger(HeaderExtracter.class);
	
	@Value("${source.impex.directory.location}")
	String sourceImpexLocation;
	
	@Value("${template.impex.directory.location}")
	String templateImpexLocation;
	
	@Value("${impex.with.data}")
	public String impexWithData;
	
	Predicate<String> copyFullImpex = (fileName) -> List.of(impexWithData.split(","))
															.stream()
															.anyMatch(f->f.equals(fileName));
															
	
	Predicate<String> isHeader = (line) -> !line.stripLeading().startsWith(";");
	
	
	
	//@PostConstruct
	public void init() 
	{
		
		try {
			
			FileUtils.cleanDirectory(new File(templateImpexLocation));
			
            Files.list(Paths.get(sourceImpexLocation))
                    .filter(Files::isRegularFile)
                    .forEach(path -> extractHeader(path.toAbsolutePath().toString()));
        } catch (IOException e) {
           log.error("Error listing files: " + e.getMessage());
        }
	}

	
	public void extractHeader(String filePath)
	{
		String fileName = new File(filePath).getName();
		
		List<String> headers = new ArrayList<String>();
		
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) 
        {
            String line;
            while ((line = br.readLine()) != null) 
            {
            	if(copyFullImpex.test(fileName) || isHeader.test(line))
            	{
            		headers.add(line);
            	}
            }
        } 
        catch (IOException e) {
        	log.error("Error reading the file: " + e.getMessage());
        }
        
        if(!headers.isEmpty())
        {
        	prepareTemplate(fileName, headers);
        }
	}
	
	public void prepareTemplate(String fileName,List<String> headers) 
	{
		 String filePath = "C:\\Users\\aarunsaw\\Downloads\\setup-impexes\\template\\"+fileName;

	        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
	            for (String line : headers) 
	            {
	                writer.write(line);
	                writer.newLine();
	            }
	            log.info(fileName+" created successfully");
	        } 
	        catch (IOException e) 
	        {
	        	log.error("Error creating the "+fileName+" --> "+ e.getMessage());
	        }
	}
}
 