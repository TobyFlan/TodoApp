using backend.Models;

namespace backend.Entities
{

    public class User {
        public int Id { get; set; } // primary key
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

       public ICollection<TodoItem> Todos { get; set; } = new List<TodoItem>();
    }

} 