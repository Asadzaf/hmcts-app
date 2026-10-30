package com.example.hmcts.controller;

import com.example.hmcts.dto.TaskUpdateRequest;
import com.example.hmcts.model.Task;
import com.example.hmcts.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Tasks", description = "Create, view, update and delete caseworker tasks")
public class TaskController {

    @Autowired
    private final TaskService taskService;
    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping()
    @Operation(summary = "Get all tasks", description = "Returns a page of tasks with paging metadata")
    @ApiResponse(responseCode = "200", description = "Page of tasks returned")
    public ResponseEntity<Map<String, Object>> getAllTasks(
            @Parameter(description = "Zero-based page index") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of tasks per page") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Field to sort by, e.g. id, title, status, dueDate") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "ASC or DESC") @RequestParam(defaultValue = "ASC") String direction) {

        Page<Task> taskPage = taskService.getAllTasks(page, size, sortBy, direction);

        Map<String, Object> response = new HashMap<>();
        response.put("tasks", taskPage.getContent());
        response.put("currentPage", taskPage.getNumber());
        response.put("totalItems", taskPage.getTotalElements());
        response.put("totalPages", taskPage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a task by ID")
    @ApiResponse(responseCode = "200", description = "Task found")
    @ApiResponse(responseCode = "404", description = "No task with that ID")
    public Task getTaskById(@PathVariable Long id){
      logger.info("Fetching task with id : {} ", id);
      return taskService.getTaskById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a task", description = "Requires a title, status and due date/time (yyyy-MM-ddTHH:mm); description is optional")
    @ApiResponse(responseCode = "201", description = "Task created")
    public ResponseEntity<String> createTask(@RequestBody Task task){
        logger.info("Creating task: {}", task);
        taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body("Task created successfully");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    @ApiResponse(responseCode = "200", description = "Task deleted")
    @ApiResponse(responseCode = "404", description = "No task with that ID")
    public ResponseEntity<String> deleteTask(@PathVariable Long id){
        logger.info("Deleting task with id: {}", id);
        taskService.deleteTaskById(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task's status")
    @ApiResponse(responseCode = "200", description = "Status updated, returns the updated task")
    @ApiResponse(responseCode = "400", description = "Status missing or not a valid value")
    @ApiResponse(responseCode = "404", description = "No task with that ID")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestBody @Valid TaskUpdateRequest request) {
        logger.info("Updating status of task: {}", id);
        taskService.updateTask(id, request.getStatus());
        Task updatedTask = taskService.getTaskById(id);
        return ResponseEntity.ok(updatedTask);
    }
}
