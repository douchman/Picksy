package com.buck.vstournament.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping( {"", "/","home", "main"})
    public String redirectToIndex(){
        return "redirect:/index";
    }

    @GetMapping("index")
    public String index(){
        return "home/home";
    }
}
