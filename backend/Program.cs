using Microsoft.OpenApi.Models;
using backend.Models;
using backend.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Define CORS policy name
var MyAllowSpecificOrigins = "MyAllowSpecificOrigins";

// Add services to the container.
builder.Services.AddCors(options => {
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:5173",  // frontend dev URL
                            "http://www.contoso.com") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Swagger for API documentation and testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// add JWT authentication
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

    };
});
builder.Services.AddAuthorization();


// Link to the database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));


var app = builder.Build();

// Apply CORS policy
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "todo list API v1"));
}


// Define JWT token generation
app.MapPost("/auth/login",
    async (UserDto userDto, AppDbContext db) => {

        var user = await db.Users.SingleOrDefaultAsync(u => u.Username == userDto.Username);

        // need to hash the password in the future
        if (user is null || user.PasswordHash != userDto.Password) return Results.Unauthorized();

        var issuer = builder.Configuration["Jwt:Issuer"];
        var audience = builder.Configuration["Jwt:Audience"];
        var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);

        var tokenDescriptor = new SecurityTokenDescriptor {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, userDto.Username),
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Results.Ok(new { Token = tokenHandler.WriteToken(token) });


        return Results.Unauthorized();
    }
);

// seede the database with some user data
app.MapGet("/seed", async (AppDbContext db) => {
    db.Users.Add(new User { Username = "admin", PasswordHash = "admin" });
    await db.SaveChangesAsync();
    return Results.Ok("Database seeded");
});


// main routes
app.MapGet("/", () => "Hello World!");

app.MapGet("/todos", async (AppDbContext db) => await db.Todos.ToListAsync());

app.MapGet("/todos/{id}", async (int id, AppDbContext db) => {
    var todo = await db.Todos.FindAsync(id);
    if (todo is null) return Results.NotFound();
    
    return Results.Ok(todo);
});

app.MapPost("/todos", async (TodoItem todo, AppDbContext db) => {
    todo.Id = db.Todos.Max(t => t.Id) + 1;
    db.Todos.Add(todo);
    await db.SaveChangesAsync();
    return Results.Created($"/todos/{todo.Id}", todo);
});

app.MapPut("/todos/{id}", async (int id, TodoItem inputTodo, AppDbContext db) => {
    var todo = await db.Todos.FindAsync(id);
    if (todo is null) return Results.NotFound();

    todo.Title = string.IsNullOrEmpty(inputTodo.Title) ? todo.Title : inputTodo.Title;
    todo.IsDone = inputTodo.IsDone;

    await db.SaveChangesAsync();
    return Results.Ok(todo);
});

app.MapDelete("/todos/{id}", async (int id, AppDbContext db) => {
    var todo = await db.Todos.FindAsync(id);
    if (todo is null) return Results.NotFound();

    db.Todos.Remove(todo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// auth dev test route
app.MapGet("/jwt/test", () => {
    return Results.Ok("You are authorized");
}).RequireAuthorization();

app.Run();
