package com.example.hmcts.dto;

import com.example.hmcts.enums.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskUpdateRequest {
    @NotNull(message = "Status cannot be null")
    private Status status;

}
