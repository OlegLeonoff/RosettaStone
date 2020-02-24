using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Models;

public class TokenController : Controller
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly VirtualMoneyContext _db;

        public TokenController(IConfiguration configuration, 
                               UserManager<User> userManager, 
                               VirtualMoneyContext context)
        {
            _config = configuration;
            _userManager = userManager;
            _db = context;
        }


        string CreateToken(string userId, string userName){
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
                new Claim(JwtRegisteredClaimNames.Jti, userId),
            };
            var issuer = _config["Tokens:Issuer"];
            var audience = _config["Tokens:Audience"];
            var key =  _config["Tokens:Key"];
            var symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(issuer,
                                             audience,
                                             claims,
                                             expires: DateTime.Now.AddMinutes(120),  // TODO: add to config
                                             signingCredentials: creds);

            return (new JwtSecurityTokenHandler().WriteToken(token));
        }


        [EnableCors("CorsPolicy")]
        [HttpPost("/users")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestView registerRequest)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (registerRequest == null) return new StatusCodeResult(500);

            // check if the Name already exists
            User user = await _userManager.FindByNameAsync (registerRequest.Name);
            if (user != null) return StatusCode(400, "Name already exists");
            // check if the Email already exists
            user = await _userManager.FindByEmailAsync(registerRequest.Email);
            if (user != null) return StatusCode(400, "Email already exists");

            if (registerRequest.Name.Length < 2 || registerRequest.Password.Length < 2)
                return StatusCode(400, "You must send valid username and password");

            if (registerRequest.Name.Trim().Split(" ").Length > 1)
                return StatusCode(400, "Username can only contain one word");

            var newUser = new Models.User() {
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = registerRequest.Name,
                    Email = registerRequest.Email,
                    Date = DateTime.Now,
                    Balance = 500
            };

            try { 
                // Add the user to the Db with the choosen password
                await _userManager.CreateAsync(newUser, registerRequest.Password);

                // Assign the user to the 'RegisteredUser' role
                await _userManager.AddToRoleAsync(newUser, "RegisteredUser");

                // Remove Lockout and E-Mail confirmation
                newUser.EmailConfirmed = true;
                newUser.LockoutEnabled = false;
                _db.SaveChanges();
            }
            catch (Exception)
            {
                return BadRequest("Password should contain at least 7 symbols: at least one digit, one lowercase and one uppercase letter");
            }

            var token = CreateToken(newUser.Id, newUser.Email);
            return Ok(new { token });
        }

        [EnableCors("CorsPolicy")]
        [HttpPost("/sessions/create")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] AuthRequestView authUserRequest)
        {
            if(authUserRequest.Email.Length < 2 ||
                authUserRequest.Password.Length < 2) {
                   return StatusCode(400, "Invalid email or password.");
            }

            var user = await _userManager.FindByEmailAsync(authUserRequest.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, authUserRequest.Password))
            {
                // user does not exists or password mismatch
                return StatusCode(401, "Invalid user or password");
            }
            var token = CreateToken(user.Id, user.UserName);
            return Ok(new { token });
        }
    }