using Microsoft.EntityFrameworkCore;
using backend.Entities;

namespace backend.Models;

public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<TodoItem> Todos { get; set; } = null!;
}