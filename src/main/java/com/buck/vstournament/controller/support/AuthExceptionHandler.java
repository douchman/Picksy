package com.buck.vstournament.controller.support;

import com.buck.vstournament.controller.support.exception.UnAuthorizedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AuthExceptionHandler {
    private static final String LOGIN_PAGE_REDIRECT = "redirect:/login";

    @ExceptionHandler(UnAuthorizedException.class)
    public String handleUnAuthorizedException() {
        return LOGIN_PAGE_REDIRECT;
    }
}
