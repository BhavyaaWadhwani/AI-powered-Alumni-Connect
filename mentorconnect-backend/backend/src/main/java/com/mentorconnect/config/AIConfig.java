package com.mentorconnect.config;

import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

    @Value("${spring.ai.openai.api-key}")
    private String openAiApiKey;

    @Bean
    public OpenAiApi openAiApi() {
        return new OpenAiApi(openAiApiKey);
    }

    @Bean
    public OpenAiChatModel chatModel(OpenAiApi api) {
        return new OpenAiChatModel(api);
    }

    @Bean
    public OpenAiEmbeddingModel embeddingModel(OpenAiApi api) {
        return new OpenAiEmbeddingModel(api);
    }
}
