package com.buck.vstournament.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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

    @GetMapping("login")
    public String login(){
        return "member/login/login";
    }

    @GetMapping("register")
    public String register(){
        return "member/register/register";
    }

    @GetMapping("topic/create")
    public String createTopic(){
        return "topic/create/topic-create";
    }


    @GetMapping("topic/play/{id}")
    public String playTopic(@PathVariable Integer id){
        // 직관적인 URL 을 위해 PathVariable 사용
        return "topic/play/topic-play";
    }
}
