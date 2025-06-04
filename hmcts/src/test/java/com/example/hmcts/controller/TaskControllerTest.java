package com.example.hmcts.controller;

import com.example.hmcts.dto.TaskUpdateRequest;
import com.example.hmcts.enums.Status;
import com.example.hmcts.exceptions.TaskNotFoundException;
import com.example.hmcts.model.Task;
import com.example.hmcts.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void test_getTasksReturnsTasksSuccessfully() throws Exception {
        Task task1 = new Task("Task 1 title","sdf", Status.IN_PROGRESS, LocalDate.now());
        Task task2 = new Task("Task 2 title", "sdf", Status.PENDING, LocalDate.now());

        List<Task> tasks = Arrays.asList(task1,task2);
        Page<Task> taskPage = new PageImpl<>(tasks);

        Mockito.when(taskService.getAllTasks(Mockito.anyInt(), Mockito.anyInt(), Mockito.anyString(), Mockito.anyString()))
                .thenReturn(taskPage);

        mockMvc.perform(MockMvcRequestBuilders.get("/tasks")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortBy", "title")
                        .param("direction", "ASC")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tasks.length()").value(2))
                .andExpect(jsonPath("$.tasks[0].title").value("Task 1 title"))
                .andExpect(jsonPath("$.tasks[1].title").value("Task 2 title"));
    }

    @Test
    public void test_getTaskById_returnsTaskSuccessfully() throws Exception {
        Task task1 = new Task("Test title","sdf", Status.IN_PROGRESS, LocalDate.now());

        Mockito.when(taskService.getTaskById(1L)).thenReturn(task1);

        mockMvc.perform(MockMvcRequestBuilders.get("/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test title"));
    }

    @Test
    public void test_getTaskById_ThrowsTaskNotFoundException() throws Exception {
        Mockito.doThrow(new TaskNotFoundException("Task with ID 1 not found"))
                .when(taskService).getTaskById(1L);

        mockMvc.perform(MockMvcRequestBuilders.get("/tasks/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Task with ID 1 not found"));
    }

    @Test
    public void test_createTask_taskCreatesSuccessfully() throws Exception {
        Task task1 = new Task("sdfs", "sdf", Status.IN_PROGRESS, LocalDate.now());

        Mockito.doNothing().when(taskService).createTask(Mockito.any(Task.class));

        String taskJson = objectMapper.writeValueAsString(task1);

        mockMvc.perform(MockMvcRequestBuilders.post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(taskJson))
                .andExpect(status().isCreated())
                .andExpect(content().string("Task created successfully"));
    }

    @Test
    public void test_deleteTask_deletesTaskSuccessfully() throws Exception {
        Mockito.doNothing().when(taskService).deleteTaskById(1L);

        mockMvc.perform(MockMvcRequestBuilders.delete("/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Task deleted successfully"));
    }

    @Test
    public void test_deleteTask_notFound() throws Exception {
        Mockito.doThrow(new TaskNotFoundException("Task with ID 1 not found"))
                .when(taskService).deleteTaskById(1L);

        mockMvc.perform(MockMvcRequestBuilders.delete("/tasks/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Task with ID 1 not found"));
    }

    @Test
    public void test_updateTask_Successfully() throws Exception {
        Task updatedTask = new Task("sdfs", "sdf", Status.IN_PROGRESS, LocalDate.now());

        TaskUpdateRequest tur = new TaskUpdateRequest();
        tur.setStatus(Status.IN_PROGRESS);

        Mockito.doNothing().when(taskService).updateTask(1L, Status.IN_PROGRESS);
        Mockito.when(taskService.getTaskById(1L)).thenReturn(updatedTask);

        mockMvc.perform(MockMvcRequestBuilders.put("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tur)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
