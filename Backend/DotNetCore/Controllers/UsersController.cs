using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Models;
using System.IdentityModel.Tokens.Jwt;

namespace Backend.Controllers 
{
    [EnableCors("CorsPolicy")]
    [Authorize(AuthenticationSchemes = "Bearer")] // round brackets content is obligatory
    public class UsersController : Controller
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }


        [HttpPost("/api/protected/users/list")]
        public async Task<IActionResult> Get([FromBody] FilterView filterView)
        {
            if(filterView == null || String.IsNullOrEmpty(filterView.Filter))
                return StatusCode(400, "No search string");

            var userId = HttpContext.User?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
            if (userId == null)
                return StatusCode(401, "Invalid user");
            var user = await _userManager.FindByIdAsync(userId);

            var filter = filterView.Filter.ToLower();
            var users = _userManager.Users
                                    .Where(x => x.UserName.ToLower().Contains(filter) && 
                                                x.UserName.ToLower() != user.UserName.ToLower())
                                    .ToList()
                                    .Select(x => new UserListModelView(){ Id = x.Id, Name = x.UserName });                          
            return Ok(users);
        }


        [HttpGet("/api/protected/userinfo")]
        public async Task<IActionResult> UserInfo()
        {
            var userId = HttpContext.User?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
            if (userId == null)
                return StatusCode(401, "Invalid user");
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { Error = "User not found" });

            return Ok(new { user.Id, Name = user.UserName, user.Email, user.Balance });
        }
    }
}
