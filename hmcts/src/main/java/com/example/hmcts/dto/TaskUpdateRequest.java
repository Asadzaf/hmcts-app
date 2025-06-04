package com.example.hmcts.dto;

import com.example.hmcts.enums.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskUpdateRequest {
    // Getters, setters, possibly other fields in the future
    @NotNull(message = "Status cannot be null")
    private Status status;

}
