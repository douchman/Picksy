package com.buck.vstournament.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PageController {

    @GetMapping("index")
    public String index() { return "index/index"; }

    @GetMapping( {"", "/","home", "main"})
    public String redirectToIndex(){
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
        return "topic/edit/create/topic-create";
    }

    @GetMapping("topic/my")
    public String myTopics(){
        return "topic/my/my-topic";
    }

    @GetMapping("topic/modify/{topicId}")
    public String modifyTopic(@PathVariable String topicId){
        return "topic/edit/modify/topic-modify";
    }

    @GetMapping("topic/play/{id}")
    public String playTopic(@PathVariable Integer id){
        // 직관적인 URL 을 위해 PathVariable 사용
        return "topic/play/topic-play";
    }

    @GetMapping("statistics/topic/{id}")
    public String topicStatistics(@PathVariable Integer id){
        // 직관적인 URL 을 위해 PathVariable 사용
        return "statistics/topic-entry-stats/topic-statistics";
    }

    @GetMapping("statistics/versus/topic/{topicId}/entry/{entryId}")
    public String entryVersusStatistics(
            @PathVariable Integer topicId,
            @PathVariable Integer entryId){
        // 직관적인 URL 을 위해 PathVariable 사용
        return "statistics/entry-versus/entry-versus-statistics";
    }

    // 404
    @GetMapping("page-not-found")
    public String notFound(){
        return "error/404/404";
    }
}
