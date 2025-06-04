package com.example.hmcts.model;

import com.example.hmcts.enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    @Size(max = 255)
    private String title;
    private String description;
    @NonNull
    private Status status;
    @NonNull
    private LocalDate dueDate;

    public Task(String title, String desc, Status status, LocalDate date) {
        this.setTitle(title);
        this.setDescription(desc);
        this.setStatus(status);
        this.setDueDate(date);
    }
}
