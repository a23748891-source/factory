package com.factory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MLPredictionResponse {
    private boolean success;
    private List<Double> prediction;
    private List<Integer> inputShape;
    private List<Integer> outputShape;
    private String error;
}

