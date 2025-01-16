namespace backend.Models;

public record TodoItem {
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public bool IsDone { get; set; }
}

public class TodoDB {

    private static List<TodoItem> _todos = new List<TodoItem>() {
        new TodoItem { Id = 1, Title = "Todo 1", IsDone = false },
        new TodoItem { Id = 2, Title = "Todo 2", IsDone = true }
    };

    public static List<TodoItem> GetTodos() {
        return _todos;
    }

    public static TodoItem ? GetTodo(int id) {
        return _todos.SingleOrDefault(t => t.Id == id);
    }

    public static TodoItem AddTodo(TodoItem todo) {
        todo.Id = _todos.Max(t => t.Id) + 1;
        _todos.Add(todo);
        return todo;
    }

    // only update values that are not null
    public static TodoItem UpdateTodo(int id, TodoItem todo) {
        var index = _todos.FindIndex(t => t.Id == id);
        if (index == -1) {
            return null;
        }
        
        var existingTodo = _todos[index];

        if (!string.IsNullOrEmpty(todo.Title)) {
            existingTodo.Title = todo.Title;
        }
        
        if (todo.IsDone != existingTodo.IsDone) {
            existingTodo.IsDone = todo.IsDone;
        }

        return existingTodo;
    }

    public static void DeleteTodo(int id) {
        _todos = _todos.FindAll(t => t.Id != id).ToList();
    }

}

