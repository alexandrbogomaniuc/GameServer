package com.dgphoenix.casino.filters;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;

/**
 * URL path normalization filter to fix double-slash issues in asset paths.
 * Normalizes consecutive slashes (e.g., //callouts/ -> /callouts/)
 */
public class UrlNormalizationFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {
        // No initialization needed
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String requestUri = httpRequest.getRequestURI();

            // Normalize consecutive slashes to single slash
            if (requestUri != null && requestUri.contains("//")) {
                String normalizedUri = requestUri.replaceAll("/+", "/");

                // Wrap the request with normalized URI
                HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(httpRequest) {
                    @Override
                    public String getRequestURI() {
                        return normalizedUri;
                    }

                    @Override
                    public StringBuffer getRequestURL() {
                        StringBuffer url = new StringBuffer();
                        String scheme = getScheme();
                        int port = getServerPort();

                        url.append(scheme).append("://").append(getServerName());
                        if ((scheme.equals("http") && port != 80) || (scheme.equals("https") && port != 443)) {
                            url.append(':').append(port);
                        }
                        url.append(normalizedUri);

                        return url;
                    }

                    @Override
                    public String getServletPath() {
                        // Jetty DefaultServlet uses getServletPath() to find resources
                        String originalServletPath = super.getServletPath();
                        if (originalServletPath != null && originalServletPath.contains("//")) {
                            return originalServletPath.replaceAll("/+", "/");
                        }
                        return originalServletPath;
                    }

                    @Override
                    public String getPathInfo() {
                        // Jetty DefaultServlet uses getPathInfo() to find resources
                        String originalPathInfo = super.getPathInfo();
                        if (originalPathInfo != null && originalPathInfo.contains("//")) {
                            return originalPathInfo.replaceAll("/+", "/");
                        }
                        return originalPathInfo;
                    }
                };

                chain.doFilter(wrappedRequest, response);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // No cleanup needed
    }
}
