using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BW_API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace BW_API.Controllers;

public static class IdentityUserEndpoints
{
    public class UserRegistrationModel
    { 
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
    }

    public class LoginnModel
    { 
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public static IEndpointRouteBuilder MapIdentityUserEndpoints(this IEndpointRouteBuilder app) 
    {
        app.MapPost("/signup", CreateUser);
        app.MapPost("/signin", SignIn);
        return app;
    }

    [AllowAnonymous]
    private async static Task<IResult>CreateUser([FromServices] UserManager<AppUser> userManager, 
        [FromBody] UserRegistrationModel userRegistrationModel)
    {
        AppUser user = new AppUser() {
            UserName = userRegistrationModel.Email,
            Email = userRegistrationModel.Email,
            FullName = userRegistrationModel.FullName,
        };

        var result = await userManager.CreateAsync(user, userRegistrationModel.Password);

        if (result.Succeeded)
            return Results.Ok(result);
        else 
            return Results.BadRequest(result);
    }
    
    [AllowAnonymous]
    private async static Task<IResult>SignIn([FromServices] UserManager<AppUser> userManager, 
        [FromBody] LoginnModel loginModel, IOptions<AppSettings> appSettings)
    {
        var user = await userManager.FindByEmailAsync(loginModel.Email);

        if (user != null && await userManager.CheckPasswordAsync(user, loginModel.Password)){
            var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.Value.JWTSecret));
            var tokenDescriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(new Claim[] 
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);
            return Results.Ok(new {token});
        }
        else {
            return Results.BadRequest(new { message = "Username or password is incorrect"} );
        }
    }
}

