package com.example.hmcts.service;

import com.example.hmcts.enums.Status;
import com.example.hmcts.exceptions.TaskNotFoundException;
import com.example.hmcts.model.Task;
import com.example.hmcts.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task1, task2, task3;

    @BeforeEach
    public void setup() {
        task1 = new Task("1st Task", "1st Desc", Status.INACTIVE, LocalDate.now());
        task1.setId(1L);
        task2 = new Task("2nd Task", "2nd Desc", Status.IN_PROGRESS, LocalDate.now());
        task2.setId(2L);
        task3 = new Task("3rd Task", "3rd Desc", Status.COMPLETE, LocalDate.now());
        task3.setId(3L);
    }

    @Test
    public void testGetTaskById_Successfully() {
        Mockito.when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));

        Task result = taskService.getTaskById(1L);

        assertNotNull(result);
        assertEquals("1st Task", result.getTitle());
        assertEquals(1L, result.getId());
    }

    @Test
    public void testGetTaskById_NotFound() {
        Mockito.when(taskRepository.findById(4L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.getTaskById(4L));
    }

    @Test
    public void testGetAllTasks_PaginationAcrossPages() {
        Sort sort = Sort.by(Sort.Direction.ASC, "title");

        Pageable firstPageRequest = PageRequest.of(0, 2, sort);
        Page<Task> firstPage = new PageImpl<>(Arrays.asList(task1, task2), firstPageRequest, 3);

        Pageable secondPageRequest = PageRequest.of(1, 2, sort);
        Page<Task> secondPage = new PageImpl<>(Collections.singletonList(task3), secondPageRequest, 3);

        Mockito.when(taskRepository.findAll(firstPageRequest)).thenReturn(firstPage);
        Mockito.when(taskRepository.findAll(secondPageRequest)).thenReturn(secondPage);

        Page<Task> page0 = taskService.getAllTasks(0, 2, "title", "ASC");
        Page<Task> page1 = taskService.getAllTasks(1, 2, "title", "ASC");

        assertFalse(page0.isEmpty());
        assertEquals(2, page0.getContent().size());
        assertEquals("1st Task", page0.getContent().getFirst().getTitle());

        assertFalse(page1.isEmpty());
        assertEquals(1, page1.getContent().size());
        assertEquals("3rd Task", page1.getContent().getFirst().getTitle());
    }


    @Test
    public void testGetAllTasks_ThrowsException_WhenPageIsNegative() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                taskService.getAllTasks(-1, 2, "title", "ASC")
        );
        assertEquals("Page index must not be negative.", exception.getMessage());
    }

    @Test
    public void testGetAllTasks_ThrowsException_WhenPageSizeIsZero() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                taskService.getAllTasks(0, 0, "title", "DESC")
        );
        assertEquals("Page size must be greater than zero.", exception.getMessage());
    }

    @Test
    public void testGetAllTasks_ThrowsException_WhenSortDirectionIsInvalid() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                taskService.getAllTasks(0, 2, "title", "WRONG")
        );
        assertEquals("Invalid sort direction. Must be 'ASC' or 'DESC'.", exception.getMessage());
    }


    @Test
    public void testDeleteTaskById_Successfully() throws TaskNotFoundException {
        Mockito.when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));
        Mockito.doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteTaskById(1L);

        Mockito.verify(taskRepository).deleteById(1L);
    }

    @Test
    public void testDeleteTaskById_NotFound() {
        Mockito.when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.deleteTaskById(99L));
        Mockito.verify(taskRepository, Mockito.never()).deleteById(Mockito.anyLong());
    }

    @Test
    public void updateTaskById_Successfully() {
        Mockito.when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));
        Mockito.when(taskRepository.save(task1)).thenReturn(task1);
        // Act
        taskService.updateTask(1L, Status.COMPLETE);

        // Assert
        assertEquals(Status.COMPLETE, task1.getStatus());
        Mockito.verify(taskRepository).save(task1);
    }

    @Test
    public void updateTaskById_NotFound(){
        Mockito.when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.updateTask(99L, Status.COMPLETE));
        Mockito.verify(taskRepository, Mockito.never()).save(Mockito.any(Task.class));
    }
}
