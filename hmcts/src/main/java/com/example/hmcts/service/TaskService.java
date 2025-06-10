package com.example.hmcts.service;

import com.example.hmcts.enums.Status;
import com.example.hmcts.exceptions.TaskNotFoundException;
import com.example.hmcts.model.Task;
import com.example.hmcts.repository.TaskRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public void createTask(Task task) {
        taskRepository.save(task);
    }

    public Page<Task> getAllTasks(int page, int size, String sortBy, String direction) {
        if (page < 0) {
            throw new IllegalArgumentException("Page index must not be negative.");
        }

        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than zero.");
        }

        Sort.Direction sortDirection;
        try {
            sortDirection = Sort.Direction.fromString(direction);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sort direction. Must be 'ASC' or 'DESC'.");
        }

        if ("status".equalsIgnoreCase(sortBy)) {
            Pageable pageable = PageRequest.of(page, size);
            Page<Task> taskPage = taskRepository.findAll(pageable);

            List<Status> customOrder = (sortDirection == Sort.Direction.ASC)
                    ? List.of(Status.IN_PROGRESS, Status.PENDING, Status.COMPLETE, Status.INACTIVE)
                    : List.of(Status.INACTIVE, Status.COMPLETE, Status.PENDING, Status.IN_PROGRESS);


            List<Task> sortedContent = taskPage.getContent().stream()
                    .sorted(Comparator.comparingInt(task -> customOrder.indexOf(task.getStatus())))
                    .toList();

            return new PageImpl<>(sortedContent, pageable, taskPage.getTotalElements());
        }

        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return taskRepository.findAll(pageable);
    }



    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task with ID " + id + "not found"));
    }

    public void deleteTaskById(Long id) {
        taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task with ID " + id + "not found"));
        taskRepository.deleteById(id);
    }

    public void updateTask(Long id, Status status) {
        Task taskToUpdate = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException("Task with ID " + id + "not found"));
        taskToUpdate.setStatus(status);
        taskRepository.save(taskToUpdate);
    }
}
