using Microsoft.EntityFrameworkCore;
using todo_backend.Models;

namespace todo_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<TodoTask> Tasks { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TodoTask>()
            .Property(t => t.Deadline)
            .HasColumnType("timestamp without time zone");
        }  

    }
}
