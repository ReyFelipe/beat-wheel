using BW_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using BW_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using BW_API.Controllers;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Fill in the JWT token",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new List<String>()
        }
    });
});

builder.Services
    .AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var allowedOrigins = builder.Configuration.GetValue<string>("allowedOrigins")!.Split(",");
builder.Services.AddCors(options => 
{
    options.AddDefaultPolicy(policy => 
    {
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

builder.Services.Configure<IdentityOptions>(options => 
{
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;    
    options.User.RequireUniqueEmail = true;
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(y =>{
        y.SaveToken = false;
        y.TokenValidationParameters = new TokenValidationParameters 
        {
            ValidateIssuerSigningKey = true,
            NameClaimType = ClaimTypes.NameIdentifier,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["AppSettings:JWTSecret"]!
            )),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization(options => {
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();
    });

builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{    
    app.UseSwagger();
    app.UseSwaggerUI(options => // UseSwaggerUI is called only in Development.
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGroup("/api")
   .MapIdentityApi<AppUser>();
app.MapGroup("/api")
   .MapIdentityUserEndpoints();

app.Run();