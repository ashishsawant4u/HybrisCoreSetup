package com.devex.HybrisCoreSetup.configuration;

import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebMvc
public class HybrisCoreSetupConfiguration implements WebMvcConfigurer 
{
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) 
	{
        registry.addResourceHandler("/impex-templates/**") 
                .addResourceLocations("/impex-templates/") 
                .setCachePeriod(0);
    }
}
