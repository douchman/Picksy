package com.buck.vstournament.controller.support;

import com.buck.vstournament.controller.support.exception.UnAuthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;
import java.util.Optional;

public class AuthGuard {

    private static final String TOKEN_COOKIE_NAME = "token";

    private AuthGuard() {}

    public static void requireAuth() {
        HttpServletRequest request = getCurrentRequest();

        boolean hasToken = Optional.ofNullable(request.getCookies()).stream().flatMap(Arrays::stream)
                .anyMatch( cookie -> TOKEN_COOKIE_NAME.equals(cookie.getName()));

        if(!hasToken) {
            throw new UnAuthorizedException();
        }

    }

    private static HttpServletRequest getCurrentRequest() {
        return ((ServletRequestAttributes)
                RequestContextHolder.currentRequestAttributes())
                .getRequest();
    }
}
