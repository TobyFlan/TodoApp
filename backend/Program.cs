using Microsoft.OpenApi.Models;
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
    [AllowAnonymous] (UserDto userDto) =>
    {
        // Example hardcoded user validation
        if (userDto.Username == "admin" && userDto.Password == "admin")
        {
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
        }

        return Results.Unauthorized();
    }
);



app.MapGet("/", () => "Hello World!");
app.MapGet("/todos", () => TodoDB.GetTodos());
app.MapGet("/todos/{id}", (int id) => TodoDB.GetTodo(id));
app.MapPost("/todos", (TodoItem todo) => TodoDB.AddTodo(todo));
app.MapPut("/todos/{id}", (int id, TodoItem todo) => TodoDB.UpdateTodo(id, todo));
app.MapDelete("/todos/{id}", (int id) => TodoDB.DeleteTodo(id));

// auth test route
app.MapGet("/jwt/test", () => {
    return Results.Ok("You are authorized");
}).RequireAuthorization();

app.Run();
