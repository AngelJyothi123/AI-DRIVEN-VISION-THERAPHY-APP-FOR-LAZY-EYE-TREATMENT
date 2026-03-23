package com.vision.vision_app_backend.config;

import com.vision.vision_app_backend.service.CustomUserDetailsService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil,
                     CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        System.out.println("HEADER: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("No Bearer token");
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            String email = jwtUtil.extractUsername(token);
            System.out.println("EMAIL FROM TOKEN: " + email);

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            System.out.println("USER FOUND: " + userDetails.getUsername());
            System.out.println("AUTHORITIES: " + userDetails.getAuthorities());

            if (jwtUtil.isTokenValid(token)) {

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails.getUsername(),
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);

                System.out.println("AUTH SET SUCCESSFULLY");
            } else {
                System.out.println("TOKEN INVALID");
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}