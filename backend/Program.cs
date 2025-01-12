using Microsoft.OpenApi.Models;
using backend.DB;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

// add CORS policy to allow all origins
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// add Swagger for API documentation and testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "todo list API", Description = "simple todo list", Version = "v1" });
});

var app = builder.Build();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "todo list API v1"));
}

app.MapGet("/", () => "Hello World!");


app.MapGet("/todos", () => TodoDB.GetTodos());
app.MapGet("/todos/{id}", (int id) => TodoDB.GetTodo(id));
app.MapPost("/todos", (TodoItem todo) => TodoDB.AddTodo(todo));
app.MapPut("/todos/{id}", (int id, TodoItem todo) => TodoDB.UpdateTodo(id, todo));
app.MapDelete("/todos/{id}", (int id) => TodoDB.DeleteTodo(id));


app.Run();