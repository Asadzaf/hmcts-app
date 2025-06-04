package com.example.hmcts.controller;

import com.example.hmcts.dto.TaskUpdateRequest;
import com.example.hmcts.model.Task;
import com.example.hmcts.service.TaskService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private final TaskService taskService;
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {

        Page<Task> taskPage = taskService.getAllTasks(page, size, sortBy, direction);

        Map<String, Object> response = new HashMap<>();
        response.put("tasks", taskPage.getContent());
        response.put("currentPage", taskPage.getNumber());
        response.put("totalItems", taskPage.getTotalElements());
        response.put("totalPages", taskPage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id){
      logger.info("Fetching task with id : {} ", id);
      return taskService.getTaskById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> createTask(@RequestBody Task task){
        logger.info("Creating task: {}", task);
        taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body("Task created successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id){
        logger.info("Deleting task with id: {}", id);
        taskService.deleteTaskById(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestBody @Valid TaskUpdateRequest request) {
        logger.info("Updating status of task: {}", id);
        taskService.updateTask(id, request.getStatus());
        Task updatedTask = taskService.getTaskById(id);
        return ResponseEntity.ok(updatedTask);
    }
}
