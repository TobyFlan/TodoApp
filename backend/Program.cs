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
                new Claim("UserId", user.Id.ToString()),
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

// TODO: find a way to return token after register
app.MapPost("/auth/register", async (UserDto userDto, AppDbContext db) => {

        // check availability
        if (await db.Users.AnyAsync(u => u.Username == userDto.Username)){
            return Results.BadRequest("Username is already taken.");
        };

        // TODO: add hashing algos
        var hashedPassword = userDto.Password;

        var newUser = new User{
            Username = userDto.Username,
            PasswordHash = hashedPassword
        };

        // save to db
        db.Users.Add(newUser);
        await db.SaveChangesAsync();

        return Results.Ok("User registered successfully.");

    }
);

// seede the database with some user data
app.MapGet("/seed", async (AppDbContext db) =>
{
    if (!db.Users.Any())
    {
        // Add User 1
        var user1 = new User
        {
            Username = "user1",
            PasswordHash = "password1" // Use hashed passwords in production
        };
        db.Users.Add(user1);
        await db.SaveChangesAsync();

        // Add Todos for User 1
        db.Todos.AddRange(
            new TodoItem { Title = "User1 Todo 1", IsDone = false, UserId = user1.Id },
            new TodoItem { Title = "User1 Todo 2", IsDone = true, UserId = user1.Id }
        );

        // Add User 2
        var user2 = new User
        {
            Username = "user2",
            PasswordHash = "password2" // Use hashed passwords in production
        };
        db.Users.Add(user2);
        await db.SaveChangesAsync();

        // Add Todos for User 2
        db.Todos.AddRange(
            new TodoItem { Title = "User2 Todo 1", IsDone = false, UserId = user2.Id },
            new TodoItem { Title = "User2 Todo 2", IsDone = true, UserId = user2.Id }
        );

        // Save all changes to the database
        await db.SaveChangesAsync();

        return Results.Ok("Database seeded with users and their todos.");
    }
    return Results.Ok("Database already seeded.");
});

// temporary route to show users MUST DELETE IN PRODUCTION
app.MapGet("/users", async (AppDbContext db) => {
    return await db.Users.ToListAsync();
});

// main routes
app.MapGet("/", () => "Hello World!");

app.MapGet("/todos", [Authorize] async (HttpContext httpContext, AppDbContext db) => {
    var userId = int.Parse(httpContext.User.FindFirstValue("UserId"));
    return await db.Todos.Where(t => t.UserId == userId).ToListAsync();
});

app.MapGet("/todos/{id}", [Authorize] async (int id, HttpContext httpContext, AppDbContext db) => {
    
    var userId = int.Parse(httpContext.User.FindFirstValue("UserId"));
    var todo = await db.Todos.FindAsync(id);
    if (todo is null || todo.UserId != userId) return Results.NotFound();
    
    return Results.Ok(todo);
});

app.MapPost("/todos", [Authorize] async (TodoItem todo, HttpContext httpContext, AppDbContext db) => {
    var userId = int.Parse(httpContext.User.FindFirstValue("UserId"));
    todo.UserId = userId;
    todo.Id = db.Todos.Max(t => t.Id) + 1;
    db.Todos.Add(todo);
    await db.SaveChangesAsync();
    return Results.Created($"/todos/{todo.Id}", todo);
});

app.MapPut("/todos/{id}", [Authorize] async (int id, TodoItem inputTodo, HttpContext httpContext, AppDbContext db) => {
    var userId = int.Parse(httpContext.User.FindFirstValue("UserId"));
    var todo = await db.Todos.FindAsync(id);
    if (todo is null || todo.UserId != userId) return Results.NotFound();

    todo.Title = string.IsNullOrEmpty(inputTodo.Title) ? todo.Title : inputTodo.Title;
    todo.IsDone = inputTodo.IsDone;

    await db.SaveChangesAsync();
    return Results.Ok(todo);
});

app.MapDelete("/todos/{id}", [Authorize] async (int id, HttpContext httpContext, AppDbContext db) => {
    var userId = int.Parse(httpContext.User.FindFirstValue("UserId"));
    var todo = await db.Todos.FindAsync(id);
    if (todo is null || todo.UserId != userId) return Results.NotFound();

    db.Todos.Remove(todo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// auth dev test route
app.MapGet("/jwt/test", [Authorize] () => {
    return Results.Ok("You are authorized");
});

app.Run();
