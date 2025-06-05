namespace todo_backend.Models
{
    public class TodoTask
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime? Deadline { get; set; }
        public bool IsCompleted { get; set; }
    }
}
 