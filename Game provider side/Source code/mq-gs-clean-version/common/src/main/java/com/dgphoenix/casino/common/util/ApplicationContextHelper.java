package com.dgphoenix.casino.common.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * @author <a href="mailto:fateyev@dgphoenix.com">Anton Fateyev</a>
 * @since 14.09.16
 */
public class ApplicationContextHelper implements ApplicationContextAware {

    private static final Logger LOG = LogManager.getLogger(ApplicationContextHelper.class);

    private static volatile ApplicationContext applicationContext;

    public ApplicationContextHelper() {
        System.out.println("DEBUG: ApplicationContextHelper instantiated: " + this);
        LOG.debug("ApplicationContextHelper created");
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("DEBUG: ApplicationContextHelper.setApplicationContext called with: " + applicationContext);
        ApplicationContextHelper.applicationContext = applicationContext;
    }

    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    public static <T> T getBean(Class<T> clazz) {
        if (applicationContext == null) {
            System.err
                    .println("CRITICAL: ApplicationContextHelper.getApplicationContext() is NULL when requesting bean: "
                            + clazz.getName());
            throw new IllegalStateException("ApplicationContext is not initialized yet!");
        }
        return applicationContext.getBean(clazz);
    }
}
